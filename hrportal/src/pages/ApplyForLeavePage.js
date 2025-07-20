// import React, { useState } from 'react';
// import api from "../api/api"
// import Button from '../components/Button';
// import { formatDate } from '../utils/formatDate';
// import { useEffect } from 'react';
// import Spinner from '../components/Spinner';

// const ApplyForLeavePage = () => {
//     const [leaveDate, setLeaveDate] = useState('');
//     const [reason, setReason] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [leaveHistory, setLeaveHistory] = useState([]);
//     const [loadingHistory, setLoadingHistory] = useState(true);

//     const preloadedContent = `To,\nThe HR Department,\nAVANI ENTERPRISES\n\nDate: ${formatDate(new Date())}\n\nSubject: Leave Application for ${leaveDate ? formatDate(leaveDate) : '[Selected Date]'}\n\nRespected Sir/Madam,\n\n`;

//     const fetchHistory = async () => {
//         try {
//             setLoadingHistory(true);
//             const { data } = await api.get('/employee/leave/history');
//             setLeaveHistory(data);
//         } catch (error) {
//             console.error("Failed to fetch leave history", error);
//         } finally {
//             setLoadingHistory(false);
//         }
//     };

//     useEffect(() => {
//         fetchHistory();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');
//         try {
//             const fullReason = preloadedContent + reason;
//             await api.post('/employee/leave', { leaveDate, reason: fullReason });
//             setMessage('Your leave application has been submitted successfully.');
//             setLeaveDate('');
//             setReason('');
//             fetchHistory(); // Refresh the history after submitting
//         } catch (error) {
//             setMessage('Failed to submit application. Please try again.');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const statusStyles = {
//         Pending: 'bg-yellow-100 text-yellow-800',
//         Approved: 'bg-green-100 text-green-800',
//         Declined: 'bg-red-100 text-red-800',
//     };

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800">Leave Management</h1>
            
//             {/* Form Section */}
//             <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
//                 <h2 className="text-2xl font-semibold mb-4">Apply for a New Leave</h2>
//                 {message && <p className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{message}</p>}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="leaveDate" className="block text-sm font-medium text-gray-700">Leave Date</label>
//                         <input type="date" id="leaveDate" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
//                     </div>
//                     <div>
//                         <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Leave</label>
//                         <div className="mt-1 p-2 border border-gray-200 bg-gray-50 rounded-md text-gray-600 text-sm whitespace-pre-line">
//                             {preloadedContent}
//                         </div>
//                         <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows="6" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" placeholder="Please state the reason for your leave here..."/>
//                     </div>
//                     <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</Button>
//                 </form>
//             </div>

//             {/* History Section */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//                 <h2 className="text-2xl font-semibold mb-4">Your Leave Application History</h2>
//                 {loadingHistory ? <Spinner /> : (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Applied</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {leaveHistory.map(req => (
//                                     <tr key={req._id}>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(req.createdAt)}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(req.leaveDate)}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[req.status]}`}>
//                                                 {req.status}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ApplyForLeavePage;

import React, { useState, useEffect } from 'react';
import api from "../api/api";
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { formatDate } from '../utils/formatDate';
import { motion } from 'framer-motion';

const ApplyForLeavePage = () => {
  const [leaveDate, setLeaveDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const preloadedContent = `To,\nThe HR Department,\nAVANI ENTERPRISES\n\nDate: ${formatDate(new Date())}\n\nSubject: Leave Application for ${leaveDate ? formatDate(leaveDate) : '[Selected Date]'}\n\nRespected Sir/Madam,\n\n`;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const { data } = await api.get('/employee/leave/history');
        setLeaveHistory(data);
      } catch (error) {
        console.error("Failed to fetch leave history", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const fullReason = preloadedContent + reason;
      await api.post('/employee/leave', { leaveDate, reason: fullReason });
      setMessage('✅ Your leave application has been submitted successfully.');
      setLeaveDate('');
      setReason('');
      // Refresh history
      const { data } = await api.get('/employee/leave/history');
      setLeaveHistory(data);
    } catch (error) {
      setMessage('❌ Failed to submit application. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Declined: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6 md:p-10 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6 drop-shadow-sm">📝 Leave Management</h1>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Apply for a New Leave</h2>

          {message && (
            <motion.p
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-3 rounded-md text-sm font-medium ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {message}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="leaveDate" className="block text-sm font-medium text-gray-700">Leave Date</label>
              <input
                type="date"
                id="leaveDate"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Leave</label>
              <div className="mt-1 p-3 bg-gray-50 text-sm text-gray-600 border border-gray-200 rounded-md whitespace-pre-line font-mono">
                {preloadedContent}
              </div>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="6"
                placeholder="Please state the reason for your leave..."
                className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </motion.div>
          </form>
        </div>

        {/* History */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">📚 Leave History</h2>
          {loadingHistory ? (
            <div className="py-10"><Spinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Applied On</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Leave Date</th>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {leaveHistory.map((req) => (
                    <tr key={req._id}>
                      <td className="px-6 py-4 text-gray-500">{formatDate(req.createdAt)}</td>
                      <td className="px-6 py-4 text-gray-800">{formatDate(req.leaveDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[req.status]}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ApplyForLeavePage;
