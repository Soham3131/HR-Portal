

// // src/pages/hr/SalaryCalculatorPage.js
// import React, { useState, useEffect, useMemo } from 'react';
// import api from "../api/api";
// import Spinner from '../components/Spinner';
// import Button from '../components/Button';
// import { formatDate } from '../utils/formatDate';
// import Modal from '../components/Modal';
// import DeductionLogModal from '../components/DeductionLogModal';

// const SalaryCalculatorPage = () => {
//     const [payrollData, setPayrollData] = useState([]);
//     const [pastRecords, setPastRecords] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [notes, setNotes] = useState('');
//     const [month, setMonth] = useState(new Date().getMonth() + 1);
//     const [year, setYear] = useState(new Date().getFullYear());

//     const [isEditModalOpen, setEditModalOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState(null);
//     const [editedNotes, setEditedNotes] = useState('');

//     // --- FIX: Add missing state for the deduction log modal ---
//     const [isLogModalOpen, setLogModalOpen] = useState(false);
//     const [selectedLogData, setSelectedLogData] = useState(null);
    
//     const [selectedPastRecord, setSelectedPastRecord] = useState(null);

//     const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
//     const [filterYear, setFilterYear] = useState(new Date().getFullYear());

//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const [payrollRes, recordsRes] = await Promise.all([
//                     api.get(`/hr/payroll?month=${month}&year=${year}`),
//                     api.get('/hr/salary-records')
//                 ]);
//                 setPayrollData(payrollRes.data);
//                 setPastRecords(recordsRes.data);
//             } catch (error) {
//                 console.error("Failed to fetch data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [month, year]);

//     const filteredPastRecords = useMemo(() => {
//         return pastRecords.filter(rec => rec.month === parseInt(filterMonth) && rec.year === parseInt(filterYear));
//     }, [pastRecords, filterMonth, filterYear]);

//     const handleSaveRecord = async () => {
//         if (!notes.trim()) {
//             alert("Please add a note before saving the payroll record.");
//             return;
//         }
//         try {
//             await api.post('/hr/salary-records', { month, year, notes, payrollData });
//             alert('Salary record saved successfully!');
//             setNotes('');
//             const { data } = await api.get('/hr/salary-records');
//             setPastRecords(data);
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

//     const handleViewLog = (data) => {
//         setSelectedLogData(data);
//         setLogModalOpen(true);
//     };

//     if (loading) return <div className="flex justify-center items-center h-64 animate-pulse"><Spinner /></div>;

//     return (
//         <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen animate-fadeIn">
//             <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slideIn">Salary Management</h1>

//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calculate Payroll - {new Date(year, month - 1).toLocaleString('default', { month: 'long' })}</h2>
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-blue-100">
//                             <tr>
//                                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
//                                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Base Salary</th>
//                                 <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Unpaid Leaves</th>
//                                 <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Late Fine</th>
//                                 <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">No EOD Fine</th>
//                                 <th className="px-4 py-3 text-center text-xs font-bold text-red-600 uppercase">Total Deductions</th>
//                                 <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Net Salary</th>
//                                 <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {payrollData.map(data => (
//                                 <tr key={data.employeeId} className="hover:bg-gray-50">
//                                     <td className="px-4 py-4 font-medium">{data.employeeName}</td>
//                                     <td className="px-4 py-4">₹{data.baseSalary.toLocaleString()}</td>
//                                     <td className="px-4 py-4 text-center">{data.unpaidLeaves}</td>
//                                     <td className="px-4 py-4 text-center">₹{data.lateDeductions.toLocaleString()}</td>
//                                     <td className="px-4 py-4 text-center">₹{data.noEodDeductions.toLocaleString()}</td>
//                                     <td className="px-4 py-4 text-center font-bold text-red-600">₹{data.totalDeductions.toLocaleString()}</td>
//                                     <td className="px-4 py-4 font-bold text-green-600">₹{data.netSalary.toLocaleString()}</td>
//                                     <td className="px-4 py-4 text-center">
//                                         <Button onClick={() => handleViewLog(data)} variant="secondary" className="text-xs py-1 px-2">View Log</Button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="mt-6">
//                     <h3 className="text-lg font-semibold mb-2">Payroll Notes</h3>
//                     <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" className="w-full p-3 border border-gray-300 rounded-md" placeholder="e.g., Salaries credited on..."/>
//                     <Button onClick={handleSaveRecord} className="mt-4">Save Payroll Record</Button>
//                 </div>
//             </div>

//             {/* Past Records Section */}
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//                 <div className="flex flex-wrap justify-between items-center mb-4">
//                     <h2 className="text-2xl font-semibold text-gray-800">Past Payroll Records</h2>
//                     <div className="flex gap-4 items-center">
//                         <label htmlFor="month-select" className="text-sm font-medium">Month:</label>
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
//                             <div>
//                                 <Button onClick={() => handleEditClick(record)} variant="secondary" className="mr-2">Edit Notes</Button>
//                                 <Button onClick={() => setSelectedPastRecord(selectedPastRecord?._id === record._id ? null : record)}>
//                                     {selectedPastRecord?._id === record._id ? 'Hide Details' : 'View Details'}
//                                 </Button>
//                             </div>
//                         </div>
//                         {selectedPastRecord?._id === record._id && (
//                             <div className="mt-4 overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200">
//                                     <thead className="bg-gray-100">
//                                         <tr>
//                                             <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Employee</th>
//                                             <th className="px-4 py-2 text-left text-xs font-bold text-gray-600 uppercase">Net Salary</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white divide-y divide-gray-200">
//                                         {record.payrollData.map(data => (
//                                             <tr key={data.employeeId}>
//                                                 <td className="px-4 py-2">{data.employeeName}</td>
//                                                 <td className="px-4 py-2">₹{data.netSalary.toLocaleString()}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 )) : <p className="text-gray-500">No records found for the selected month and year.</p>}
//             </div>

