
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/api';
import logo from "../assets/logo.jpg";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [hasUnread, setHasUnread] = useState(false);
    const [pendingLeavesCount, setPendingLeavesCount] = useState(0);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchNavData = async () => {
            setProfile(null);
            setHasUnread(false);
            setPendingLeavesCount(0);
            if (user && user.role === 'employee') {
                try {
                    const [profileRes, announcementsRes] = await Promise.all([
                        api.get('/employee/profile'),
                        api.get('/employee/announcements'),
                    ]);
                    setProfile(profileRes.data);
                    setHasUnread(announcementsRes.data.some((ann) => !ann.isRead));
                } catch (error) {
                    console.error("Navbar could not fetch data");
                }
            } else if (user && user.role === 'hr') {
                try {
                    const { data } = await api.get('/hr/leaves/pending');
                    setPendingLeavesCount(data.length);
                } catch (error) {
                    console.error("Navbar could not fetch HR data");
                }
            }
        };
        fetchNavData();
    }, [user, location.pathname]);

    const activeLinkStyle = {
        color: '#4F46E5',
        fontWeight: '700',
    };

    const handleLinkClick = () => setMobileMenuOpen(false);

    return (
        <nav className="bg-gradient-to-r from-white to-blue-50 shadow-md sticky top-0 z-50 font-sans animate-fade-in-down">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3 hover:scale-105 transition">
                        <img src={logo} alt="Avani Enterprises Logo" className="h-[3rem] w-auto" />
                        <span className="text-2xl font-bold text-indigo-700 tracking-wide">AVANI ENTERPRISES</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4 items-center">
                        {user ? (
                            <>
                                {user.role === 'hr' && (
                                    <>
                                        <NavLink to="/hr/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Dashboard</NavLink>
                                        <NavLink to="/hr/approve-leave" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="relative nav-item">
                                            Approve Leave
                                            {pendingLeavesCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-ping"></span>}
                                        </NavLink>
                                        <NavLink to="/hr/analytics" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Analytics</NavLink>
                                        {/* --- NEW HR RANKINGS LINK --- */}
                                        <NavLink to="/hr/rankings" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Rankings</NavLink>
                                        <NavLink to="/hr/manage-employees" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Manage Emp.</NavLink>
                                        <NavLink to="/hr/salary-calculator" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Salary Calculator</NavLink>
                                        <NavLink to="/hr/eod-reports" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">EOD Reports</NavLink>
                                        <NavLink to="/hr/announcements" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Announcements</NavLink>
                                        <NavLink to="/hr/penalties" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Mobile Logins</NavLink>
                                    </>
                                )}

                                {user.role === 'employee' && (
                                    <>
                                        <NavLink to="/employee/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Dashboard</NavLink>
                                        {/* --- NEW EMPLOYEE RANKINGS LINK --- */}
                                        <NavLink to="/employee/rankings" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Rankings</NavLink>
                                        <NavLink to="/employee/apply-leave" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="nav-item">Apply for Leave</NavLink>
                                        <NavLink to="/employee/announcements" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="relative nav-item">
                                            Announcements
                                            {hasUnread && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-ping"></span>}
                                        </NavLink>
                                    </>
                                )}

                                <button onClick={logout} className="px-3 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-md font-medium transition">
                                    Logout
                                </button>

                                {user.role === 'employee' && (
                                    <Link to="/employee/profile">
                                        <img src={profile?.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="Profile" className="w-10 h-10 rounded-full object-cover ml-4 border-2 border-indigo-500 hover:scale-105 transition" />
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="nav-item">Login</NavLink>
                                <NavLink to="/register" className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition">Register</NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none">
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md transition-all duration-300">
                    <div className="px-4 py-3 space-y-2">
                        {user ? (
                            <>
                                {user.role === 'hr' && (
                                    <>
                                        <NavLink to="/hr/dashboard" onClick={handleLinkClick} className="mobile-link">Dashboard</NavLink>
                                        <NavLink to="/hr/approve-leave" onClick={handleLinkClick} className="mobile-link">Approve Leave</NavLink>
                                        <NavLink to="/hr/analytics" onClick={handleLinkClick} className="mobile-link">Analytics</NavLink>
                                        <NavLink to="/hr/rankings" onClick={handleLinkClick} className="mobile-link">Rankings</NavLink>
                                        <NavLink to="/hr/manage-employees" onClick={handleLinkClick} className="mobile-link">Manage Employees</NavLink>
                                        <NavLink to="/hr/salary-calculator" onClick={handleLinkClick} className="mobile-link">Salary Calculator</NavLink>
                                        <NavLink to="/hr/eod-reports" onClick={handleLinkClick} className="mobile-link">EOD Reports</NavLink>
                                        <NavLink to="/hr/announcements" onClick={handleLinkClick} className="mobile-link">Announcements</NavLink>
                                        <NavLink to="/hr/penalties" onClick={handleLinkClick} className="mobile-link">Mobile Device Logins</NavLink>
                                    </>
                                )}
                                {user.role === 'employee' && (
                                    <>
                                        <NavLink to="/employee/dashboard" onClick={handleLinkClick} className="mobile-link">Dashboard</NavLink>
                                        <NavLink to="/employee/rankings" onClick={handleLinkClick} className="mobile-link">Rankings</NavLink>
                                        <NavLink to="/employee/apply-leave" onClick={handleLinkClick} className="mobile-link">Apply for Leave</NavLink>
                                        <NavLink to="/employee/announcements" onClick={handleLinkClick} className="mobile-link">Announcements</NavLink>
                                        <NavLink to="/employee/profile" onClick={handleLinkClick} className="mobile-link">Profile</NavLink>
                                    </>
                                )}
                                <button onClick={() => { logout(); handleLinkClick(); }} className="w-full text-left bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md font-medium transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" onClick={handleLinkClick} className="mobile-link">Login</NavLink>
                                <NavLink to="/register" onClick={handleLinkClick} className="mobile-link">Register</NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
