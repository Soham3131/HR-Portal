// import React, { useState, useEffect } from 'react';
// import api from "../api/api"
// import Spinner from '../components/Spinner';
// import Button from '../components/Button';
// import { formatDate } from '../utils/formatDate';

// const ApproveLeavePage = () => {
//     const [pendingLeaves, setPendingLeaves] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchPendingLeaves = async () => {
//         try {
//             setLoading(true);
//             const { data } = await api.get('/hr/leaves/pending');
//             setPendingLeaves(data);
//         } catch (error) {
//             console.error("Failed to fetch pending leaves", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPendingLeaves();
//     }, []);

//     const handleUpdateStatus = async (id, status) => {
//         try {
//             await api.put(`/hr/leaves/${id}/status`, { status });
//             // Remove the processed leave from the list
//             setPendingLeaves(pendingLeaves.filter(leave => leave._id !== id));
//         } catch (error) {
//             console.error("Failed to update leave status", error);
//             alert("Action failed. Please try again.");
//         }
//     };

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className="space-y-6">
//             <h1 className="text-3xl font-bold text-gray-800">Approve Leave Requests</h1>
//             {pendingLeaves.length > 0 ? (
//                 <div className="space-y-4">
//                     {pendingLeaves.map(leave => (
//                         <div key={leave._id} className="bg-white p-6 rounded-lg shadow-md">
//                             <div className="flex justify-between items-start">
//                                 <div>
//                                     <p className="font-bold text-lg">{leave.employeeId.name} <span className="text-sm font-normal text-gray-500">({leave.employeeId.employeeId})</span></p>
//                                     <p className="text-sm text-gray-600">{leave.employeeId.department}</p>
//                                 </div>
//                                 <p className="font-semibold">Leave Date: {formatDate(leave.leaveDate)}</p>
//                             </div>
//                             <div className="mt-4 border-t pt-4">
//                                 <p className="text-sm text-gray-700 whitespace-pre-wrap">{leave.reason}</p>
//                             </div>
//                             <div className="mt-4 flex justify-end space-x-2">
//                                 <Button onClick={() => handleUpdateStatus(leave._id, 'Declined')} variant="danger">Decline</Button>
//                                 <Button onClick={() => handleUpdateStatus(leave._id, 'Approved')}>Approve</Button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p className="text-center text-gray-500">No pending leave requests.</p>
//             )}
//         </div>
//     );
// };

// export default ApproveLeavePage;

import React, { useState, useEffect } from 'react';
import api from "../api/api";
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { formatDate } from '../utils/formatDate';

const ApproveLeavePage = () => {
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingLeaves = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/hr/leaves/pending');
            setPendingLeaves(data);
        } catch (error) {
            console.error("Failed to fetch pending leaves", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/hr/leaves/${id}/status`, { status });
            setPendingLeaves(pendingLeaves.filter(leave => leave._id !== id));
        } catch (error) {
            console.error("Failed to update leave status", error);
            alert("Action failed. Please try again.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Approve Leave Requests</h1>

            {pendingLeaves.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {pendingLeaves.map((leave, index) => (
                        <div
                            key={leave._id}
                            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transform transition duration-300 ease-in-out animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-lg font-bold text-gray-800">
                                        {leave.employeeId.name}
                                        <span className="text-sm font-normal text-gray-500"> ({leave.employeeId.employeeId})</span>
                                    </p>
                                    <p className="text-sm text-gray-500">{leave.employeeId.department}</p>
                                </div>
                                <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                                    {formatDate(leave.leaveDate)}
                                </span>
                            </div>

                            <p className="text-gray-700 text-sm mt-4 whitespace-pre-wrap">{leave.reason}</p>

                            <div className="mt-6 flex justify-end space-x-3">
                                <Button onClick={() => handleUpdateStatus(leave._id, 'Declined')} variant="danger">
                                    Decline
                                </Button>
                                <Button onClick={() => handleUpdateStatus(leave._id, 'Approved')}>
                                    Approve
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600 text-lg">No pending leave requests.</p>
            )}
        </div>
    );
};

export default ApproveLeavePage;
