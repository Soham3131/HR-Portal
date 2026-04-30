

import React, { useState, useEffect, useMemo } from 'react';
import api from "../api/api";
import EmployeeTable from '../components/EmployeeTable';
import AttendanceLog from '../components/AttendenceLog';
import Spinner from '../components/Spinner';
import HREmployeeDetails from "../components/HREmployeeDetails";
import StatCard from '../components/StatCard';
import EditAttendanceModal from '../components/EditAttendanceModal';
import Modal from '../components/Modal';
// import { useTheme } from 'next-themes';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import MotivationalQuotes from '../components/MotivationalQuotes';

const HRDashboard = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isNotMarkedModalOpen, setNotMarkedModalOpen] = useState(false);
    const [isOnLeaveModalOpen, setOnLeaveModalOpen] = useState(false);
    const [isAllEmployeesModalOpen, setAllEmployeesModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [empRes, attRes] = await Promise.all([
                api.get('/hr/employees'),
                api.get('/hr/attendance')
            ]);
            setEmployees(empRes.data);
            setAttendance(attRes.data);
        } catch (error) {
            console.error("Failed to fetch HR data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const todayStats = useMemo(() => {
        const todayString = new Date().toISOString().split('T')[0];
        const todaysRecords = attendance.filter(a => a.date.startsWith(todayString));

        const totalEmployees = employees.length;
        const presentToday = todaysRecords.filter(a => a.status === 'Present').length;

        const onLeaveTodayList = todaysRecords.filter(a => a.status === 'Holiday' || a.status === 'Half Day');
        const onLeaveToday = onLeaveTodayList.length;

        const employeesWithRecordIds = new Set(todaysRecords.map(a => a.employeeId._id.toString()));
        const notMarkedTodayList = employees.filter(emp => !employeesWithRecordIds.has(emp._id.toString()));
        const notMarkedToday = notMarkedTodayList.length;

        return { totalEmployees, presentToday, onLeaveToday, notMarkedToday, onLeaveTodayList, notMarkedTodayList };
    }, [employees, attendance]);

    const filteredAttendance = useMemo(() => {
        return attendance
            .filter(record => record.date.startsWith(filterDate))
            .sort((a, b) => a.employeeId.name.localeCompare(b.employeeId.name));
    }, [attendance, filterDate]);

    const handleEditClick = (record) => {
        setSelectedRecord(record);
        setEditModalOpen(true);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#fff5e6] via-white to-[#f5e6d3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-white/50">
                <Spinner />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen px-4 md:px-8 py-6 bg-gradient-to-br from-[#fff5e6] via-[#f5e6d3] to-[#fff5e6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-2xl md:text-4xl font-extrabold text-[#433020] dark:text-white drop-shadow-sm tracking-tight">
                    <span className="text-[#8a6144]">HR Admin</span> Dashboard
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div onClick={() => setAllEmployeesModalOpen(true)} className="cursor-pointer"><StatCard title="Total Employees" value={todayStats.totalEmployees} /></div>
                <StatCard title="Present Today" value={todayStats.presentToday} colorClass="text-green-500" />
                <div onClick={() => setOnLeaveModalOpen(true)} className="cursor-pointer"><StatCard title="On Leave Today" value={todayStats.onLeaveToday} colorClass="text-blue-500" /></div>
                <div onClick={() => setNotMarkedModalOpen(true)} className="cursor-pointer"><StatCard title="Not Marked Today" value={todayStats.notMarkedToday} colorClass="text-red-500" /></div>
            </div>

            <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800 dark:text-white p-5 md:p-8 rounded-3xl shadow-xl shadow-[#433020]/5 border border-white/50 mt-8 transition-all hover:shadow-2xl hover:shadow-[#433020]/10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-[#433020] dark:text-gray-100 flex items-center gap-2">
                        <span className="w-1.5 h-8 bg-[#8a6144] rounded-full inline-block"></span>
                        Daily Attendance Log
                    </h2>
                    <div className="mt-4 sm:mt-0">
                        <label htmlFor="filterDate" className="mr-2 text-sm font-medium">Filter by Date:</label>
                        <input type="date" id="filterDate" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-black dark:text-white" />
                    </div>
                </div>
                <AttendanceLog attendance={filteredAttendance} onEdit={handleEditClick} />
            </div>

            {selectedRecord && (
                <EditAttendanceModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} record={selectedRecord} onUpdate={fetchData} />
            )}

            <Modal isOpen={isNotMarkedModalOpen} onClose={() => setNotMarkedModalOpen(false)} title="Employees Who Haven't Marked Attendance Today">
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {todayStats.notMarkedTodayList.length > 0 ? todayStats.notMarkedTodayList.map(emp => (
                        <li key={emp._id} className="py-3">
                            <p className="font-medium text-gray-800 dark:text-white">{emp.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{emp.email}</p>
                        </li>
                    )) : <p className="text-gray-500 dark:text-gray-400">All employees have marked their attendance.</p>}
                </ul>
            </Modal>

            <Modal isOpen={isOnLeaveModalOpen} onClose={() => setOnLeaveModalOpen(false)} title="Employees on Leave Today">
                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                    {todayStats.onLeaveTodayList.length > 0 ? todayStats.onLeaveTodayList.map(rec => (
                        <li key={rec._id} className="py-3">
                            <p className="font-medium text-gray-800 dark:text-white">{rec.employeeId.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{rec.employeeId.email}</p>
                        </li>
                    )) : <p className="text-gray-500 dark:text-gray-400">No employees are on leave today.</p>}
                </ul>
            </Modal>

            <Modal isOpen={isAllEmployeesModalOpen} onClose={() => setAllEmployeesModalOpen(false)} title="All Employee Data">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Employee ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Department</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {employees.map(emp => (
                                <tr key={emp._id}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.employeeId}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{emp.name}</td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{emp.department}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
            <div className="w-full overflow-x-auto">
                <MotivationalQuotes />
            </div>

        </div>
    );
};

export default HRDashboard;
