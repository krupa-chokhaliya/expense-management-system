import Approval from '../models/Approval.js';
import Expense from '../models/Expense.js';
import Company from '../models/Company.js';

export const myPendingApprovals = async (req, res) => {
  const items = await Approval.find({ approver: req.user._id, status: 'Pending' }).populate({
    path: 'expense',
    populate: { path: 'submitter', select: 'name email' }
  });
  res.json(items);
};

export const actOnApproval = async (req, res) => {
  const { approvalId } = req.params;
  const { action, comments } = req.body; // action: 'Approve' | 'Reject'

  const approval = await Approval.findOne({ _id: approvalId, approver: req.user._id });
  if (!approval) return res.status(404).json({ message: 'Approval not found' });

  if (approval.status !== 'Pending') return res.status(400).json({ message: 'Already acted' });

  approval.status = action === 'Approve' ? 'Approved' : 'Rejected';
  approval.comments = comments;
  approval.actedAt = new Date();
  await approval.save();

  const expense = await Expense.findById(approval.expense);

  if (approval.status === 'Rejected') {
    expense.status = 'Rejected';
    await expense.save();
    return res.json({ message: 'Expense rejected', approval, expense });
  }

  // Check conditional approval rules
  const company = await Company.findById(expense.company);
  const allApprovals = await Approval.find({ expense: expense._id }).populate('approver');
  const approvedCount = allApprovals.filter(a => a.status === 'Approved').length;
  const totalCount = allApprovals.length;
  
  // Check for specific approver rule (auto-approve if specific person approves)
  const specificRule = company.approvalRules.find(r => r.ruleType === 'specific' && r.approver?.toString() === req.user._id.toString());
  if (specificRule) {
    expense.status = 'Approved';
    await expense.save();
    return res.json({ message: 'Expense auto-approved (specific approver rule)', approval, expense });
  }
  
  // Check percentage rule
  const percentageRule = company.approvalRules.find(r => r.ruleType === 'percentage' || r.ruleType === 'hybrid');
  if (percentageRule && percentageRule.thresholdPercent) {
    const approvalPercent = (approvedCount / totalCount) * 100;
    if (approvalPercent >= percentageRule.thresholdPercent) {
      expense.status = 'Approved';
      await expense.save();
      return res.json({ message: 'Expense approved (percentage threshold met)', approval, expense });
    }
  }

  // Check if there are remaining approvals
  const remaining = await Approval.find({ expense: expense._id, status: 'Pending' }).sort({ sequenceOrder: 1 });
  if (remaining.length === 0) {
    expense.status = 'Approved';
  } else {
    expense.currentApprovalOrder = remaining[0].sequenceOrder;
  }
  await expense.save();

  res.json({ message: 'Action recorded', approval, expense });
};

// Admin override approval
export const adminOverride = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin only' });
    
    const { expenseId } = req.params;
    const { action, comments } = req.body; // 'Approve' | 'Reject'
    
    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    
    expense.status = action === 'Approve' ? 'Approved' : 'Rejected';
    await expense.save();
    
    // Mark all pending approvals as overridden
    await Approval.updateMany(
      { expense: expenseId, status: 'Pending' },
      { status: 'Overridden', comments: `Admin override: ${comments || 'No comment'}`, actedAt: new Date() }
    );
    
    res.json({ message: `Expense ${action.toLowerCase()}d by admin override`, expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
