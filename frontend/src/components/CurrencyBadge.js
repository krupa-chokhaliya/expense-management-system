import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { convertPreview } from '../utils/currencyHelper';

const CurrencyBadge = ({ amount, currency }) => {
  const { data } = useQuery({
    queryKey: ['previewConvert', amount, currency],
    queryFn: () => convertPreview(amount, currency),
    enabled: !!amount && !!currency,
  });
  if (!amount) return null;
  return (
    <div className="text-sm text-gray-700">Converted to base: {data?.amount} {data?.base}</div>
  );
};

export default CurrencyBadge;
