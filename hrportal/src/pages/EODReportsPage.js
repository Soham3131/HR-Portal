// import React, { useState, useEffect,useMemo } from 'react';
// import Button from '../components/Button';
// import api from '../api/api';
// import Spinner from '../components/Spinner';
// import Modal from '../components/Modal';
// import { formatDate } from '../utils/formatDate';

// const EODReportsPage = () => {
//     const [allReports, setAllReports] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [notSubmitted, setNotSubmitted] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     const [selectedEod, setSelectedEod] = useState(null);
//     const [isEodModalOpen, setEodModalOpen] = useState(false);

//     const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
//     const [searchTerm, setSearchTerm] = useState('');

//     const [isMonthlyReportModalOpen, setMonthlyReportModalOpen] = useState(false);
//     const [monthlyReportData, setMonthlyReportData] = useState([]);

//     // Fetch constant data (all reports, all employees) only once on component mount
//     useEffect(() => {
//         const fetchInitialData = async () => {
//             try {
//                 setLoading(true);
//                 const [allReportsRes, allEmployeesRes] = await Promise.all([
//                     api.get('/hr/eod-reports'), // Gets all reports ever submitted
//                     api.get('/hr/employees')   // Gets all employees
//                 ]);
//                 setAllReports(allReportsRes.data.reports);
//                 setEmployees(allEmployeesRes.data);
//             } catch (error) {
//                 console.error("Failed to fetch initial data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInitialData();
//     }, []); // Empty dependency array ensures this runs only once

//     // Fetch data that depends on the filterDate (i.e., the list of who hasn't submitted)
//     useEffect(() => {
//         const fetchNotSubmitted = async () => {
//             try {
//                 const { data: eodData } = await api.get(`/hr/eod-reports?date=${filterDate}`);
//                 setNotSubmitted(eodData.notSubmittedList);
//             } catch (error) {
//                 console.error("Failed to fetch non-submission data for the selected date", error);
//             }
//         };
//         fetchNotSubmitted();
//     }, [filterDate]); // This runs only when filterDate changes

//     // Filter displayed reports based on search term AND selected date
//     const filteredReports = useMemo(() => {
//         return allReports
//             .filter(report => report.date.startsWith(filterDate))
//             .filter(report => {
//                 // --- CRASH FIX: Add robust checks to prevent crash ---
//                 if (!report.employeeId) return false; // Skip if employee record is missing
//                 if (!searchTerm) return true; // Show all if search is empty

//                 // Safely check name and employeeId before calling toLowerCase()
//                 const nameMatch = report.employeeId.name && report.employeeId.name.toLowerCase().includes(searchTerm.toLowerCase());
//                 const idMatch = report.employeeId.employeeId && report.employeeId.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
                
//                 return nameMatch || idMatch;
//             });
//     }, [allReports, searchTerm, filterDate]);

//     const handleCardClick = (report) => {
//         setSelectedEod(report);
//         setEodModalOpen(true);
//     };

//     const handleGenerateMonthlyReport = () => {
//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();

//         const monthReports = allReports.filter(report => {
//             const reportDate = new Date(report.date);
//             return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
//         });

//         const eodCounts = {};
//         monthReports.forEach(report => {
//             if (report.employeeId) { // Ensure employeeId exists
//                 const empId = report.employeeId._id;
//                 if (!eodCounts[empId]) {
//                     eodCounts[empId] = 0;
//                 }
//                 eodCounts[empId] += 1;
//             }
//         });
        
//         const reportData = employees.map(emp => ({
//             name: emp.name,
//             department: emp.department,
//             count: eodCounts[emp._id] || 0,
//         }));

//         setMonthlyReportData(reportData);
//         setMonthlyReportModalOpen(true);
//     };

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className="space-y-8">
//             <div className="flex flex-wrap justify-between items-center gap-4">
//                 <h1 className="text-3xl font-bold text-gray-800">End-of-Day Reports</h1>
//                 <Button onClick={handleGenerateMonthlyReport}>Generate Monthly Report</Button>
//             </div>

