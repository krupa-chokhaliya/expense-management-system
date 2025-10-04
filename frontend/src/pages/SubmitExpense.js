import React from 'react';
import ExpenseForm from '../components/ExpenseForm';

const SubmitExpense = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Submit Expense</h1>
      <ExpenseForm onSuccess={() => alert('Expense submitted')} />
    </div>
  );
};

export default SubmitExpense;
