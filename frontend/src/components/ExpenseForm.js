import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import OCRUploader from './OCRUploader';
import CurrencyBadge from './CurrencyBadge';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createExpense, fetchCurrencies } from '../services/expenseService';

const schema = yup.object({
  amount: yup.number().positive().required(),
  currency: yup.string().length(3).required(),
  category: yup.string().required(),
  description: yup.string().nullable(),
  date: yup.date().required(),
});

const ExpenseForm = ({ onSuccess }) => {
  const { data: currencies } = useQuery({ queryKey: ['currencies'], queryFn: fetchCurrencies });
  const { mutateAsync, isLoading } = useMutation({ mutationFn: createExpense });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { currency: 'USD', date: new Date().toISOString().slice(0,10) },
  });

  const currency = watch('currency');
  const amount = watch('amount');

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, v));
    if (values.receipt) formData.append('receipt', values.receipt[0]);
    await mutateAsync(formData);
    onSuccess?.();
  };

  const onOCRData = (data) => {
    if (data.amount) setValue('amount', data.amount);
    if (data.category) setValue('category', data.category);
    if (data.date) {
      // Parse date and convert to YYYY-MM-DD
      try {
        const parsed = new Date(data.date);
        if (!isNaN(parsed)) {
          setValue('date', parsed.toISOString().slice(0, 10));
        }
      } catch (e) {
        console.error('Date parse error:', e);
      }
    }
    if (data.notes) setValue('description', data.notes);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Submit New Expense</h2>
      
      <OCRUploader onParsed={onOCRData} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Amount *</label>
          <input type="number" step="0.01" className="mt-1 w-full border rounded p-2" {...register('amount')} />
          {errors.amount && <p className="text-red-600 text-sm">{errors.amount.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Currency *</label>
          <select className="mt-1 w-full border rounded p-2" {...register('currency')}>
            {currencies?.map((c) => (
              <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Category *</label>
          <input className="mt-1 w-full border rounded p-2" placeholder="e.g., Food & Dining" {...register('category')} />
          {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Date *</label>
          <input type="date" className="mt-1 w-full border rounded p-2" {...register('date')} />
          {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="mt-1 w-full border rounded p-2" rows="3" placeholder="Optional notes about this expense" {...register('description')} />
      </div>

      <div>
        <label className="block text-sm font-medium">Receipt (Optional)</label>
        <input type="file" accept="image/*,application/pdf" className="mt-1 w-full" {...register('receipt')} />
      </div>

      <CurrencyBadge amount={amount} currency={currency} />

      <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