//             <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4 items-center">
//                 <div className="flex-grow">
//                     <label htmlFor="search" className="sr-only">Search</label>
//                     <input 
//                         type="text"
//                         id="search"
//                         placeholder="Search by name or ID in the reports below..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full p-2 border border-gray-300 rounded-md"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="filterDate" className="mr-2 text-sm font-medium">Date:</label>
//                     <input 
//                         type="date" 
//                         id="filterDate"
//                         value={filterDate}
//                         onChange={(e) => setFilterDate(e.target.value)}
//                         className="p-2 border border-gray-300 rounded-md"
//                     />
//                 </div>
//             </div>

//             <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
//                 <h2 className="text-xl font-semibold text-orange-800 mb-2">Pending EOD Submissions for {formatDate(filterDate)}</h2>
//                 {notSubmitted.length > 0 ? (
//                     <ul className="list-disc list-inside">
//                         {notSubmitted.map(emp => (
//                             <li key={emp._id} className="text-orange-700">
//                                 <span className="font-medium">{emp.name}</span> ({emp.department}) - ID: {emp.employeeId}
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-gray-600">All present employees have submitted their EOD reports for this date.</p>
//                 )}
//             </div>

//             <div>
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">Submitted Reports for {formatDate(filterDate)}</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredReports.map(report => (
//                         <div key={report._id} onClick={() => handleCardClick(report)} className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow">
//                             <p className="font-bold text-lg text-blue-600">{report.employeeId.name}</p>
//                             <p className="text-sm text-gray-500">{report.employeeId.department} - {report.employeeId.employeeId}</p>
//                             <p className="text-sm text-gray-400 mt-1">{formatDate(report.date)}</p>
//                             <p className="mt-2 text-gray-700 italic truncate">"{report.eod}"</p>
//                         </div>
//                     ))}
//                 </div>
//                  {filteredReports.length === 0 && !loading && (
//                     <p className="text-gray-500 mt-4">No EOD reports found for this date or search criteria.</p>
//                 )}
//             </div>

//             {selectedEod && (
//                 <Modal isOpen={isEodModalOpen} onClose={() => setEodModalOpen(false)} title={`EOD from ${selectedEod.employeeId.name}`}>
//                     <div className="space-y-4">
//                         <div>
//                             <p className="font-semibold">Date:</p>
//                             <p>{formatDate(selectedEod.date)}</p>
//                         </div>
//                         <div>
//                             <p className="font-semibold">Report:</p>
//                             <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{selectedEod.eod}</p>
//                         </div>
//                     </div>
//                     <div className="mt-6 flex justify-end">
//                         <Button onClick={() => setEodModalOpen(false)} variant="secondary">Close</Button>
//                     </div>
//                 </Modal>
//             )}

//             <Modal isOpen={isMonthlyReportModalOpen} onClose={() => setMonthlyReportModalOpen(false)} title="Monthly EOD Submission Report">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
//                             <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">EODs Submitted this Month</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {monthlyReportData.map(item => (
//                             <tr key={item.name}>
//                                 <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.department}</td>
//                                 <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{item.count}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                  <div className="mt-6 flex justify-end">
//                     <Button onClick={() => setMonthlyReportModalOpen(false)} variant="secondary">Close</Button>
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// export default EODReportsPage;

import React, { useState, useEffect, useMemo } from 'react';
import Button from '../components/Button';
import api from '../api/api';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import { formatDate } from '../utils/formatDate';

