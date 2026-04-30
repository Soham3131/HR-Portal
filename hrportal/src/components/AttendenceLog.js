// src/components/dashboard/AttendanceLog.js
import React from 'react';
import { formatDate, formatTime } from "../utils/formatDate"
import Button from '../components/Button';
import MotivationalQuotes from './MotivationalQuotes';


const AttendanceLog = ({ attendance, title = "Attendance History", onEdit, showHeader = true }) => {
    if (!attendance || attendance.length === 0) {
        return (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-[#433020]/5 border border-white/50 p-8 text-center transition-all hover:shadow-2xl hover:shadow-[#433020]/10">



                {showHeader && (
                    <h3 className="text-2xl font-bold mb-4 text-[#433020] dark:text-gray-100 flex items-center justify-center gap-2">
                        <span className="w-2 h-8 bg-[#8a6144] rounded-full inline-block"></span>
                        {title}
                    </h3>
                )}

                <p className="text-gray-500 text-lg">No attendance records found.</p>
            </div>
        );
    }

    const statusColors = {
        'Present': 'bg-green-100 text-green-700 border border-green-200',
        'Half Day': 'bg-orange-100 text-orange-700 border border-orange-200',
        'Holiday': 'bg-blue-100 text-blue-700 border border-blue-200',
        'Absent': 'bg-red-100 text-red-700 border border-red-200',
    };

    // Determine if this is the employee view (no onEdit function passed)
    const isEmployeeView = !onEdit;

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-[#433020]/5 border border-white/50 p-8 transition-all hover:shadow-2xl hover:shadow-[#433020]/10">
            {showHeader && (
                <h3 className="text-2xl font-bold mb-6 text-[#433020] dark:text-gray-100 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[#8a6144] rounded-full inline-block"></span>
                    {title}
                </h3>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#fffcf7]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Date</th>
                            {/* Only show these columns in the HR view */}
                            {!isEmployeeView && <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Employee</th>}
                            {!isEmployeeView && <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Department</th>}
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Check In</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Check Out</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Notes</th>
                            {onEdit && <th className="px-6 py-4 text-left text-xs font-bold text-[#8a6144] uppercase tracking-wider">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-100">
                        {attendance.map(record => (
                            <tr key={record._id} className="hover:bg-[#f5e6d3]/50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{formatDate(record.date)}</td>
                                {/* Only show these columns in the HR view */}
                                {!isEmployeeView && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employeeId?.name || 'N/A'}</td>}
                                {!isEmployeeView && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.employeeId?.department || 'N/A'}</td>}
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${statusColors[record.status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.checkIn ? formatTime(record.checkIn) : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.checkOut ? formatTime(record.checkOut) : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs italic" title={record.notes}>{record.notes || '-'}</td>
                                {onEdit && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => onEdit(record)} className="px-4 py-1 text-xs rounded-full transition-all duration-300 font-bold border-2 border-[#b8866f] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 bg-[#8a6144] text-white hover:bg-[#6b4d36]">Edit</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceLog;

