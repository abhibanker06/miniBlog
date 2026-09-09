import React from 'react';

const categoryStyles = {
  technology: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  lifestyle: 'bg-pink-50 text-pink-700 border-pink-200/60',
  travel: 'bg-amber-50 text-amber-700 border-amber-200/60',
  food: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  health: 'bg-teal-50 text-teal-700 border-teal-200/60',
  design: 'bg-purple-50 text-purple-700 border-purple-200/60',
  business: 'bg-blue-50 text-blue-700 border-blue-200/60',
  other: 'bg-slate-100 text-slate-700 border-slate-200/60',
};

const CategoryBadge = ({ category, className = '' }) => {
  const normalized = category ? category.toLowerCase().trim() : 'other';
  const style = categoryStyles[normalized] || categoryStyles.other;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase ${style} ${className}`}
    >
      {category || 'General'}
    </span>
  );
};

export default CategoryBadge;
