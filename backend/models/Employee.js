import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: { type: String },
    title: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Employee', employeeSchema);
