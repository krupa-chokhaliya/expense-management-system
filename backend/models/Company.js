import mongoose from 'mongoose';

const approvalRuleSchema = new mongoose.Schema(
  {
    sequenceOrder: { type: Number, required: true },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    thresholdPercent: { type: Number, default: null },
    ruleType: { type: String, enum: ['percentage', 'specific', 'hybrid'], default: 'specific' },
    isManagerApprover: { type: Boolean, default: false },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    baseCurrency: { type: String, required: true },
    country: { type: String },
    approvalRules: [approvalRuleSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
