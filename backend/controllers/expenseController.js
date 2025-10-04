import multer from 'multer';
import path from 'path';
import Expense from '../models/Expense.js';
import Approval from '../models/Approval.js';
import { parseReceipt } from '../utils/ocrHelper.js';
import { convertAmount } from '../utils/currencyHelper.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

export const createExpense = async (req, res) => {
  try {
    let { amount, currency, category, description, date } = req.body;

    // OCR enrich - auto-fill if fields are missing
    let ocr = null;
    if (req.file) {
      ocr = await parseReceipt(req.file.path);
      // Use OCR data if user didn't provide values
      if (!amount && ocr.amount) amount = ocr.amount;
      if (!category && ocr.category) category = ocr.category;
      if (!date && ocr.date) date = ocr.date;
      if (!description && ocr.notes) description = ocr.notes;
    }

    const baseCurrency = req.user.company.baseCurrency;
    const amountBase = await convertAmount(Number(amount), currency, baseCurrency);

    const expense = await Expense.create({
      company: req.user.company._id,
      submitter: req.user._id,
      amountOriginal: Number(amount),
      currencyOriginal: currency,
      amountBase,
      currencyBase: baseCurrency,
      category: category || 'General',
      description: description || 'No description',
      date: date ? new Date(date) : new Date(),
      receiptPath: req.file?.path,
    });

    // Initialize approvals from company rules
    const rules = req.user.company.approvalRules || [];
    const approvals = [];
    
    // Add manager as first approver if isManagerApprover is set
    const managerRule = rules.find(r => r.isManagerApprover);
    if (managerRule && req.user.manager) {
      approvals.push(await Approval.create({
        expense: expense._id,
        sequenceOrder: 0,
        approver: req.user.manager,
      }));
    }
    
    // Add other approvers
    for (const r of rules) {
      if (!r.isManagerApprover) {
        approvals.push(await Approval.create({
          expense: expense._id,
          sequenceOrder: r.sequenceOrder,
          approver: r.approver,
          ruleType: r.ruleType,
          thresholdPercent: r.thresholdPercent,
        }));
      }
    }

    res.status(201).json({ expense, approvals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const listMyExpenses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const q = { submitter: req.user._id };
  const [items, total] = await Promise.all([
    Expense.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    Expense.countDocuments(q),
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
};

export const listCompanyExpenses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const q = { company: req.user.company._id };
  const [items, total] = await Promise.all([
    Expense.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('submitter'),
    Expense.countDocuments(q),
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
};

// Manager views team expenses
export const listTeamExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const User = (await import('../models/User.js')).default;
    const teamMembers = await User.find({ manager: req.user._id, company: req.user.company._id });
    const teamIds = teamMembers.map(u => u._id);
    const q = { submitter: { $in: teamIds } };
    const [items, total] = await Promise.all([
      Expense.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).populate('submitter'),
      Expense.countDocuments(q),
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
