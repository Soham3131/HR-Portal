
// // neww
// import React, { useState, useEffect } from 'react';
// import api from '../api/api';
// import useAuth from '../hooks/useAuth';
// import StatCard from '../components/StatCard';
// import AttendanceLog from '../components/AttendenceLog';
// import Button from '../components/Button';
// import Modal from '../components/Modal';
// import Spinner from '../components/Spinner';
// import ThemeToggle from '../components/ThemeToggle';
// import { useTheme } from '../context/ThemeContext';
// import MotivationalQuotes from '../components/MotivationalQuotes';


// const EmployeeDashboard = () => {
//     const { user } = useAuth();
//     const [profile, setProfile] = useState(null);
//     const [attendance, setAttendance] = useState([]);
//     const [todayAttendance, setTodayAttendance] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [isMobile, setIsMobile] = useState(false);
//     const [isCheckInModalOpen, setCheckInModalOpen] = useState(false);
//     const [isCheckOutModalOpen, setCheckOutModalOpen] = useState(false);
//     const [isUnpaidLeaveModalOpen, setUnpaidLeaveModalOpen] = useState(false);
//     const [eod, setEod] = useState('');
//     const [notes, setNotes] = useState('');
//     const [requestedLeaveType, setRequestedLeaveType] = useState(null);
//     const { theme } = useTheme();

//     const [ip, setIp] = useState("");

//     const [isCheckingIn, setIsCheckingIn] = useState(false);

// useEffect(() => {
//   const getIp = async () => {
//     try {
//       const res = await fetch("https://api.ipify.org?format=json");
//       const data = await res.json();
//       setIp(data.ip);
//     } catch (err) {
//       console.error("Failed to fetch IP:", err);
//     }
//   };
//   getIp();
// }, []);

//     useEffect(() => {
//         const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
//         const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
//         setIsMobile(isMobileUA);
//     }, []);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const [profileRes, attendanceRes] = await Promise.all([
//                 api.get('/employee/profile'),
//                 api.get('/employee/attendance')
//             ]);
//             setProfile(profileRes.data);
//             setAttendance(attendanceRes.data);
//             const now = new Date();
//             const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
//             const todayString = todayUTC.toISOString().split('T')[0];
//             const todayRecord = attendanceRes.data.find(a => a.date.startsWith(todayString));
//             setTodayAttendance(todayRecord);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!isMobile) {
//             fetchData();
//         }
//     }, [user, isMobile]);

//     const handleLeaveRequest = (leaveType) => {
//         const requiredLeaves = leaveType === 'Holiday' ? 1 : 0.5;
//         if (profile.holidaysLeft < requiredLeaves) {
//             setRequestedLeaveType(leaveType);
//             setCheckInModalOpen(false);
//             setUnpaidLeaveModalOpen(true);
//         } else {
//             handleCheckIn(leaveType);
//         }
//     };

  
// const handleCheckIn = async (status) => {
//     if (!("geolocation" in navigator)) {
//         alert("Geolocation is not supported in this browser!");
//         return;
//     }

//     if (isCheckingIn) return; // prevent double submission
//     setIsCheckingIn(true);

//     navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//             try {
//                 const { latitude, longitude } = pos.coords;
//                 const deviceInfo = navigator.userAgent;
//                 const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

//                 const { data: newRecord } = await api.post('/employee/attendance', {
//                     type: 'checkin',
//                     status,
//                     notes,
//                     deviceInfo,
//                     ipAddress: ip,
//                     latitude,
//                     longitude,
//                     isTouchDevice
//                 });

//                 setCheckInModalOpen(false);
//                 setNotes('');
//                 setTodayAttendance(newRecord);

