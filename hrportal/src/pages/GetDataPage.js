

// import React, { useState, useEffect } from 'react';
// import api from "../api/api";
// import Spinner from '../components/Spinner';
// import { formatDate, formatTime } from '../utils/formatDate';

// const GetDataPage = () => {
//     const [loginRecords, setLoginRecords] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await api.get('/hr/getdata');
//                 setLoginRecords(data);
//             } catch (error) {
//                 console.error("Failed to fetch login data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

    

//     const getDeviceType = (userAgent) => {
//         if (!userAgent) return 'Unknown';
//         if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
//             return 'Mobile';
//         }
//         if (userAgent.includes('Linux') && !userAgent.includes('Ubuntu')) {
//             return 'Desktop (Suspicious)';
//         }
//         if (userAgent.includes('Macintosh') || userAgent.includes('Windows')) {
//             return 'Desktop';
//         }
//         return 'Unknown';
//     };

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800">Employee Activity Log</h1>
//             <div className="overflow-x-auto bg-white rounded-lg shadow">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Type</th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Touch Device?</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Info</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Model</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {loginRecords.map(record => {
//                             const deviceType = getDeviceType(record.deviceInfo);
//                             const isSuspicious = record.isTouchDevice;

//                             return (
//                                 <tr key={record._id} className={record.action === 'Check-in' && isSuspicious ? 'bg-orange-50' : ''}>
//                                     <td className="px-6 py-4">
//                                         <p className="font-medium">{record.employeeId?.name || 'N/A'}</p>
//                                         <p className="text-sm text-gray-500">{record.employeeId?.employeeId || 'N/A'}</p>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.action === 'Login' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
//                                             {record.action}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-sm">{formatDate(record.createdAt)} at {formatTime(record.createdAt)}</td>
//                                     <td className="px-6 py-4 font-bold">{deviceType}</td>
//                                     <td className="px-6 py-4 text-center">
//                                         <span className={`px-3 py-1 text-xs font-bold rounded-full ${isSuspicious ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                                             {isSuspicious ? 'YES' : 'NO'}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-xs text-gray-600 truncate max-w-xs" title={record.deviceInfo}>{record.deviceInfo}</td>
//                                     <td className="px-6 py-4 text-xs">{record.ipAddress || 'N/A'}</td>
                                    
//                                     <td className="px-6 py-4 text-xs">
//  {record.location && record.location !== "Unknown" && record.latitude && record.longitude ? (
//   <a
//     href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}

//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-blue-600 hover:underline flex items-center space-x-1"
//     >
//       <span>{record.location}</span>
//       <span role="img" aria-label="map">📍</span>
//     </a>
//   ) : (
//     "Unknown"
//   )}
// </td>
// <td className="px-6 py-4 text-xs font-semibold">{record.deviceModel || "Unknown"}</td>

//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default GetDataPage;

import React, { useState, useEffect } from 'react';
import api from "../api/api";
import Spinner from '../components/Spinner';
import { formatDate, formatTime } from '../utils/formatDate';

const GetDataPage = () => {
    const [loginRecords, setLoginRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/hr/getdata');
                setLoginRecords(data);
            } catch (error) {
                console.error("Failed to fetch login data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Employee Activity Log</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Type</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Touch Device?</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Model</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loginRecords.map(record => {
                            return (
                                <tr key={record._id} className={record.action === 'Check-in' && record.isTouchDevice ? 'bg-orange-50' : ''}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{record.employeeId?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500">{record.employeeId?.employeeId || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.action === 'Login' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                            {record.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{formatDate(record.createdAt)} at {formatTime(record.createdAt)}</td>
                                    <td className="px-6 py-4 font-bold">{record.isTouchDevice ? "Mobile" : "Desktop"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${record.isTouchDevice ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {record.isTouchDevice ? 'YES' : 'NO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600 truncate max-w-xs" title={record.deviceInfo}>{record.deviceInfo}</td>
                                    <td className="px-6 py-4 text-xs">{record.ipAddress || 'N/A'}</td>
                                    
                                    <td className="px-6 py-4 text-xs">
                                        {record.location && record.location !== "Unknown" && record.latitude && record.longitude ? (
                                        <a
                                            href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}

                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline flex items-center space-x-1"
                                        >
                                            <span>{record.location}</span>
                                            <span role="img" aria-label="map">📍</span>
                                        </a>
                                        ) : (
                                        "Unknown"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold">{record.deviceModel || "Unknown"}</td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GetDataPage;