const EODReportsPage = () => {
  const [allReports, setAllReports] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [notSubmitted, setNotSubmitted] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEod, setSelectedEod] = useState(null);
  const [isEodModalOpen, setEodModalOpen] = useState(false);

  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const [isMonthlyReportModalOpen, setMonthlyReportModalOpen] = useState(false);
  const [monthlyReportData, setMonthlyReportData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [allReportsRes, allEmployeesRes] = await Promise.all([
          api.get('/hr/eod-reports'),
          api.get('/hr/employees')
        ]);
        setAllReports(allReportsRes.data.reports);
        setEmployees(allEmployeesRes.data);
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchNotSubmitted = async () => {
      try {
        const { data: eodData } = await api.get(`/hr/eod-reports?date=${filterDate}`);
        setNotSubmitted(eodData.notSubmittedList);
      } catch (error) {
        console.error("Failed to fetch non-submission data for the selected date", error);
      }
    };
    fetchNotSubmitted();
  }, [filterDate]);

  const filteredReports = useMemo(() => {
    return allReports
      .filter(report => report.date.startsWith(filterDate))
      .filter(report => {
        if (!report.employeeId) return false;
        if (!searchTerm) return true;
        const nameMatch = report.employeeId.name && report.employeeId.name.toLowerCase().includes(searchTerm.toLowerCase());
        const idMatch = report.employeeId.employeeId && report.employeeId.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || idMatch;
      });
  }, [allReports, searchTerm, filterDate]);

  const handleCardClick = (report) => {
    setSelectedEod(report);
    setEodModalOpen(true);
  };

  const handleGenerateMonthlyReport = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthReports = allReports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
    });

    const eodCounts = {};
    monthReports.forEach(report => {
      if (report.employeeId) {
        const empId = report.employeeId._id;
        if (!eodCounts[empId]) {
          eodCounts[empId] = 0;
        }
        eodCounts[empId] += 1;
      }
    });

    const reportData = employees.map(emp => ({
      name: emp.name,
      department: emp.department,
      count: eodCounts[emp._id] || 0,
    }));

    setMonthlyReportData(reportData);
    setMonthlyReportModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

  return (
    <div className="space-y-10 bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-xl animate-fade-in-up">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">📄 End-of-Day Reports</h1>
        <Button onClick={handleGenerateMonthlyReport} className="animate-pulse">Generate Monthly Report</Button>
      </div>

      <div className="bg-white/60 backdrop-blur-lg p-6 rounded-xl shadow-xl flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm"
        />
        <div>
          <label className="text-sm font-medium text-gray-600 mr-2">📅 Date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">⚠️ Pending Submissions for {formatDate(filterDate)}</h2>
        {notSubmitted.length > 0 ? (
          <ul className="list-disc list-inside text-yellow-700">
            {notSubmitted.map(emp => (
              <li key={emp._id}><span className="font-bold">{emp.name}</span> ({emp.department}) - ID: {emp.employeeId}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">✅ All present employees have submitted their EOD reports.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">✅ Submitted Reports for {formatDate(filterDate)}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <div
              key={report._id}
              onClick={() => handleCardClick(report)}
              className="bg-white/80 p-5 rounded-xl shadow-md hover:shadow-xl cursor-pointer transform transition duration-300 hover:scale-[1.02] animate-fade-in-up"
            >
              <p className="text-lg font-semibold text-blue-700">{report.employeeId.name}</p>
              <p className="text-sm text-gray-600">{report.employeeId.department} - {report.employeeId.employeeId}</p>
              <p className="text-sm text-gray-400 mt-1">🗓 {formatDate(report.date)}</p>
              <p className="mt-2 text-gray-800 italic truncate">"{report.eod}"</p>
            </div>
          ))}
        </div>
        {filteredReports.length === 0 && !loading && (
          <p className="text-gray-500 mt-4">No EOD reports found for this date or search criteria.</p>
        )}
      </div>

      {selectedEod && (
        <Modal isOpen={isEodModalOpen} onClose={() => setEodModalOpen(false)} title={`📝 Report from ${selectedEod.employeeId.name}`}>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Date:</p>
              <p>{formatDate(selectedEod.date)}</p>
            </div>
            <div>
              <p className="font-semibold">Report:</p>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md shadow-inner">{selectedEod.eod}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setEodModalOpen(false)} variant="secondary">Close</Button>
          </div>
        </Modal>
      )}

      <Modal isOpen={isMonthlyReportModalOpen} onClose={() => setMonthlyReportModalOpen(false)} title="📆 Monthly EOD Report">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">EODs This Month</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyReportData.map(item => (
              <tr key={item.name} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.department}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 text-center">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setMonthlyReportModalOpen(false)} variant="secondary">Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default EODReportsPage;
