"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';

const Reporting = () => {
  const { isAuthenticated, user, isLoading } = useAuth('administrator');

  const [reportData, setReportData] = useState({
    reportType: "",
    startDate: "",
    endDate: "",
    format: ""
  });

  // const [downloadLink, setDownloadLink] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!reportData.reportType || !reportData.format) {
      console.error('Report Type and Format are required.');
      return;
    }
  
    axios.post(`http://localhost:8080/reports/generate`, reportData, {
      withCredentials: true,
      responseType: 'blob' 
    })
    .then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${reportData.format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch(err => {
      console.error('Error:', err);
    });
  };
  

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Generate Reports</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              className="block w-full p-2 border border-gray-300 rounded"
              value={reportData.reportType}
              onChange={e => setReportData({ ...reportData, reportType: e.target.value })}
              required
            >
              <option value="">Select Report Type</option>
              <option value="volunteer">Volunteer Participation</option>
              <option value="event">Event Management</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              className="block w-full p-2 border border-gray-300 rounded"
              value={reportData.startDate}
              onChange={e => setReportData({ ...reportData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              className="block w-full p-2 border border-gray-300 rounded"
              value={reportData.endDate}
              onChange={e => setReportData({ ...reportData, endDate: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              className="block w-full p-2 border border-gray-300 rounded"
              value={reportData.format}
              onChange={e => setReportData({ ...reportData, format: e.target.value })}
              required
            >
              <option value="">Select Format</option>
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
            </select>
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            type="submit"
          >
            Generate Report
          </button>
        </form>


        
      </div>
    </div>
  );
};

export default Reporting;
