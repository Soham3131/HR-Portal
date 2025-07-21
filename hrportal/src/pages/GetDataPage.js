// src/pages/hr/GetDataPage.js
import React, { useState, useEffect } from 'react';
import api from "../api/api"
import Spinner from '../components/Spinner';
import { formatDate, formatTime } from '../utils/formatDate';


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

//     // Helper function to check if the user agent string indicates a mobile device
//     const isMobile = (userAgent) => {
//         if (!userAgent) return false;
//         return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
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
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Info</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {loginRecords.map(record => (
//                             <tr key={record._id}>
//                                 <td className="px-6 py-4">
//                                     <p className="font-medium">{record.employeeId?.name || 'N/A'}</p>
//                                     <p className="text-sm text-gray-500">{record.employeeId?.employeeId || 'N/A'}</p>
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.action === 'Login' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
//                                         {record.action}
//                                     </span>
//                                 </td>
//                                 <td className="px-6 py-4 text-sm">{formatDate(record.createdAt)} at {formatTime(record.createdAt)}</td>
//                                 <td className={`px-6 py-4 font-bold ${isMobile(record.deviceInfo) ? 'text-red-600' : 'text-green-600'}`}>
//                                     {isMobile(record.deviceInfo) ? 'Mobile' : 'Desktop'}
//                                 </td>
//                                 <td className="px-6 py-4 text-xs text-gray-600 truncate max-w-xs" title={record.deviceInfo}>{record.deviceInfo}</td>
//                                 <td className="px-6 py-4 text-sm">{record.ipAddress}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default GetDataPage;

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

    // --- NEW, MORE ROBUST HELPER FUNCTION ---
    // This function analyzes the user agent to provide a more accurate device type.
    const getDeviceType = (userAgent) => {
        if (!userAgent) return { type: 'Unknown', suspicious: false };

        const ua = userAgent.toLowerCase();
        
        // Direct mobile keywords are a clear sign of a mobile device.
        if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
            return { type: 'Mobile', suspicious: true };
        }
        
        // "Desktop site" on mobile often includes "linux" but removes "mobile".
        // A user agent with "linux" but not a known desktop distro like "ubuntu" is suspicious.
        if (ua.includes('linux') && !ua.includes('ubuntu') && !ua.includes('fedora')) {
            return { type: 'Desktop (Suspicious)', suspicious: true };
        }

        // Standard desktop user agents.
        if (ua.includes('macintosh') || ua.includes('windows')) {
            return { type: 'Desktop', suspicious: false };
        }

        return { type: 'Unknown', suspicious: false };
    };

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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loginRecords.map(record => {
                            const { type, suspicious } = getDeviceType(record.deviceInfo);
                            return (
                                <tr key={record._id} className={record.action === 'Check-in' && suspicious ? 'bg-red-50' : ''}>
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
                                    <td className={`px-6 py-4 font-bold ${suspicious ? 'text-red-600' : 'text-green-600'}`}>
                                        {type}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-600 truncate max-w-xs" title={record.deviceInfo}>{record.deviceInfo}</td>
                                    <td className="px-6 py-4 text-sm">{record.ipAddress}</td>
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