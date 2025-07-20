// import React, { useState, useEffect, useMemo } from 'react';
// import api from "../api/api"
// import Spinner from '../components/Spinner';
// import Button from '../components/Button';
// import { formatDate } from '../utils/formatDate';
// import Modal from '../components/Modal';


// const SalaryCalculatorPage = () => {
//     const [employees, setEmployees] = useState([]);
//     const [pastRecords, setPastRecords] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [notes, setNotes] = useState('');

//     // State for filtering past records
//     const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // 1-12
//     const [filterYear, setFilterYear] = useState(new Date().getFullYear());

//     // State for the edit modal
//     const [isEditModalOpen, setEditModalOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState(null);
//     const [editedNotes, setEditedNotes] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const [empRes, recordsRes] = await Promise.all([
//                     api.get('/hr/employees'),
//                     api.get('/hr/salary-records')
//                 ]);
//                 setEmployees(empRes.data);
//                 setPastRecords(recordsRes.data);
//             } catch (error) {
//                 console.error("Failed to fetch data", error);
//                 // If fetching records fails, still try to fetch employees so the calculator works
//                 if (employees.length === 0) {
//                     try {
//                         const empRes = await api.get('/hr/employees');
//                         setEmployees(empRes.data);
//                     } catch (e) { console.error("Failed to fetch employees separately", e)}
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, []);

//     const salaryData = useMemo(() => {
//         return employees.map(emp => {
//             const unpaidLeaves = emp.holidaysLeft < 0 ? Math.abs(emp.holidaysLeft) : 0;
//             const dailySalary = emp.salary > 0 ? emp.salary / 30 : 0;
//             const deductions = unpaidLeaves * dailySalary;
//             const netSalary = emp.salary - deductions;
//             return {
//                 employeeId: emp._id,
//                 employeeName: emp.name,
//                 baseSalary: emp.salary,
//                 unpaidLeaves,
//                 deductions: Math.round(deductions),
//                 netSalary: Math.round(netSalary),
//             };
//         });
//     }, [employees]);
    
//     const filteredPastRecords = useMemo(() => {
//         return pastRecords.filter(rec => rec.month === parseInt(filterMonth) && rec.year === parseInt(filterYear));
//     }, [pastRecords, filterMonth, filterYear]);

//     const handleSaveRecord = async () => {
//         if (!notes.trim()) {
//             alert("Please add a note before saving the payroll record.");
//             return;
//         }
//         const currentMonth = new Date().getMonth() + 1;
//         const currentYear = new Date().getFullYear();
//         try {
//             const { data: newRecord } = await api.post('/hr/salary-records', { month: currentMonth, year: currentYear, notes, payrollData: salaryData });
//             alert('Salary record saved successfully!');
//             setNotes('');
//             setPastRecords(prev => [newRecord, ...prev]);
//         } catch (error) {
//             console.error("Failed to save record:", error);
//             alert('Failed to save record. Please check the backend logs.');
//         }
//     };

//     const handleEditClick = (record) => {
//         setEditingRecord(record);
//         setEditedNotes(record.notes);
//         setEditModalOpen(true);
//     };

//     const handleUpdateRecord = async () => {
//         if (!editingRecord) return;
//         try {
//             const { data: updatedRecord } = await api.put(`/hr/salary-records/${editingRecord._id}`, { notes: editedNotes });
//             setPastRecords(prev => prev.map(rec => rec._id === updatedRecord._id ? updatedRecord : rec));
//             setEditModalOpen(false);
//             setEditingRecord(null);
//         } catch (error) {
//             console.error("Failed to update record:", error);
//             alert("Failed to update record.");
//         }
//     };

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>

//             {/* Section 1: Calculate and Save Current Payroll */}
//             <div className="bg-white p-6 rounded-lg shadow">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">Calculate Payroll for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Salary (₹)</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unpaid Leaves</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions (₹)</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary (₹)</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {salaryData.map(data => (
//                                 <tr key={data.employeeId}>
//                                     <td className="px-6 py-4 text-sm font-medium text-gray-900">{data.employeeName}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-500">{data.baseSalary.toLocaleString()}</td>
//                                     <td className="px-6 py-4 text-sm text-center text-red-600 font-bold">{data.unpaidLeaves}</td>
//                                     <td className="px-6 py-4 text-sm text-red-600">{data.deductions.toLocaleString()}</td>
//                                     <td className="px-6 py-4 text-sm font-bold text-green-600">{data.netSalary.toLocaleString()}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="mt-6">
//                     <h3 className="text-lg font-semibold mb-2">Payroll Notes</h3>
//                     <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Salaries credited on [Date] via [Method]"/>
//                     <Button onClick={handleSaveRecord} className="mt-4">Save Payroll Record</Button>
//                 </div>
//             </div>

//             {/* Section 2: View Past Records */}
//             <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex flex-wrap justify-between items-center mb-4">
//                     <h2 className="text-2xl font-semibold text-gray-700">Past Payroll Records</h2>
//                     <div className="flex gap-4 items-center">
//                         <label htmlFor="month-select" className="text-sm font-medium">Select Month:</label>
//                         <select id="month-select" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="p-2 border border-gray-300 rounded-md">
//                             {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
//                         </select>
//                         <input type="number" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="p-2 border border-gray-300 rounded-md w-24" />
//                     </div>
//                 </div>
//                 {filteredPastRecords.length > 0 ? filteredPastRecords.map(record => (
//                     <div key={record._id} className="border border-gray-200 p-4 rounded-md mb-4">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="font-bold text-lg">{new Date(record.year, record.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
//                                 <p className="text-sm text-gray-500">Saved on: {formatDate(record.createdAt)}</p>
//                                 <p className="text-sm italic text-gray-600 mt-1">Notes: {record.notes}</p>
//                             </div>
//                             <Button onClick={() => handleEditClick(record)} variant="secondary">Edit Notes</Button>
//                         </div>
//                     </div>
//                 )) : <p className="text-gray-500">No records found for the selected month and year.</p>}
//             </div>

