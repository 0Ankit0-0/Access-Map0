import React from 'react';

const MapPreviewCard = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">Map Overview</h3>
      <div className="w-full h-full bg-slate-200 rounded-lg mt-4 flex items-center justify-center">
        Map Preview Area
      </div>
    </div>
  );
};

export default MapPreviewCard;
