
import React, { useState, useEffect } from 'react';
import api from "../api/api";
import Spinner from '../components/Spinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const AnalyticsStatCard = ({ title, value, description }) => (
//     <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 animate-fade-in">
//         <p className="text-sm font-medium text-gray-500">{title}</p>
//         <p className="text-4xl font-bold text-indigo-700 mt-1">{value}</p>
//         <p className="text-xs text-gray-400 mt-2">{description}</p>
//     </div>
// );

// const AnalyticsDashboard = () => {
//     const [analyticsData, setAnalyticsData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [month, setMonth] = useState(new Date().getMonth() + 1);
//     const [year, setYear] = useState(new Date().getFullYear());

//     useEffect(() => {
//         const fetchAnalytics = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await api.get(`/hr/analytics/consolidated?month=${month}&year=${year}`);
//                 setAnalyticsData(data);
//             } catch (error) {
//                 console.error("Failed to fetch analytics data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAnalytics();
//     }, [month, year]);

//     if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
//     if (!analyticsData) return <p className="text-center text-gray-500">Could not load analytics data.</p>;

//     const { totalLateSignIns, totalUnpaidLeaves, dailyTrends, consolidatedData } = analyticsData;

//     return (
//         <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 p-6 space-y-10">
//             <h1 className="text-4xl font-extrabold text-center text-gray-800 animate-fade-in-up">Company-Wide Analytics</h1>

//             {/* Filters */}
//             <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-center animate-fade-in">
//                 <label className="text-sm font-medium text-gray-700">Select Period:</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded-lg">
//                     {Array.from({ length: 12 }, (_, i) => (
//                         <option key={i + 1} value={i + 1}>
//                             {new Date(0, i).toLocaleString('default', { month: 'long' })}
//                         </option>
//                     ))}
//                 </select>
//                 <input
//                     type="number"
//                     value={year}
//                     onChange={(e) => setYear(e.target.value)}
//                     className="p-2 border border-gray-300 rounded-lg w-28"
//                 />
//             </div>

//             {/* Stat Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <AnalyticsStatCard
//                     title="Total Late Sign-ins"
//                     value={totalLateSignIns}
//                     description={`For ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })}`}
//                 />
//                 <AnalyticsStatCard
//                     title="Total Unpaid Leaves"
//                     value={totalUnpaidLeaves}
//                     description="Across all employees"
//                 />
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="bg-white p-6 rounded-xl shadow-xl animate-fade-in">
//                     <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily Timely Sign-in Rate (%)</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <AreaChart data={dailyTrends}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
//                             <YAxis domain={[0, 100]} unit="%" />
//                             <Tooltip />
//                             <Legend />
//                             <Area type="monotone" dataKey="timelySignInPercentage" name="Timely Sign-in %" stroke="#22c55e" fill="#bbf7d0" />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow-xl animate-fade-in">
//                     <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily EOD Submission Rate (%)</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <AreaChart data={dailyTrends}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
//                             <YAxis domain={[0, 100]} unit="%" />
//                             <Tooltip />
//                             <Legend />
//                             <Area type="monotone" dataKey="eodSubmissionPercentage" name="EOD Submitted %" stroke="#3b82f6" fill="#dbeafe" />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* Table */}
//             <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//                     Employee Performance Summary for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })}
//                 </h2>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Employee</th>
//                                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Department</th>
//                                 <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Late Sign-ins</th>
//                                 <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Unpaid Leaves</th>
//                                 <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">EOD Compliance</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-100">
//                             {consolidatedData.map((emp) => (
//                                 <tr key={emp.id} className="hover:bg-blue-50 transition duration-200">
//                                     <td className="px-6 py-4 font-medium whitespace-nowrap">{emp.name}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
//                                     <td className={`px-6 py-4 text-center font-bold ${emp.lateSignIns > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
//                                         {emp.lateSignIns}
//                                     </td>
//                                     <td className={`px-6 py-4 text-center font-bold ${emp.unpaidLeaves > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
//                                         {emp.unpaidLeaves}
//                                     </td>
//                                     <td className={`px-6 py-4 text-center font-bold ${parseInt(emp.eodCompliance) < 90 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
//                                         {emp.eodCompliance}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AnalyticsDashboard;

const AnalyticsStatCard = ({ title, value, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 animate-fade-in">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-4xl font-bold text-indigo-700 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-2">{description}</p>
    </div>
);

const AnalyticsDashboard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/hr/analytics/consolidated?month=${month}&year=${year}`);
                setAnalyticsData(data);
            } catch (error) {
                console.error("Failed to fetch analytics data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [month, year]);

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    if (!analyticsData) return <p className="text-center text-gray-500">Could not load analytics data.</p>;

    const { totalLateSignIns, totalUnpaidLeaves, dailyTrends, consolidatedData } = analyticsData;

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-50 to-pink-50 p-6 space-y-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 animate-fade-in-up">Company-Wide Analytics</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-center animate-fade-in">
                <label className="text-sm font-medium text-gray-700">Select Period:</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded-lg">
                    {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg w-28"
                />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsStatCard
                    title="Total Late Sign-ins"
                    value={totalLateSignIns}
                    description={`For ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })}`}
                />
                <AnalyticsStatCard
                    title="Total Unpaid Leaves"
                    value={totalUnpaidLeaves}
                    description="Across all employees"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-xl animate-fade-in">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily Timely Sign-in Rate (%)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dailyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                            <YAxis domain={[0, 100]} unit="%" />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="timelySignInPercentage" name="Timely Sign-in %" stroke="#22c55e" fill="#bbf7d0" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-xl animate-fade-in">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Daily EOD Submission Rate (%)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={dailyTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                            <YAxis domain={[0, 100]} unit="%" />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="eodSubmissionPercentage" name="EOD Submitted %" stroke="#3b82f6" fill="#dbeafe" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Employee Performance Summary for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })}
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Department</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Late Sign-ins</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Late Sign-in %</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Unpaid Leaves</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">EOD Compliance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {consolidatedData.map((emp) => (
                                <tr key={emp.id} className="hover:bg-blue-50 transition duration-200">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{emp.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{emp.department}</td>
                                    <td className={`px-6 py-4 text-center font-bold ${emp.lateSignIns > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
                                        {emp.lateSignIns}
                                    </td>
                                    <td className={`px-6 py-4 text-center font-bold ${parseInt(emp.lateSignInPercentage) > 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
                                        {emp.lateSignInPercentage}
                                    </td>
                                    <td className={`px-6 py-4 text-center font-bold ${emp.unpaidLeaves > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
                                        {emp.unpaidLeaves}
                                    </td>
                                    <td className={`px-6 py-4 text-center font-bold ${parseInt(emp.eodCompliance) < 90 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
                                        {emp.eodCompliance}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;