//             <DeductionLogModal 
//                 isOpen={isLogModalOpen}
//                 onClose={() => setLogModalOpen(false)}
//                 logData={selectedLogData}
//             />
            
//             <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Payroll Notes">
//                 <textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} rows="5" className="w-full p-3 border border-gray-300 rounded-md"/>
//                 <div className="flex justify-end space-x-2 mt-4">
//                     <Button onClick={() => setEditModalOpen(false)} variant="secondary">Cancel</Button>
//                     <Button onClick={handleUpdateRecord}>Save Changes</Button>
//                 </div>
//             </Modal>
//         </div>
//     );
// };

// export default SalaryCalculatorPage;

// src/pages/hr/SalaryCalculatorPage.js
import React, { useState, useEffect, useMemo } from 'react';
import api from "../api/api";
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { formatDate } from '../utils/formatDate';
import Modal from '../components/Modal';
import DeductionLogModal from '../components/DeductionLogModal';

const SalaryCalculatorPage = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [pastRecords, setPastRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    
    // State for the main calculator's selected month and year
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    // State for the edit modal
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editedNotes, setEditedNotes] = useState('');

    // State for the deduction log modal
    const [isLogModalOpen, setLogModalOpen] = useState(false);
    const [selectedLogData, setSelectedLogData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch the calculated payroll for the selected month and all past saved records
                const [payrollRes, recordsRes] = await Promise.all([
                    api.get(`/hr/payroll?month=${month}&year=${year}`),
                    api.get('/hr/salary-records')
                ]);
                setPayrollData(payrollRes.data);
                setPastRecords(recordsRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [month, year]); // Re-fetch whenever the selected month or year changes

    const handleSaveRecord = async () => {
        if (!notes.trim()) {
            alert("Please add a note before saving the payroll record.");
            return;
        }
        try {
            // Save the currently displayed payroll data
            await api.post('/hr/salary-records', { month, year, notes, payrollData });
            alert('Salary record saved successfully!');
            setNotes('');
            // Refresh the list of past records
            const { data } = await api.get('/hr/salary-records');
            setPastRecords(data);
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

    const handleViewLog = (data) => {
        setSelectedLogData(data);
        setLogModalOpen(true);
    };

    if (loading) return <div className="flex justify-center items-center h-64 animate-pulse"><Spinner /></div>;

    return (
        <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slideIn">Salary Management</h1>

            {/* Main Payroll Calculator Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Payroll for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</h2>
                    <div className="flex gap-4 items-center">
                        <label htmlFor="month-select" className="text-sm font-medium">Month:</label>
                        <select id="month-select" value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                            {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                        </select>
                        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 rounded-md w-24" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Employee</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Base Salary</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Unpaid Leaves</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Late Fine</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">No EOD Fine</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-red-600 uppercase">Total Deductions</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-green-700 uppercase">Net Salary</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payrollData.map(data => (
                                <tr key={data.employeeId} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium">{data.employeeName}</td>
                                    <td className="px-4 py-4">₹{data.baseSalary.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-center">{data.unpaidLeaves}</td>
                                    <td className="px-4 py-4 text-center">₹{data.lateDeductions.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-center">₹{data.noEodDeductions.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-center font-bold text-red-600">₹{data.totalDeductions.toLocaleString()}</td>
                                    <td className="px-4 py-4 font-bold text-green-600">₹{data.netSalary.toLocaleString()}</td>
                                    <td className="px-4 py-4 text-center">
                                        <Button onClick={() => handleViewLog(data)} variant="secondary" className="text-xs py-1 px-2">View Log</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Payroll Notes for {new Date(year, month - 1).toLocaleString('default', { month: 'long' })}</h3>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" className="w-full p-3 border border-gray-300 rounded-md" placeholder="e.g., Salaries credited on..."/>
                    <Button onClick={handleSaveRecord} className="mt-4">Save Payroll Record</Button>
                </div>
            </div>

            {/* Past Records Section - Simplified */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800">Saved Payroll Records</h2>
                {pastRecords.length > 0 ? pastRecords.map(record => (
                    <div key={record._id} className="border border-gray-200 p-4 rounded-md mt-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{new Date(record.year, record.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                <p className="text-sm text-gray-500">Saved on: {formatDate(record.createdAt)}</p>
                                <p className="text-sm italic text-gray-600 mt-1">Notes: {record.notes}</p>
                            </div>
                            <Button onClick={() => handleEditClick(record)} variant="secondary">Edit Notes</Button>
                        </div>
                    </div>
                )) : <p className="text-gray-500 mt-4">No payroll records have been saved yet.</p>}
            </div>

            <DeductionLogModal 
                isOpen={isLogModalOpen}
                onClose={() => setLogModalOpen(false)}
                logData={selectedLogData}
            />
            
            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Payroll Notes">
                <textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} rows="5" className="w-full p-3 border border-gray-300 rounded-md"/>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button onClick={() => setEditModalOpen(false)} variant="secondary">Cancel</Button>
                    <Button onClick={handleUpdateRecord}>Save Changes</Button>
                </div>
            </Modal>
        </div>
    );
};

export default SalaryCalculatorPage;
