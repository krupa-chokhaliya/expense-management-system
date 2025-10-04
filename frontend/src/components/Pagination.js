import React from 'react';

const Pagination = ({ page, total, limit, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex items-center justify-between">
      <button className="px-3 py-1 border rounded" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      <span className="text-sm">Page {page} of {totalPages}</span>
      <button className="px-3 py-1 border rounded" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
};

export default Pagination;
