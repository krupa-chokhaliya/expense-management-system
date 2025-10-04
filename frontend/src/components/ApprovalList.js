import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { myApprovals, actOnApproval } from '../services/approvalService';

const ApprovalList = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['myApprovals'], queryFn: myApprovals });
  const { mutate } = useMutation({
    mutationFn: ({ id, action, comments }) => actOnApproval(id, action, comments),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myApprovals'] }),
  });

  return (
    <div className="bg-white rounded shadow">
      <div className="p-4 border-b font-medium">Pending Approvals</div>
      <ul>
        {data?.map((a) => (
          <li key={a._id} className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Expense: {a.expense?.category} - {a.expense?.amountOriginal} {a.expense?.currencyOriginal}</div>
                <div className="text-sm text-gray-600">Submitted: {new Date(a.expense?.createdAt).toLocaleString()}</div>
              </div>
              <div className="space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => mutate({ id: a._id, action: 'Approve' })}>Approve</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => mutate({ id: a._id, action: 'Reject' })}>Reject</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovalList;