//                 const { data: updatedProfile } = await api.get('/employee/profile');
//                 setProfile(updatedProfile);
//                 setAttendance(prev => [newRecord, ...prev.filter(a => a._id !== newRecord._id)]);
//             } catch (error) {
//                 console.error("Check-in failed:", error);
//                 alert(error.response?.data?.message || 'Check-in failed');
//             } finally {
//                 setIsCheckingIn(false); // reset loading flag
//             }
//         },
//         (err) => {
//             alert("⚠️ Location access is required for attendance!");
//             console.error("GPS Error:", err);
//             setIsCheckingIn(false); // reset even if error
//         },
//         { enableHighAccuracy: true }
//     );
// };


//     const proceedWithUnpaidLeave = () => {
//         handleCheckIn(requestedLeaveType);
//         setUnpaidLeaveModalOpen(false);
//     };



// const handleCheckOut = () => {
//     if (!eod.trim()) {
//         // Use a more user-friendly modal or alert alternative here
//         alert("EOD report is required to check out.");
//         return;
//     }

//     if (!("geolocation" in navigator)) {
//         // Use a more user-friendly modal or alert alternative here
//         alert("Geolocation is not supported in this browser!");
//         return;
//     }

//     // Capture the device type immediately before making the API call
//     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

//     navigator.geolocation.getCurrentPosition(
//         async (pos) => {
//             try {
//                 const { latitude, longitude } = pos.coords;

//                 const { data: updatedRecord } = await api.post('/employee/attendance', {
//                     type: 'checkout',
//                     eod,
//                     ipAddress: ip,
//                     latitude,
//                     longitude,
//                     isTouchDevice, // <-- Now passing this value to the backend
//                 });

//                 setCheckOutModalOpen(false);
//                 setEod('');
//                 setTodayAttendance(updatedRecord);
//                 setAttendance(prevAttendance =>
//                     prevAttendance.map(att => att._id === updatedRecord._id ? updatedRecord : att)
//                 );
//             } catch (error) {
//                 console.error("Check-out failed:", error);
//                 // Use a more user-friendly modal or alert alternative here
//                 alert(error.response?.data?.message || 'Check-out failed');
//             }
//         },
//         (err) => {
//             // Use a more user-friendly modal or alert alternative here
//             alert("⚠️ Location access is required for checkout!");
//             console.error("GPS Error:", err);
//         },
//         { enableHighAccuracy: true }
//     );
// };


//     const isAfterMidday = new Date().getHours() >= 12;

//     if (isMobile) {
//         return (
//             <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
//                 <h1 className="text-2xl font-bold text-red-600">Access Restricted on Mobile</h1>
//                 <p className="mt-4 text-gray-700 dark:text-gray-300">Please use a desktop computer or enable "Desktop site" in your mobile browser to access the dashboard.</p>
//             </div>
//         );
//     }

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className={`min-h-screen p-6 space-y-6 bg-gradient-to-br rounded-b-[2rem] shadow-lg ${theme === 'dark' ? 'from-gray-900 to-black text-white' : 'from-blue-100 to-white text-gray-800'}`}>
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
//                 <ThemeToggle />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <StatCard title="Employee ID" value={profile?.employeeId ?? 'N/A'} />
//                 <StatCard title="Department" value={profile?.department ?? 'N/A'} />
//                 <StatCard title="Holidays Left" value={profile?.holidaysLeft ?? 'N/A'} />
//             </div>

//             <div className="grid grid-cols-1">
//                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
//                     <h3 className="font-semibold text-lg mb-4">Today's Attendance</h3>
//                     {todayAttendance ? (
//                         <div className="space-y-2">
//                             <p>Status: <span className="font-bold text-green-600 dark:text-green-400">{todayAttendance.status}</span></p>
//                             <p>Checked In: <span className="font-bold">{new Date(todayAttendance.checkIn).toLocaleTimeString()}</span></p>
//                             {todayAttendance.notes && <p>Notes: <span className="italic text-gray-600 dark:text-gray-300">{todayAttendance.notes}</span></p>}
//                             {todayAttendance.checkOut ? (
//                                 <p>Checked Out: <span className="font-bold">{new Date(todayAttendance.checkOut).toLocaleTimeString()}</span></p>
//                             ) : (
//                                 <Button onClick={() => setCheckOutModalOpen(true)} variant="danger" className="mt-2">Check Out</Button>
//                             )}
//                         </div>
//                     ) : (
//                         <Button onClick={() => setCheckInModalOpen(true)} variant="primary">Check In for Today</Button>
//                     )}
//                 </div>
//             </div>

