import React from 'react';

const ReportIncidentCard = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md flex items-center gap-6">
      <div className="w-16 h-16 bg-indigo-100 rounded-lg"></div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">See an accessibility issue?</h3>
        <p className="text-sm text-slate-500">Help improve the map by reporting it.</p>
      </div>
      <button className="bg-indigo-600 text-white font-semibold rounded-lg px-5 py-3 transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Report Incident
      </button>
    </div>
  );
};

export default ReportIncidentCard;
