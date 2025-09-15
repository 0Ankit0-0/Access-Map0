import React from 'react';

const RecentIncidentsCard = () => {
  const incidents = [
    { title: 'Blocked Sidewalk on Main St.', type: 'Obstacle' },
    { title: 'Missing Ramp at Library', type: 'Infrastructure' },
    { title: 'Uneven Pavement in Park', type: 'Surface' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">Recent Community Reports</h3>
      <div className="mt-4 space-y-4">
        {incidents.map((incident, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">{incident.title}</p>
              <p className="text-sm text-slate-500">{incident.type}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">Pending</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentIncidentsCard;
