import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listMyExpenses } from '../services/expenseService';
import Pagination from './Pagination';
import { usePagination } from '../hooks/usePagination';

const ExpenseList = () => {
  const { page, limit, setPage } = usePagination();
  const { data } = useQuery({ queryKey: ['myExpenses', page, limit], queryFn: () => listMyExpenses(page, limit) });

  return (
    <div className="bg-white rounded shadow">
      <div className="p-4 border-b font-medium">My Expenses</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((e) => (
              <tr key={e._id} className="border-t">
                <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-2">{e.category}</td>
                <td className="p-2">{e.amountOriginal} {e.currencyOriginal} ({e.amountBase} {e.currencyBase})</td>
                <td className="p-2">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2">
        <Pagination page={page} total={data?.total || 0} limit={limit} onChange={setPage} />
      </div>
    </div>
  );
};

export default ExpenseList;
