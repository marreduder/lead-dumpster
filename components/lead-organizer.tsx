use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, BarChart2, Filter } from 'lucide-react';

interface Lead {
  industry?: string;
  companySize?: string;
  location?: string;
  status?: string;
  [key: string]: any;
}

interface Stats {
  industries: Record<string, number>;
  companySizes: Record<string, number>;
  locations: Record<string, number>;
  interactionStatus: Record<string, number>;
}

const LeadOrganizer = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          setLeads(results.data as Lead[]);
          analyzeLeads(results.data as Lead[]);
        }
      });
    }
  };

  const analyzeLeads = (data: Lead[]) => {
    const stats: Stats = {
      industries: {},
      companySizes: {},
      locations: {},
      interactionStatus: {},
    };

    data.forEach(lead => {
      if (lead.industry) {
        stats.industries[lead.industry] = (stats.industries[lead.industry] || 0) + 1;
      }
      if (lead.companySize) {
        stats.companySizes[lead.companySize] = (stats.companySizes[lead.companySize] || 0) + 1;
      }
      if (lead.location) {
        stats.locations[lead.location] = (stats.locations[lead.location] || 0) + 1;
      }
      if (lead.status) {
        stats.interactionStatus[lead.status] = (stats.interactionStatus[lead.status] || 0) + 1;
      }
    });

    setStats(stats);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LeadDumpster</h1>
        <p className="text-gray-600">Organize and analyze your leads effectively</p>
      </div>

      <div className="mb-8 p-6 border-2 border-dashed rounded-lg text-center">
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload CSV File
        </label>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center mb-4">
              <BarChart2 className="mr-2" />
              <h2 className="text-xl font-semibold">Industries</h2>
            </div>
            <div className="space-y-2">
              {Object.entries(stats.industries).map(([industry, count]) => (
                <div key={industry} className="flex justify-between">
                  <span>{industry}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center mb-4">
              <Filter className="mr-2" />
              <h2 className="text-xl font-semibold">Company Sizes</h2>
            </div>
            <div className="space-y-2">
              {Object.entries(stats.companySizes).map(([size, count]) => (
                <div key={size} className="flex justify-between">
                  <span>{size}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center mb-4">
              <Filter className="mr-2" />
              <h2 className="text-xl font-semibold">Interaction Status</h2>
            </div>
            <div className="space-y-2">
              {Object.entries(stats.interactionStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between">
                  <span>{status}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center mb-4">
              <Filter className="mr-2" />
              <h2 className="text-xl font-semibold">Top Locations</h2>
            </div>
            <div className="space-y-2">
              {Object.entries(stats.locations)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([location, count]) => (
                  <div key={location} className="flex justify-between">
                    <span>{location}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadOrganizer;
