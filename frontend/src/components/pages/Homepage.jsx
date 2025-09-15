import React from 'react';
import MapPreviewCard from '../MapPreviewCard';
import ReportIncidentCard from '../ReportIncidentCard';
import RecentIncidentsCard from '../RecentIncidentsCard';
import StatsCard from '../StatsCard';

const HomePage = () => {
  return (
    <div className="p-8 bg-slate-100">
      <h1 className="text-4xl font-bold text-slate-900">Welcome back, John Doe</h1>
      <p className="text-slate-500 mt-2">Here's a snapshot of your community's accessibility map.</p>
      {/* Pagination UI can be implemented here for incidents list, using page and limit query params */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-6">
        <div className="md:col-span-2 md:row-span-2">
          <MapPreviewCard />
        </div>
        <div className="md:col-span-2">
          <ReportIncidentCard />
        </div>
        <div className="md:col-span-2 md:row-span-2">
          <RecentIncidentsCard />
        </div>
        <div className="md:col-span-1">
          <StatsCard title="Approved Incidents" value="142" />
        </div>
        <div className="md:col-span-1">
          <StatsCard title="Total Reports" value="256" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