//             <AttendanceLog attendance={attendance} />

//             {/* Modals */}
//             <Modal isOpen={isCheckInModalOpen} onClose={() => setCheckInModalOpen(false)} title="Mark Your Attendance">
//                 <div className="space-y-4">
//                     <p>How would you like to mark your attendance?</p>
//                     <div className="flex justify-around">
//                         {/* --- CHANGE: Conditionally render the Full Day button --- */}
//                         {!isAfterMidday && (
//                             <Button onClick={() => handleCheckIn('Present')}>Full Day</Button>
//                         )}
//                         <Button onClick={() => handleLeaveRequest('Half Day')} variant="secondary">Half Day</Button>
//                         {/* The "Take Holiday" button has been removed */}
//                     </div>
//                     <div className="mt-4">
//                         <label htmlFor="notes" className="block text-sm font-medium mb-1">Optional Notes</label>
//                         <textarea id="notes" rows="3" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Working from home..." />
//                     </div>
//                 </div>
//             </Modal>

//             <Modal isOpen={isUnpaidLeaveModalOpen} onClose={() => setUnpaidLeaveModalOpen(false)} title="Confirm Unpaid Leave">
//                 <div className="text-center space-y-4">
//                     <p className="text-lg font-semibold text-red-600 dark:text-red-400">No paid leaves left.</p>
//                     <p>This leave will be marked as unpaid. Proceed?</p>
//                     <div className="flex justify-center space-x-4 pt-4">
//                         <Button onClick={() => setUnpaidLeaveModalOpen(false)} variant="secondary">Cancel</Button>
//                         <Button onClick={proceedWithUnpaidLeave} variant="danger">Proceed</Button>
//                     </div>
//                 </div>
//             </Modal>

//             <Modal isOpen={isCheckOutModalOpen} onClose={() => setCheckOutModalOpen(false)} title="Submit EOD & Check Out">
//                 <div>
//                     <label htmlFor="eod" className="block text-sm font-medium mb-2">End of Day Report</label>
//                     <textarea
//                         id="eod"
//                         rows="4"
//                         className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
//                         value={eod}
//                         onChange={(e) => setEod(e.target.value)}
//                         placeholder="Summarize today's work..."
//                     ></textarea>
//                     <Button onClick={handleCheckOut} className="w-full mt-4">Submit EOD and Check Out</Button>
//                 </div>
//             </Modal>
//             <div className="w-full overflow-x-auto">
//                 <MotivationalQuotes />
//             </div>

//         </div>
//     );
// };

