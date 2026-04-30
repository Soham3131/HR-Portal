

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
  const [formData, setFormData] = useState({ phone: '', address: '', dob: '' });
  const [uploading, setUploading] = useState(false);

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace('/api', '');
    return `${baseUrl}${url}`;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/employee/profile');
      setProfile(data);
      setFormData({
        phone: data.phone || '',
        address: data.address || '',
        dob: data.dob ? data.dob.split('T')[0] : '',
        bankName: data.bankDetails?.bankName || '',
        accountNumber: data.bankDetails?.accountNumber || '',
        ifscCode: data.bankDetails?.ifscCode || '',
        panCardNumber: data.panCardNumber || '',
        upiId: data.upiId || ''
      });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadFile = async (file) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    
    if (isImage || isPdf) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', 'employee_portal');

      // Use 'auto' to let Cloudinary handle the resource type automatically
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/dn0j5mkmb/auto/upload`,
        uploadData
      );
      console.log('CLOUDINARY UPLOAD SUCCESS. URL:', data.secure_url);
      return data.secure_url;
    } else {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const { data } = await api.post('/employee/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('BACKEND DOCUMENT UPLOAD SUCCESS. URL:', data.secure_url);
      return data.secure_url;
    }
  };

  const handleFileChange = async (e, fileType) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      if (fileType === 'marksheet') {
        const newDocuments = [];
        for (const file of files) {
          const url = await uploadFile(file);
          newDocuments.push({ name: file.name, url });
        }
        
        const updatedData = { documents: [...(profile.documents || []), ...newDocuments] };
        await api.put('/employee/profile', updatedData);
        await fetchProfile();
      } else {
        const url = await uploadFile(files[0]);
        let updatedData = {};
        if (fileType === 'profilePicture') {
          updatedData.profilePictureUrl = url;
        } else if (fileType === 'idProof') {
          updatedData.idProofUrl = url;
        }
        await api.put('/employee/profile', updatedData);
        await fetchProfile();
      }
    } catch (error) {
      if (error.response) {
        console.error('Upload Error Details:', error.response.data);
      }
      alert('Upload failed. Check console for details.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob,
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode
        },
        panCardNumber: formData.panCardNumber,
        upiId: formData.upiId
      };
      await api.put('/employee/profile', updateData);
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Profile update failed', error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#fff5e6] via-white to-[#f5e6d3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-white/50">
        <Spinner />
      </div>
    </div>
  );
  if (!profile) return <p>Could not load profile.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5e6] via-[#f5e6d3] to-[#fff5e6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 py-12 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
          <div className="relative">
            <motion.img
              src={profile.profilePictureUrl || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
              alt="Profile"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-[#fff5e6] dark:ring-gray-700 shadow-2xl"
              whileHover={{ scale: 1.05 }}
            />
            <label htmlFor="profile-pic-upload" className="absolute bottom-1 right-1 bg-[#8a6144] p-2 rounded-full cursor-pointer hover:bg-[#433020] transition-colors shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </label>
            <input id="profile-pic-upload" type="file" className="hidden" onChange={(e) => handleFileChange(e, 'profilePicture')} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#433020] dark:text-gray-100 tracking-tight leading-tight">{profile.name}</h1>
            <p className="text-[#8a6144] dark:text-gray-400 font-semibold text-base md:text-xl mt-1">{profile.department} <span className="text-[#433020]/20 dark:text-gray-600 px-1">/</span> {profile.employeeId}</p>
          </div>
        </div>

        {uploading && <div className="flex items-center space-x-2"><Spinner /><p className="text-gray-600 dark:text-gray-300">Uploading...</p></div>}

        {/* Personal & Bank Account Information Card */}
        <motion.div whileHover={{ scale: 1.01 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-3xl shadow-xl shadow-[#433020]/5 dark:shadow-black/20 border border-white/50 dark:border-gray-700 transition-all hover:shadow-2xl hover:shadow-[#433020]/10 dark:hover:shadow-black/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 text-2xl font-bold text-[#433020] dark:text-gray-100 mb-6 flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-[#433020] dark:text-gray-100 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#8a6144] rounded-full inline-block"></span>
              Personal Information
            </h2>
            <Button onClick={() => setIsEditing(!isEditing)} variant="brand" className="text-xs md:text-sm px-4 py-2 w-full sm:w-auto">{isEditing ? 'Cancel' : 'Edit Details'}</Button>
          </div>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="phone" label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border-[#8a6144]/30 focus:ring-[#8a6144]" />
                <Input id="dob" label="Date of Birth" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="border-[#8a6144]/30 focus:ring-[#8a6144]" />
                <Input id="address" label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="md:col-span-2 border-[#8a6144]/30 focus:ring-[#8a6144]" />
              </div>

              {/* Bank Details Section in Editing Mode */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-[#8a6144] mb-4 flex items-center gap-2">
                  <span className="text-xl">🏦</span> Bank & Tax Details
                  {profile.bankDetails?.bankName && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Locked</span>}
                </h3>

                {profile.bankDetails?.bankName ? (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl text-xs text-yellow-800 dark:text-yellow-200 mb-4 font-medium flex items-center gap-2">
                    <span className="text-sm">ℹ️</span> Bank details are already filled. Contact Admin to make any changes.
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl text-xs text-blue-800 dark:text-blue-200 mb-4 font-medium flex items-center gap-2">
                    <span className="text-sm">ℹ️</span> Please fill your bank details carefully. They can only be filled once.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    id="bankName"
                    label="Full Bank Name"
                    value={formData.bankName}
                    readOnly={!!profile.bankDetails?.bankName}
                    disabled={!!profile.bankDetails?.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className={`border-[#8a6144]/30 ${profile.bankDetails?.bankName ? 'bg-gray-50' : 'focus:ring-[#8a6144]'}`}
                    placeholder="e.g. HDFC Bank, SBI, etc."
                  />
                  <Input
                    id="accountNumber"
                    label="Account Number"
                    value={formData.accountNumber}
                    readOnly={!!profile.bankDetails?.accountNumber}
                    disabled={!!profile.bankDetails?.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className={`border-[#8a6144]/30 ${profile.bankDetails?.accountNumber ? 'bg-gray-50' : 'focus:ring-[#8a6144]'}`}
                    placeholder="Enter account number"
                  />
                  <Input
                    id="ifscCode"
                    label="IFSC Code"
                    value={formData.ifscCode}
                    readOnly={!!profile.bankDetails?.ifscCode}
                    disabled={!!profile.bankDetails?.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    className={`border-[#8a6144]/30 ${profile.bankDetails?.ifscCode ? 'bg-gray-50' : 'focus:ring-[#8a6144]'}`}
                    placeholder="Enter IFSC code"
                  />
                  <Input
                    id="panCardNumber"
                    label="PAN Card Number"
                    value={formData.panCardNumber}
                    readOnly={!!profile.panCardNumber}
                    disabled={!!profile.panCardNumber}
                    onChange={(e) => setFormData({ ...formData, panCardNumber: e.target.value })}
                    className={`border-[#8a6144]/30 ${profile.panCardNumber ? 'bg-gray-50' : 'focus:ring-[#8a6144]'}`}
                    placeholder="Enter PAN card number"
                  />
                  <Input
                    id="upiId"
                    label="UPI ID"
                    value={formData.upiId}
                    readOnly={!!profile.upiId}
                    disabled={!!profile.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    className={`border-[#8a6144]/30 ${profile.upiId ? 'bg-gray-50' : 'focus:ring-[#8a6144]'}`}
                    placeholder="example@upi"
                  />
                </div>
              </div>

              <Button type="submit" variant="brand" className="w-full md:w-auto">Save All Changes</Button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#433020] dark:text-gray-200">
                <p className="p-4 bg-[#fffbf5] dark:bg-gray-700/50 rounded-2xl border border-[#8a6144]/10 dark:border-gray-600"><span className="font-bold block text-[#8a6144] dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Email Address</span> <span className="text-sm md:text-base break-all">{profile.email}</span></p>
                <p className="p-4 bg-[#fffbf5] dark:bg-gray-700/50 rounded-2xl border border-[#8a6144]/10 dark:border-gray-600"><span className="font-bold block text-[#8a6144] dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Phone Number</span> <span className="text-sm md:text-base">{profile.phone || 'N/A'}</span></p>
                <p className="p-4 bg-[#fffbf5] dark:bg-gray-700/50 rounded-2xl border border-[#8a6144]/10 dark:border-gray-600"><span className="font-bold block text-[#8a6144] dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Date of Birth</span> <span className="text-sm md:text-base">{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</span></p>
                <p className="p-4 bg-[#fffbf5] dark:bg-gray-700/50 rounded-2xl border border-[#8a6144]/10 dark:border-gray-600 md:col-span-2"><span className="font-bold block text-[#8a6144] dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Residential Address</span> <span className="text-sm md:text-base break-words">{profile.address || 'N/A'}</span></p>
              </div>

              {/* Static (View-only) Bank Details Section */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-[#8a6144] mb-4 flex items-center gap-2">🏦 Bank & Tax Details</h3>
                {!(profile.bankDetails?.bankName || profile.bankDetails?.accountNumber || profile.panCardNumber || profile.upiId) ? (
                  <div className="p-6 bg-[#fffbf5] dark:bg-gray-700/50 rounded-2xl border-2 border-dashed border-[#8a6144]/20 flex flex-col items-center justify-center text-center">
                    <p className="text-[#8a6144] font-medium mb-2">No bank details added yet.</p>
                    <p className="text-xs text-[#433020]/60 dark:text-gray-400">Click 'Edit Details' above to provide your bank and tax information for salary processing.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-[#f8f5f2] dark:bg-gray-700/30 rounded-xl border border-[#8a6144]/5">
                      <span className="font-bold block text-[#8a6144] dark:text-gray-400 text-[10px] uppercase tracking-wider mb-1">Bank Name</span>
                      <span className="text-sm font-semibold">{profile.bankDetails?.bankName || 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-[#f8f5f2] dark:bg-gray-700/30 rounded-xl border border-[#8a6144]/5">
                      <span className="font-bold block text-[#8a6144] dark:text-gray-400 text-[10px] uppercase tracking-wider mb-1">Account No.</span>
                      <span className="text-sm font-semibold tracking-wider">{profile.bankDetails?.accountNumber || 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-[#f8f5f2] dark:bg-gray-700/30 rounded-xl border border-[#8a6144]/5">
                      <span className="font-bold block text-[#8a6144] dark:text-gray-400 text-[10px] uppercase tracking-wider mb-1">IFSC Code</span>
                      <span className="text-sm font-semibold">{profile.bankDetails?.ifscCode || 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-[#f8f5f2] dark:bg-gray-700/30 rounded-xl border border-[#8a6144]/5">
                      <span className="font-bold block text-[#8a6144] dark:text-gray-400 text-[10px] uppercase tracking-wider mb-1">PAN Number</span>
                      <span className="text-sm font-semibold tracking-widest uppercase">{profile.panCardNumber || 'N/A'}</span>
                    </div>
                    <div className="p-3 bg-[#f8f5f2] dark:bg-gray-700/30 rounded-xl border border-[#8a6144]/5">
                      <span className="font-bold block text-[#8a6144] dark:text-gray-400 text-[10px] uppercase tracking-wider mb-1">UPI ID</span>
                      <span className="text-sm font-semibold lowercase">{profile.upiId || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>



        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl shadow-[#433020]/5 dark:shadow-black/20 border border-white/50 dark:border-gray-700 p-6 transition-all hover:shadow-2xl hover:shadow-[#433020]/10 dark:hover:shadow-black/30">
          <h2 className="text-2xl font-bold text-[#433020] dark:text-gray-100 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#8a6144] rounded-full inline-block"></span>
            Employment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#433020] dark:text-gray-200 text-base">
            <div className="flex items-center space-x-3 p-4 bg-[#fffbf5] dark:bg-gray-700/50 rounded-xl border border-[#8a6144]/10 dark:border-gray-600">
              <span className="text-2xl">📅</span>
              <div>
                <span className="font-bold block text-sm text-[#8a6144] dark:text-gray-400">Joining Date</span>
                <span className="text-lg font-semibold">{profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-[#fffbf5] dark:bg-gray-700/50 rounded-xl border border-[#8a6144]/10 dark:border-gray-600">
              <span className="text-2xl">💰</span>
              <div>
                <span className="font-bold block text-sm text-[#8a6144] dark:text-gray-400">Current Salary</span>
                <span className="text-lg font-semibold">{profile.salary ? `₹${profile.salary.toLocaleString()}` : 'Not Disclosed'}</span>
              </div>
            </div>
          </div>
        </div>



        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl shadow-[#433020]/5 dark:shadow-black/20 border border-white/50 dark:border-gray-700 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-[#433020]/10 dark:hover:shadow-black/30">
          <h2 className="text-2xl font-bold text-[#433020] dark:text-gray-100 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#8a6144] rounded-full inline-block"></span>
            Documents
          </h2>

          <div className="space-y-6 text-[#433020] dark:text-gray-300">
            {/* ID Proof Section */}
            <div className="p-5 bg-[#fffbf5] dark:bg-gray-700/50 rounded-2xl border border-[#8a6144]/10 dark:border-gray-600 transition duration-300 hover:border-[#8a6144]/40 dark:hover:border-gray-500">
              <h3 className="font-bold text-lg mb-2 text-[#433020] dark:text-gray-200 flex items-center gap-2">🪪 ID Proof</h3>
              {profile.idProofUrl ? (
                <a
                  href={getFullUrl(profile.idProofUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-[#8a6144] text-white rounded-lg font-medium text-sm hover:bg-[#6b4d36] transition shadow-md"
                >
                  View ID Proof
                </a>
              ) : (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'idProof')}
                    className="block w-full text-sm text-gray-600 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#f5e6d3] dark:file:bg-gray-600 file:text-[#433020] dark:file:text-white hover:file:bg-[#e6d0b3] dark:hover:file:bg-gray-500 transition cursor-pointer"
                  />
                </label>
              )}
            </div>

            {/* Marksheets & Other Documents */}
            <div className="p-5 bg-[#fffbf5] dark:bg-gray-700/50 rounded-2xl border border-[#8a6144]/10 dark:border-gray-600 transition duration-300 hover:border-[#8a6144]/40 dark:hover:border-gray-500">
              <h3 className="font-bold text-lg mb-2 text-[#433020] dark:text-gray-200 flex items-center gap-2">📚 Marksheets & Other Documents</h3>
              <ul className="space-y-2 mb-4">
                {(profile.documents || []).map((doc, index) => (
                  <li key={index} className="flex items-start gap-2 overflow-hidden">
                    <span className="text-blue-600 dark:text-blue-400 shrink-0">📄</span>
                    <a
                      href={getFullUrl(doc.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition break-all text-left leading-tight"
                    >
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <label
                  htmlFor="marksheet-upload"
                  className="block text-sm font-bold text-[#433020] dark:text-gray-300 mb-2"
                >
                  Upload Multiple Documents:
                </label>
                <input
                  id="marksheet-upload"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, 'marksheet')}
                  className="block w-full text-xs md:text-sm text-gray-600 dark:text-gray-200 file:mr-2 md:file:mr-4 file:py-2 file:px-2 md:file:px-4 file:rounded-lg file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-[#f5e6d3] dark:file:bg-gray-600 file:text-[#433020] dark:file:text-white hover:file:bg-[#e6d0b3] dark:hover:file:bg-gray-500 transition cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default EmployeeProfile;
