import User from '../models/User.js';

export const listUsers = async (req, res) => {
  const users = await User.find({ company: req.user.company._id }).populate('manager', 'name email');
  res.json(users);
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, manager, department } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    
    // Convert empty string to null for manager field
    const userData = {
      name,
      email,
      password,
      role,
      manager: manager && manager !== '' ? manager : null,
      department: department || '',
      company: req.user.company._id
    };
    
    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  delete updates.password; // dedicated password change endpoint can be added later
  const user = await User.findOneAndUpdate({ _id: id, company: req.user.company._id }, updates, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOneAndDelete({ _id: id, company: req.user.company._id });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};
