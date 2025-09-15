import React from 'react';

const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
};

export default StatsCard;
