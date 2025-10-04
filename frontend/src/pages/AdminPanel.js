import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listUsers, createUser, updateUser, deleteUser } from '../services/authService';
import { getCompany, updateApprovalRules } from '../services/apiClient';

const RolePill = ({ role }) => (
  <span className={`px-2 py-0.5 rounded text-xs ${role === 'Admin' ? 'bg-purple-100 text-purple-700' : role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{role}</span>
);

const AdminPanel = () => {
  const qc = useQueryClient();
  const { data: users } = useQuery({ queryKey: ['users'], queryFn: listUsers });
  const { data: company } = useQuery({ queryKey: ['company'], queryFn: getCompany });

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Employee', manager: '', department: '' });
  const [rules, setRules] = useState([]);

  React.useEffect(() => {
    if (company?.approvalRules) setRules(company.approvalRules.map(r => ({
      sequenceOrder: r.sequenceOrder,
      approver: r.approver?._id || r.approver,
      thresholdPercent: r.thresholdPercent || null,
      ruleType: r.ruleType || 'specific',
      isManagerApprover: r.isManagerApprover || false,
    })));
  }, [company]);

  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, updates }) => updateUser(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
  const rulesMut = useMutation({
    mutationFn: (payload) => updateApprovalRules(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['company'] }),
  });

  const managersAndAdmins = useMemo(() => (users || []).filter(u => u.role !== 'Employee'), [users]);

  const addRule = () => setRules(prev => [...prev, { sequenceOrder: prev.length + 1, approver: managersAndAdmins[0]?._id, thresholdPercent: null, ruleType: 'specific' }]);
  const removeRule = (idx) => setRules(prev => prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, sequenceOrder: i + 1 })));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>

      <section className="bg-white rounded shadow">
        <div className="p-4 border-b font-medium">Users</div>
        <div className="p-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Manager</th>
                    <th className="p-2">Dept</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map(u => (
                    <tr key={u._id} className="border-t">
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2"><RolePill role={u.role} /></td>
                      <td className="p-2 text-xs">{u.manager?.name || '-'}</td>
                      <td className="p-2 text-xs">{u.department || '-'}</td>
                      <td className="p-2 text-right space-x-2">
                        <button className="px-2 py-1 border rounded text-xs" onClick={() => updateMut.mutate({ id: u._id, updates: { role: u.role === 'Employee' ? 'Manager' : 'Employee' } })}>Toggle Role</button>
                        <button className="px-2 py-1 border rounded text-red-600 text-xs" onClick={() => deleteMut.mutate(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Create User</h3>
            <div className="space-y-2">
              <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <select className="w-full border p-2 rounded" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option>Employee</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
              <select className="w-full border p-2 rounded" value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })}>
                <option value="">No Manager</option>
                {managersAndAdmins.map(m => <option key={m._id} value={m._id}>{m.name} ({m.role})</option>)}
              </select>
              <input className="w-full border p-2 rounded" placeholder="Department (optional)" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
              <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={() => createMut.mutate(form)}>Create</button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded shadow">
        <div className="p-4 border-b font-medium">Approval Rules</div>
        <div className="p-4 space-y-3">
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={rules.some(r => r.isManagerApprover)} onChange={e => {
                if (e.target.checked) {
                  setRules(prev => [{ sequenceOrder: 0, approver: null, isManagerApprover: true, ruleType: 'specific' }, ...prev.map((r, i) => ({ ...r, sequenceOrder: i + 1 }))]);
                } else {
                  setRules(prev => prev.filter(r => !r.isManagerApprover).map((r, i) => ({ ...r, sequenceOrder: i + 1 })));
                }
              }} />
              <span className="text-sm font-medium">Require manager approval first (if employee has assigned manager)</span>
            </label>
          </div>
          {rules.map((r, idx) => (
            <div key={idx} className="grid md:grid-cols-5 gap-2 items-center border p-3 rounded">
              <div className="font-medium">Step {idx + 1}</div>
              {r.isManagerApprover ? (
                <div className="md:col-span-3 text-sm text-gray-600 italic">Employee's Manager (auto-assigned)</div>
              ) : (
                <>
                  <select className="border p-2 rounded" value={r.approver || ''} onChange={e => setRules(prev => prev.map((x, i) => i === idx ? { ...x, approver: e.target.value } : x))}>
                    <option value="">Select Approver</option>
                    {managersAndAdmins.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                  </select>
                  <select className="border p-2 rounded" value={r.ruleType} onChange={e => setRules(prev => prev.map((x, i) => i === idx ? { ...x, ruleType: e.target.value } : x))}>
                    <option value="specific">Specific (auto-approve if this person approves)</option>
                    <option value="percentage">Percentage (approve if % threshold met)</option>
                    <option value="hybrid">Hybrid (percentage OR specific)</option>
                    <option value="sequential">Sequential (all must approve in order)</option>
                  </select>
                  <input className="border p-2 rounded" placeholder="Threshold %" type="number" value={r.thresholdPercent ?? ''} onChange={e => setRules(prev => prev.map((x, i) => i === idx ? { ...x, thresholdPercent: e.target.value ? Number(e.target.value) : null } : x))} />
                </>
              )}
              <div className="text-right">
                <button className="text-red-600 text-sm hover:underline" onClick={() => removeRule(idx)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button className="px-3 py-1 border rounded" onClick={addRule}>Add Rule</button>
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => rulesMut.mutate({ approvalRules: rules })}>Save Rules</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