//             {/* Edit Notes Modal */}
//             <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Payroll Notes">
//                 <textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} rows="5" className="w-full p-2 border border-gray-300 rounded-md"/>
//                 <div className="flex justify-end space-x-2 mt-4">
//                     <Button onClick={() => setEditModalOpen(false)} variant="secondary">Cancel</Button>
//                     <Button onClick={handleUpdateRecord}>Save Changes</Button>
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// export default SalaryCalculatorPage;

import React, { useState, useEffect, useMemo } from 'react';
import api from "../api/api"
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { formatDate } from '../utils/formatDate';
import Modal from '../components/Modal';

const SalaryCalculatorPage = () => {
    const [employees, setEmployees] = useState([]);
    const [pastRecords, setPastRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');

    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());

    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editedNotes, setEditedNotes] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [empRes, recordsRes] = await Promise.all([
                    api.get('/hr/employees'),
                    api.get('/hr/salary-records')
                ]);
                setEmployees(empRes.data);
                setPastRecords(recordsRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
                if (employees.length === 0) {
                    try {
                        const empRes = await api.get('/hr/employees');
                        setEmployees(empRes.data);
                    } catch (e) {
                        console.error("Failed to fetch employees separately", e);
                    }
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const salaryData = useMemo(() => {
        return employees.map(emp => {
            const unpaidLeaves = emp.holidaysLeft < 0 ? Math.abs(emp.holidaysLeft) : 0;
            const dailySalary = emp.salary > 0 ? emp.salary / 30 : 0;
            const deductions = unpaidLeaves * dailySalary;
            const netSalary = emp.salary - deductions;
            return {
                employeeId: emp._id,
                employeeName: emp.name,
                baseSalary: emp.salary,
                unpaidLeaves,
                deductions: Math.round(deductions),
                netSalary: Math.round(netSalary),
            };
        });
    }, [employees]);

    const filteredPastRecords = useMemo(() => {
        return pastRecords.filter(rec => rec.month === parseInt(filterMonth) && rec.year === parseInt(filterYear));
    }, [pastRecords, filterMonth, filterYear]);

    const handleSaveRecord = async () => {
        if (!notes.trim()) {
            alert("Please add a note before saving the payroll record.");
            return;
        }
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        try {
            const { data: newRecord } = await api.post('/hr/salary-records', { month: currentMonth, year: currentYear, notes, payrollData: salaryData });
            alert('Salary record saved successfully!');
            setNotes('');
            setPastRecords(prev => [newRecord, ...prev]);
        } catch (error) {
            console.error("Failed to save record:", error);
            alert('Failed to save record. Please check the backend logs.');
        }
    };

    const handleEditClick = (record) => {
        setEditingRecord(record);
        setEditedNotes(record.notes);
        setEditModalOpen(true);
    };

    const handleUpdateRecord = async () => {
        if (!editingRecord) return;
        try {
            const { data: updatedRecord } = await api.put(`/hr/salary-records/${editingRecord._id}`, { notes: editedNotes });
            setPastRecords(prev => prev.map(rec => rec._id === updatedRecord._id ? updatedRecord : rec));
            setEditModalOpen(false);
            setEditingRecord(null);
        } catch (error) {
            console.error("Failed to update record:", error);
            alert("Failed to update record.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64 animate-pulse"><Spinner /></div>;

    return (
        <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slideIn">Salary Management</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calculate Payroll - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Base Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Unpaid Leaves</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Deductions</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Net Salary</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salaryData.map(data => (
                                <tr key={data.employeeId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{data.employeeName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">₹{data.baseSalary.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-center text-red-600 font-bold">{data.unpaidLeaves}</td>
                                    <td className="px-6 py-4 text-sm text-red-600">₹{data.deductions.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600">₹{data.netSalary.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Payroll Notes</h3>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" className="w-full p-3 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="e.g., Salaries credited on [Date] via [Method]"/>
                    <Button onClick={handleSaveRecord} className="mt-4">Save Payroll Record</Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Past Payroll Records</h2>
                    <div className="flex gap-4 items-center">
                        <label htmlFor="month-select" className="text-sm font-medium">Month:</label>
                        <select id="month-select" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                        </select>
                        <input type="number" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="p-2 border border-gray-300 rounded-md w-24" />
                    </div>
                </div>
                {filteredPastRecords.length > 0 ? filteredPastRecords.map(record => (
                    <div key={record._id} className="border border-gray-200 p-4 rounded-md mb-4 hover:bg-gray-50 transition duration-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{new Date(record.year, record.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                <p className="text-sm text-gray-500">Saved on: {formatDate(record.createdAt)}</p>
                                <p className="text-sm italic text-gray-600 mt-1">Notes: {record.notes}</p>
                            </div>
                            <Button onClick={() => handleEditClick(record)} variant="secondary">Edit Notes</Button>
                        </div>
                    </div>
                )) : <p className="text-gray-500">No records found for the selected month and year.</p>}
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Payroll Notes">
                <textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} rows="5" className="w-full p-3 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-200"/>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button onClick={() => setEditModalOpen(false)} variant="secondary">Cancel</Button>
                    <Button onClick={handleUpdateRecord}>Save Changes</Button>
                </div>
            </Modal>
        </div>
    );
};

export default SalaryCalculatorPage;