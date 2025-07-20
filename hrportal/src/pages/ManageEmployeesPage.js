// import React, { useState, useEffect } from 'react';
// import api from "../api/api"
// import Spinner from '../components/Spinner';
// import EditEmployeeModal from "../components/EditEmployeeModal"
// import { formatDate } from '../utils/formatDate';
// import Button from '../components/Button';



// const EmployeeCard = ({ employee, onEdit, onDelete }) => {
//     return (
//         <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
//             <div className="flex items-center space-x-4 mb-4">
//                 <img src={employee.profilePictureUrl || `https://ui-avatars.com/api/?name=${employee.name}&background=random`} alt={employee.name} className="w-16 h-16 rounded-full object-cover" />
//                 <div>
//                     <h3 className="text-xl font-bold text-gray-800">{employee.name}</h3>
//                     <p className="text-sm text-gray-500">{employee.employeeId}</p>
//                     <p className="text-sm text-blue-600 font-semibold">{employee.department}</p>
//                 </div>
//             </div>
//             <div className="space-y-2 text-sm flex-grow">
//                 <p><span className="font-semibold">Email:</span> {employee.email}</p>
//                 <p><span className="font-semibold">Phone:</span> {employee.phone || 'N/A'}</p>
//                 <p><span className="font-semibold">Joining Date:</span> {employee.joiningDate ? formatDate(employee.joiningDate) : 'N/A'}</p>
//                 <p><span className="font-semibold">Salary:</span> ₹{employee.salary.toLocaleString()}</p>
//                 <p><span className="font-semibold">Leaves Left:</span> {employee.holidaysLeft}</p>
//                 <div>
//                     <h4 className="font-semibold mt-2">Documents:</h4>
//                     <ul className="list-disc list-inside pl-4">
//                         {employee.idProofUrl && <li><a href={employee.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ID Proof</a></li>}
//                         {employee.documents && employee.documents.map((doc, i) => (
//                             <li key={i}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{doc.name}</a></li>
//                         ))}
//                         {!employee.idProofUrl && (!employee.documents || employee.documents.length === 0) && <li className="text-gray-400">No documents uploaded</li>}
//                     </ul>
//                 </div>
//             </div>
//             <div className="mt-6 flex justify-end space-x-2">
//                 <Button onClick={() => onEdit(employee)} variant="secondary">Edit</Button>
//                 <Button onClick={() => onDelete(employee)} variant="danger">Delete</Button>
//             </div>
//         </div>
//     );
// };


// const ManageEmployeesPage = () => {
//     const [employees, setEmployees] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [isModalOpen, setModalOpen] = useState(false);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             // This API call now automatically triggers the leave reset check on the backend
//             const { data } = await api.get('/hr/employees');
//             setEmployees(data);
//         } catch (error) {
//             console.error("Failed to fetch employees", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const filteredEmployees = employees.filter(emp =>
//         emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (emp.employeeId && emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     const handleEdit = (employee) => {
//         setSelectedEmployee(employee);
//         setModalOpen(true);
//     };

//     const handleDelete = async (employee) => {
//         if (window.confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
//             try {
//                 await api.delete(`/hr/employees/${employee._id}`);
//                 fetchData(); // Refresh the list after deleting
//             } catch (error) {
//                 console.error("Failed to delete employee", error);
//                 alert("Could not delete employee.");
//             }
//         }
//     };

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className="space-y-6">
//             <div className="flex flex-wrap justify-between items-center gap-4">
//                 <h1 className="text-3xl font-bold text-gray-800">Manage Employees</h1>
//                 {/* The "Reset Monthly Leaves" button has been removed as this is now automatic */}
//             </div>
//             <input
//                 type="text"
//                 placeholder="Search by name or ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg"
//             />
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredEmployees.map(emp => (
//                     <EmployeeCard key={emp._id} employee={emp} onEdit={handleEdit} onDelete={handleDelete} />
//                 ))}
//             </div>
//             {selectedEmployee && (
//                 <EditEmployeeModal
//                     isOpen={isModalOpen}
//                     onClose={() => setModalOpen(false)}
//                     employee={selectedEmployee}
//                     onUpdate={fetchData}
//                 />
//             )}
//         </div>
//     );
// };

// export default ManageEmployeesPage;

import React, { useState, useEffect } from 'react';
import api from "../api/api";
import Spinner from '../components/Spinner';
import EditEmployeeModal from "../components/EditEmployeeModal";
import { formatDate } from '../utils/formatDate';
import Button from '../components/Button';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
    return (
        <div className="bg-white/30 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center space-x-4 mb-4">
                <img
                    src={employee.profilePictureUrl || `https://ui-avatars.com/api/?name=${employee.name}&background=random`}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full object-cover border border-gray-300 transition-transform duration-300 hover:scale-125"
                />
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.employeeId}</p>
                    <p className="text-sm text-blue-500 font-medium">{employee.department}</p>
                </div>
            </div>
            <div className="space-y-1 text-sm text-gray-800">
                <p><span className="font-semibold">Email:</span> {employee.email}</p>
                <p><span className="font-semibold">Phone:</span> {employee.phone || 'N/A'}</p>
                <p><span className="font-semibold">Joining Date:</span> {employee.joiningDate ? formatDate(employee.joiningDate) : 'N/A'}</p>
                <p><span className="font-semibold">Salary:</span> ₹{employee.salary.toLocaleString()}</p>
                <p><span className="font-semibold">Leaves Left:</span> {employee.holidaysLeft}</p>
                <div>
                    <h4 className="font-semibold mt-2">Documents:</h4>
                    <ul className="list-disc list-inside text-blue-600">
                        {employee.idProofUrl && (
                            <li><a href={employee.idProofUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">ID Proof</a></li>
                        )}
                        {employee.documents?.map((doc, i) => (
                            <li key={i}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{doc.name}</a></li>
                        ))}
                        {!employee.idProofUrl && (!employee.documents || employee.documents.length === 0) && (
                            <li className="text-gray-400">No documents uploaded</li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <Button onClick={() => onEdit(employee)} className="transition duration-300 hover:scale-105">Edit</Button>
                <Button onClick={() => onDelete(employee)} variant="danger" className="transition duration-300 hover:scale-105">Delete</Button>
            </div>
        </div>
    );
};

const ManageEmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/hr/employees');
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch employees", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employeeId && emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setModalOpen(true);
    };

    const handleDelete = async (employee) => {
        if (window.confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
            try {
                await api.delete(`/hr/employees/${employee._id}`);
                fetchData();
            } catch (error) {
                console.error("Failed to delete employee", error);
                alert("Could not delete employee.");
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-100 p-6 animate-fade-in-down space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow">Manage Employees</h1>
            </div>

            <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEmployees.map(emp => (
                    <EmployeeCard key={emp._id} employee={emp} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
            </div>

            {selectedEmployee && (
                <EditEmployeeModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    employee={selectedEmployee}
                    onUpdate={fetchData}
                />
            )}
        </div>
    );
};

export default ManageEmployeesPage;
