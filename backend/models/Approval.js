import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
    sequenceOrder: { type: Number, required: true },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Overridden'], default: 'Pending' },
    comments: { type: String },
    actedAt: { type: Date },
    ruleType: { type: String, enum: ['percentage', 'specific', 'hybrid', 'sequential'], default: 'sequential' },
    thresholdPercent: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model('Approval', approvalSchema);