// export default EmployeeDashboard;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import useAuth from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import AttendanceLog from '../components/AttendenceLog';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import MotivationalQuotes from '../components/MotivationalQuotes';
import EmployeeLoader from '../components/EmployeeLoader';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isCheckInModalOpen, setCheckInModalOpen] = useState(false);
    const [isCheckOutModalOpen, setCheckOutModalOpen] = useState(false);
    const [isUnpaidLeaveModalOpen, setUnpaidLeaveModalOpen] = useState(false);
    const [eod, setEod] = useState('');
    const [notes, setNotes] = useState('');
    const [requestedLeaveType, setRequestedLeaveType] = useState(null);
    const { theme } = useTheme();

    const [ip, setIp] = useState("");

    const [isCheckingIn, setIsCheckingIn] = useState(false);

    useEffect(() => {
        const getIp = async () => {
            try {
                const res = await fetch("https://api.ipify.org?format=json");
                const data = await res.json();
                setIp(data.ip);
            } catch (err) {
                console.error("Failed to fetch IP:", err);
            }
        };
        getIp();
    }, []);

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        setIsMobile(isMobileUA);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, attendanceRes] = await Promise.all([
                api.get('/employee/profile'),
                api.get('/employee/attendance')
            ]);
            setProfile(profileRes.data);
            setAttendance(attendanceRes.data);
            const now = new Date();
            const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            const todayString = todayUTC.toISOString().split('T')[0];
            const todayRecord = attendanceRes.data.find(a => a.date.startsWith(todayString));
            setTodayAttendance(todayRecord);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isMobile) {
            fetchData();
        }
    }, [user, isMobile]);

    const handleLeaveRequest = (leaveType) => {
        const requiredLeaves = leaveType === 'Holiday' ? 1 : 0.5;
        if (profile.holidaysLeft < requiredLeaves) {
            setRequestedLeaveType(leaveType);
            setCheckInModalOpen(false);
            setUnpaidLeaveModalOpen(true);
        } else {
            handleCheckIn(leaveType);
        }
    };

    const handleCheckIn = async (status) => {
        if (!("geolocation" in navigator)) {
            // Use a modal or a toast notification here instead of alert
            alert("Geolocation is not supported in this browser!");
            return;
        }

        if (isCheckingIn) return;
        setIsCheckingIn(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const deviceInfo = navigator.userAgent;
                    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

                    const { data: newRecord } = await api.post('/employee/attendance', {
                        type: 'checkin',
                        status,
                        notes,
                        deviceInfo,
                        ipAddress: ip,
                        latitude,
                        longitude,
                        isTouchDevice
                    });

                    setCheckInModalOpen(false);
                    setNotes('');
                    setTodayAttendance(newRecord);

                    const { data: updatedProfile } = await api.get('/employee/profile');
                    setProfile(updatedProfile);
                    setAttendance(prev => [newRecord, ...prev.filter(a => a._id !== newRecord._id)]);
                } catch (error) {
                    console.error("Check-in failed:", error);
                    alert(error.response?.data?.message || 'Check-in failed');
                } finally {
                    setIsCheckingIn(false);
                }
            },
            (err) => {
                alert("⚠️ Location access is required for attendance!");
                console.error("GPS Error:", err);
                setIsCheckingIn(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const proceedWithUnpaidLeave = () => {
        handleCheckIn(requestedLeaveType);
        setUnpaidLeaveModalOpen(false);
    };

    const handleCheckOut = () => {
        if (!eod.trim()) {
            alert("EOD report is required to check out.");
            return;
        }

        if (!("geolocation" in navigator)) {
            alert("Geolocation is not supported in this browser!");
            return;
        }

        if (isCheckingIn) return;
        setIsCheckingIn(true);

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;

                    const { data: updatedRecord } = await api.post('/employee/attendance', {
                        type: 'checkout',
                        eod,
                        ipAddress: ip,
                        latitude,
                        longitude,
                        isTouchDevice,
                    });

                    setCheckOutModalOpen(false);
                    setEod('');
                    setTodayAttendance(updatedRecord);
                    setAttendance(prevAttendance =>
                        prevAttendance.map(att => att._id === updatedRecord._id ? updatedRecord : att)
                    );
                } catch (error) {
                    console.error("Check-out failed:", error);
                    alert(error.response?.data?.message || 'Check-out failed');
                } finally {
                    setIsCheckingIn(false);
                }
            },
            (err) => {
                alert("⚠️ Location access is required for checkout!");
                console.error("GPS Error:", err);
                setIsCheckingIn(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const isAfterMidday = new Date().getHours() >= 12;

    if (isMobile) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold text-red-600">Access Restricted on Mobile</h1>
                <p className="mt-4 text-gray-700 dark:text-gray-300">Please use a desktop computer or enable "Desktop site" in your mobile browser to access the dashboard.</p>
            </div>
        );
    }

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

    // --- Main conditional rendering for the loader ---
  if (isCheckingIn) {
  return <EmployeeLoader name={profile?.name || user?.name} action={isCheckOutModalOpen ? "checkout" : "checkin"} />;
}


    return (
        <div className={`min-h-screen p-6 space-y-6 bg-gradient-to-br rounded-b-[2rem] shadow-lg ${theme === 'dark' ? 'from-gray-900 to-black text-white' : 'from-blue-100 to-white text-gray-800'}`}>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}!</h1>
                <ThemeToggle />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Employee ID" value={profile?.employeeId ?? 'N/A'} />
                <StatCard title="Department" value={profile?.department ?? 'N/A'} />
                <StatCard title="Holidays Left" value={profile?.holidaysLeft ?? 'N/A'} />
            </div>

            <div className="grid grid-cols-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="font-semibold text-lg mb-4">Today's Attendance</h3>
                    {todayAttendance ? (
                        <div className="space-y-2">
                            <p>Status: <span className="font-bold text-green-600 dark:text-green-400">{todayAttendance.status}</span></p>
                            <p>Checked In: <span className="font-bold">{new Date(todayAttendance.checkIn).toLocaleTimeString()}</span></p>
                            {todayAttendance.notes && <p>Notes: <span className="italic text-gray-600 dark:text-gray-300">{todayAttendance.notes}</span></p>}
                            {todayAttendance.checkOut ? (
                                <p>Checked Out: <span className="font-bold">{new Date(todayAttendance.checkOut).toLocaleTimeString()}</span></p>
                            ) : (
                                <Button onClick={() => setCheckOutModalOpen(true)} variant="danger" className="mt-2" disabled={isCheckingIn}>Check Out</Button>
                            )}
                        </div>
                    ) : (
                        <Button onClick={() => setCheckInModalOpen(true)} variant="primary" disabled={isCheckingIn}>Check In for Today</Button>
                    )}
                </div>
            </div>

            <AttendanceLog attendance={attendance} />

            {/* Modals */}
            <Modal isOpen={isCheckInModalOpen} onClose={() => setCheckInModalOpen(false)} title="Mark Your Attendance">
                <div className="space-y-4">
                    <p>How would you like to mark your attendance?</p>
                    <div className="flex justify-around">
                        {!isAfterMidday && (
                            <Button onClick={() => handleCheckIn('Present')} disabled={isCheckingIn}>Full Day</Button>
                        )}
                        <Button onClick={() => handleLeaveRequest('Half Day')} variant="secondary" disabled={isCheckingIn}>Half Day</Button>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="notes" className="block text-sm font-medium mb-1">Optional Notes</label>
                        <textarea id="notes" rows="3" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Working from home..." disabled={isCheckingIn} />
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isUnpaidLeaveModalOpen} onClose={() => setUnpaidLeaveModalOpen(false)} title="Confirm Unpaid Leave">
                <div className="text-center space-y-4">
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">No paid leaves left.</p>
                    <p>This leave will be marked as unpaid. Proceed?</p>
                    <div className="flex justify-center space-x-4 pt-4">
                        <Button onClick={() => setUnpaidLeaveModalOpen(false)} variant="secondary" disabled={isCheckingIn}>Cancel</Button>
                        <Button onClick={proceedWithUnpaidLeave} variant="danger" disabled={isCheckingIn}>Proceed</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isCheckOutModalOpen} onClose={() => setCheckOutModalOpen(false)} title="Submit EOD & Check Out">
                <div>
                    <label htmlFor="eod" className="block text-sm font-medium mb-2">End of Day Report</label>
                    <textarea
                        id="eod"
                        rows="4"
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        value={eod}
                        onChange={(e) => setEod(e.target.value)}
                        placeholder="Summarize today's work..."
                        disabled={isCheckingIn}
                    ></textarea>
                    <Button onClick={handleCheckOut} className="w-full mt-4" disabled={isCheckingIn}>Submit EOD and Check Out</Button>
                </div>
            </Modal>
            <div className="w-full overflow-x-auto">
                <MotivationalQuotes />
            </div>

        </div>
    );
};

export default EmployeeDashboard;

