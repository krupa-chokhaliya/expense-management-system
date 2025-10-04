import Company from '../models/Company.js';

export const getCompany = async (req, res) => {
  const company = await Company.findById(req.user.company._id).populate('approvalRules.approver');
  res.json(company);
};

export const updateApprovalRules = async (req, res) => {
  const { approvalRules = [] } = req.body;
  // Expect array of { sequenceOrder, approver, thresholdPercent, ruleType }
  const updated = await Company.findByIdAndUpdate(
    req.user.company._id,
    { approvalRules },
    { new: true }
  ).populate('approvalRules.approver');
  res.json(updated);
};
