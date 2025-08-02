// src/components/dashboard/AttendanceLog.js
import React from 'react';
import { formatDate, formatTime } from "../utils/formatDate"
import Button from '../components/Button';
import MotivationalQuotes from './MotivationalQuotes';


const AttendanceLog = ({ attendance, title = "Attendance History", onEdit }) => {
  if (!attendance || attendance.length === 0) {
    return (
        <div className="bg-white rounded-lg shadow p-6 text-center">

            <div className="w-full overflow-x-auto">
  <MotivationalQuotes />
</div>

            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>

            <p className="text-gray-500">No attendance records found.</p>
        </div>
    );
  }

  const statusColors = {
    'Present': 'bg-green-100 text-green-800',
    'Half Day': 'bg-orange-100 text-orange-800',
    'Holiday': 'bg-blue-100 text-blue-800',
    'Absent': 'bg-red-100 text-red-800',
  };

  // Determine if this is the employee view (no onEdit function passed)
  const isEmployeeView = !onEdit;

  return (
    <div className="bg-white rounded-lg shadow p-6">
       <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        {/* Only show these columns in the HR view */}
                        {!isEmployeeView && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>}
                        {!isEmployeeView && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        {onEdit && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {attendance.map(record => (
                        <tr key={record._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.date)}</td>
                            {/* Only show these columns in the HR view */}
                            {!isEmployeeView && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.employeeId?.name || 'N/A'}</td>}
                            {!isEmployeeView && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.employeeId?.department || 'N/A'}</td>}
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[record.status] || 'bg-gray-100 text-gray-800'}`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkIn ? formatTime(record.checkIn) : 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.checkOut ? formatTime(record.checkOut) : 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={record.notes}>{record.notes || 'N/A'}</td>
                            {onEdit && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Button onClick={() => onEdit(record)} variant="secondary" className="text-xs py-1 px-2">Edit</Button>
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

