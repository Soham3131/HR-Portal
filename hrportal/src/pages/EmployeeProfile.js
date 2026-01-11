

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { motion } from 'framer-motion';

const EmployeeProfile = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ phone: '', address: '' });
    const [uploading, setUploading] = useState(false);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/employee/profile');
            setProfile(data);
            setFormData({ phone: data.phone || '', address: data.address || '' });
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleFileChange = async (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', 'employee_portal');
        uploadData.append('cloud_name', 'dhvhqgdrc');

        try {
            const { data } = await axios.post('https://api.cloudinary.com/v1_1/dhvhqgdrc/image/upload', uploadData);

            let updatedData = {};
            if (fileType === 'profilePicture') {
                updatedData.profilePictureUrl = data.secure_url;
            } else if (fileType === 'idProof') {
                updatedData.idProofUrl = data.secure_url;
            } else if (fileType === 'marksheet') {
                const newDocument = { name: file.name, url: data.secure_url };
                updatedData.documents = [...(profile.documents || []), newDocument];
            }

            await api.put('/employee/profile', updatedData);
            await fetchProfile();
        } catch (error) {
            console.error('Upload failed', error);
            alert('File upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/employee/profile', formData);
            setIsEditing(false);
            await fetchProfile();
        } catch (error) {
            console.error('Profile update failed', error);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800"><Spinner /></div>;
    if (!profile) return <p>Could not load profile.</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto space-y-10"
            >
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <motion.img
                            src={profile.profilePictureUrl || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
                            whileHover={{ scale: 1.05 }}
                        />
                        <label htmlFor="profile-pic-upload" className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer hover:bg-blue-700">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </label>
                        <input id="profile-pic-upload" type="file" className="hidden" onChange={(e) => handleFileChange(e, 'profilePicture')} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{profile.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300">{profile.department} - {profile.employeeId}</p>
                    </div>
                </div>

                {uploading && <div className="flex items-center space-x-2"><Spinner /><p className="text-gray-600 dark:text-gray-300">Uploading...</p></div>}

                <motion.div whileHover={{ scale: 1.01 }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Personal & Contact Information</h2>
                        <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</Button>
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="mt-4 space-y-4">
                            <Input id="phone" label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            <Input id="address" label="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                            <Button type="submit">Save Changes</Button>
                        </form>
                    ) : (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 dark:text-gray-100">
                            <p><span className="font-semibold">Email:</span> {profile.email}</p>
                            <p><span className="font-semibold">Phone:</span> {profile.phone || 'N/A'}</p>
                            <p><span className="font-semibold">Date of Birth:</span> {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</p>
                            <p className="md:col-span-2"><span className="font-semibold">Address:</span> {profile.address || 'N/A'}</p>
                        </div>
                    )}
                </motion.div>

            

                <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
    🧾 Employment Details
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 text-base">
    <div className="flex items-center space-x-2">
      <span className="font-semibold">📅 Joining Date:</span>
      <span className="opacity-90">
        {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}
      </span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="font-semibold">💰 Salary:</span>
      <span className="opacity-90">
        {profile.salary ? `₹${profile.salary.toLocaleString()}` : 'Not Disclosed'}
      </span>
    </div>
  </div>
</Card>


             
                <Card className="bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-[#1e293b] dark:via-[#334155] dark:to-[#1e293b] shadow-xl rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]">
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
    📄 Documents
  </h2>

  <div className="space-y-6 text-gray-700 dark:text-gray-300">
    {/* ID Proof Section */}
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-inner transition duration-300 hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500">
      <h3 className="font-semibold text-lg mb-2">🪪 ID Proof</h3>
      {profile.idProofUrl ? (
        <a
          href={profile.idProofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 dark:text-blue-400 font-medium underline hover:text-blue-800 dark:hover:text-blue-300 transition"
        >
          View ID Proof
        </a>
      ) : (
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'idProof')}
            className="block w-full text-sm text-gray-600 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />
        </label>
      )}
    </div>

    {/* Marksheets & Other Documents */}
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-inner transition duration-300 hover:ring-2 hover:ring-orange-400 dark:hover:ring-orange-500">
      <h3 className="font-semibold text-lg mb-2">📚 Marksheets & Other Documents</h3>
      <ul className="list-disc list-inside space-y-1">
        {(profile.documents || []).map((doc, index) => (
          <li key={index}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition"
            >
              {doc.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <label
          htmlFor="marksheet-upload"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Upload New Document:
        </label>
        <input
          id="marksheet-upload"
          type="file"
          onChange={(e) => handleFileChange(e, 'marksheet')}
          className="block w-full text-sm text-gray-600 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition"
        />
      </div>
    </div>
  </div>
</Card>

            </motion.div>
        </div>
    );
};

export default EmployeeProfile;
