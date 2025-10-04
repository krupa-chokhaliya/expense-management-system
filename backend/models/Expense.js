import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountOriginal: { type: Number, required: true },
    currencyOriginal: { type: String, required: true },
    amountBase: { type: Number, required: true },
    currencyBase: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    receiptPath: { type: String },
    status: { type: String, enum: ['Waiting Approval', 'Approved', 'Rejected'], default: 'Waiting Approval' },
    currentApprovalOrder: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
