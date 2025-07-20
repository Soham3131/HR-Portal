// src/components/dashboard/EditAttendanceModal.js
import React, { useState, useEffect } from 'react';
import Modal from "../components/Modal"
import Button from '../components/Button'
import api from "../api/api"

const toLocalISOString = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EditAttendanceModal = ({ isOpen, onClose, record, onUpdate }) => {
    const [formData, setFormData] = useState({
        status: '',
        checkIn: '',
        checkOut: '',
        notes: '',
    });

    useEffect(() => {
        if (record) {
            setFormData({
                status: record.status || '',
                // Use the new, more reliable helper function
                checkIn: toLocalISOString(record.checkIn),
                checkOut: toLocalISOString(record.checkOut),
                notes: record.notes || '',
            });
        }
    }, [record]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // When sending data back, convert the local time from the input
            // into a full UTC ISO string that the backend can store correctly.
            await api.put(`/hr/attendance/${record._id}`, {
                status: formData.status,
                notes: formData.notes,
                checkIn: formData.checkIn ? new Date(formData.checkIn).toISOString() : null,
                checkOut: formData.checkOut ? new Date(formData.checkOut).toISOString() : null,
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Failed to update attendance", error);
            alert("Update failed. Please try again.");
        }
    };

    if (!record) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit Attendance for ${record?.employeeId?.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="Present">Present</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Holiday">Holiday</option>
                        <option value="Absent">Absent</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">Check In Time</label>
                    <input type="datetime-local" id="checkIn" name="checkIn" value={formData.checkIn} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                 <div>
                    <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">Check Out Time</label>
                    <input type="datetime-local" id="checkOut" name="checkOut" value={formData.checkOut} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="3" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditAttendanceModal;
