// // src/pages/employee/RankingsPage.js
// import React, { useState, useEffect } from 'react';
// import api from "../api/api";
// import useAuth from '../hooks/useAuth';
// import Spinner from '../components/Spinner';

// // Leaderboard component defined within the same file for simplicity
// const Leaderboard = ({ title, data, dataKey, rankKey, currentUser, themeColor }) => {
//     const rankColors = ["text-yellow-400", "text-gray-400", "text-yellow-600"];
//     const rankIcons = ["🥇", "🥈", "🥉"];

//     return (
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className={`text-2xl font-bold ${themeColor} mb-4 text-center`}>{title}</h2>
//             <ul className="space-y-3">
//                 {data.slice(0, 10).map((player) => (
//                     <li key={player._id} className={`flex items-center p-3 rounded-lg transition-all duration-300 ${player._id === currentUser._id ? 'bg-blue-100 scale-105 shadow-md' : 'hover:bg-gray-50'}`}>
//                         <span className={`text-2xl font-bold w-12 text-center ${rankColors[player[rankKey] - 1] || 'text-gray-600'}`}>
//                             {player[rankKey] <= 3 ? rankIcons[player[rankKey] - 1] : `#${player[rankKey]}`}
//                         </span>
//                         <div className="flex-grow">
//                             <p className="font-semibold text-gray-800">{player.name}</p>
//                             <p className="text-sm text-gray-500">{player.employeeId}</p>
//                         </div>
//                         <span className={`text-xl font-bold ${themeColor}`}>{player[dataKey]}%</span>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// const RankingsPage = () => {
//     const { user } = useAuth();
//     const [rankings, setRankings] = useState(null);
//     const [loading, setLoading] = useState(true);
    
//     // State for filters
//     const [month, setMonth] = useState(new Date().getMonth() + 1);
//     const [year, setYear] = useState(new Date().getFullYear());

//     useEffect(() => {
//         const fetchRankings = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await api.get(`/employee/rankings?month=${month}&year=${year}`);
//                 setRankings(data);
//             } catch (error) {
//                 console.error("Failed to fetch rankings", error);
//                 setRankings(null); // Clear old data on error
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRankings();
//     }, [month, year]); // Refetch when filters change

//     const myRanks = rankings ? {
//         timely: rankings.timelySignInRankings.find(e => e._id === user._id),
//         eod: rankings.eodSubmissionRankings.find(e => e._id === user._id)
//     } : null;

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    
//     return (
//         <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen">
//             <div className="text-center">
//                 <h1 className="text-4xl font-extrabold text-gray-800">🏆 Performance Rankings 🏆</h1>
//                 <p className="mt-2 text-gray-600">See how you stack up against your colleagues!</p>
//             </div>

//             {/* Filters */}
//             <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-center">
//                 <label className="text-sm font-medium text-gray-700">View Rankings For:</label>
//                 <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded-lg">
//                     {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
//                 </select>
//                 <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 rounded-lg w-28" />
//             </div>
            
//             {/* Conditional rendering for when data is available */}
//             {rankings ? (
//                 <>
//                     {/* Current User's Ranks */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="bg-white p-6 rounded-xl shadow-2xl text-center transform transition-transform hover:scale-105">
//                             <p className="text-lg font-semibold text-gray-600">Your Timely Sign-in Rank</p>
//                             <p className="text-5xl font-bold text-green-500 my-2">#{myRanks?.timely?.timelySignInPercentageRank || 'N/A'}</p>
//                             <p className="text-gray-500">with a {myRanks?.timely?.timelySignInPercentage || 0}% success rate</p>
//                         </div>
//                         <div className="bg-white p-6 rounded-xl shadow-2xl text-center transform transition-transform hover:scale-105">
//                             <p className="text-lg font-semibold text-gray-600">Your EOD Submission Rank</p>
//                             <p className="text-5xl font-bold text-blue-500 my-2">#{myRanks?.eod?.eodSubmissionPercentageRank || 'N/A'}</p>
//                             <p className="text-gray-500">with a {myRanks?.eod?.eodSubmissionPercentage || 0}% compliance rate</p>
//                         </div>
//                     </div>

//                     {/* Leaderboards */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         <Leaderboard 
//                             title={`Top 10 - Timely Sign-ins (${new Date(year, month - 1).toLocaleString('default', { month: 'long' })})`} 
//                             data={rankings.timelySignInRankings} 
//                             dataKey="timelySignInPercentage" 
//                             rankKey="timelySignInPercentageRank"
//                             currentUser={user}
//                             themeColor="text-green-600"
//                         />
//                         <Leaderboard 
//                             title={`Top 10 - EOD Submissions (${new Date(year, month - 1).toLocaleString('default', { month: 'long' })})`} 
//                             data={rankings.eodSubmissionRankings} 
//                             dataKey="eodSubmissionPercentage"
//                             rankKey="eodSubmissionPercentageRank"
//                             currentUser={user}
//                             themeColor="text-blue-600"
//                         />
//                     </div>
//                 </>
//             ) : (
//                 <p className="text-center text-gray-500">Could not load rankings data for the selected period.</p>
//             )}
//         </div>
//     );
// };

// export default RankingsPage;

// src/pages/employee/RankingsPage.jsimport React, { useState, useEffect } from 'react';
import api from "../api/api";
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import { useState , useEffect } from "react";

// Leaderboard component defined within the same file for simplicity
const Leaderboard = ({ title, data, dataKey, rankKey, currentUser, themeColor }) => {
    const rankColors = ["text-yellow-400", "text-gray-400", "text-yellow-600"];
    const rankIcons = ["🥇", "🥈", "🥉"];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className={`text-2xl font-bold ${themeColor} mb-4 text-center`}>{title}</h2>
            <ul className="space-y-3">
                {data.slice(0, 10).map((player) => (
                    <li key={player._id} className={`flex items-center p-3 rounded-lg transition-all duration-300 ${currentUser && player._id === currentUser._id ? 'bg-blue-100 scale-105 shadow-md' : 'hover:bg-gray-50'}`}>
                        <span className={`text-2xl font-bold w-12 text-center ${rankColors[player[rankKey] - 1] || 'text-gray-600'}`}>
                            {player[rankKey] <= 3 ? rankIcons[player[rankKey] - 1] : `#${player[rankKey]}`}
                        </span>
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800">{player.name}</p>
                            <p className="text-sm text-gray-500">{player.employeeId}</p>
                        </div>
                        <span className={`text-xl font-bold ${themeColor}`}>{player[dataKey]}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const RankingsPage = () => {
    const { user } = useAuth();
    const [rankings, setRankings] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State for filters
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchRankings = async () => {
            if (!user) return;

            const endpoint = user.role === 'hr' 
                ? `/hr/rankings?month=${month}&year=${year}` 
                : `/employee/rankings?month=${month}&year=${year}`;

            try {
                setLoading(true);
                const { data } = await api.get(endpoint);
                setRankings(data);
            } catch (error) {
                console.error("Failed to fetch rankings", error);
                setRankings(null); // Clear old data on error
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, [user, month, year]); // Refetch when filters or user change

    const myRanks = (user && user.role === 'employee' && rankings) ? {
        timely: rankings.timelySignInRankings.find(e => e._id === user._id),
        eod: rankings.eodSubmissionRankings.find(e => e._id === user._id)
    } : null;

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    
    return (
        <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-100 min-h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-800">🏆 Performance Rankings 🏆</h1>
                <p className="mt-2 text-gray-600">See how everyone is performing!</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-center">
                <label className="text-sm font-medium text-gray-700">View Rankings For:</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="p-2 border border-gray-300 rounded-lg">
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                </select>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border border-gray-300 rounded-lg w-28" />
            </div>
            
            {/* Conditional rendering for when data is available */}
            {rankings ? (
                <>
                    {/* Only show "Your Ranks" to employees */}
                    {user.role === 'employee' && myRanks && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-2xl text-center transform transition-transform hover:scale-105">
                                <p className="text-lg font-semibold text-gray-600">Your Timely Sign-in Rank</p>
                                <p className="text-5xl font-bold text-green-500 my-2">#{myRanks.timely?.timelySignInPercentageRank || 'N/A'}</p>
                                <p className="text-gray-500">with a {myRanks.timely?.timelySignInPercentage || 0}% success rate</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-2xl text-center transform transition-transform hover:scale-105">
                                <p className="text-lg font-semibold text-gray-600">Your EOD Submission Rank</p>
                                <p className="text-5xl font-bold text-blue-500 my-2">#{myRanks.eod?.eodSubmissionPercentageRank || 'N/A'}</p>
                                <p className="text-gray-500">with a {myRanks.eod?.eodSubmissionPercentage || 0}% compliance rate</p>
                            </div>
                        </div>
                    )}

                    {/* Leaderboards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Leaderboard 
                            title={`Top 10 - Timely Sign-ins (${new Date(year, month - 1).toLocaleString('default', { month: 'long' })})`} 
                            data={rankings.timelySignInRankings} 
                            dataKey="timelySignInPercentage" 
                            rankKey="timelySignInPercentageRank"
                            currentUser={user}
                            themeColor="text-green-600"
                        />
                        <Leaderboard 
                            title={`Top 10 - EOD Submissions (${new Date(year, month - 1).toLocaleString('default', { month: 'long' })})`} 
                            data={rankings.eodSubmissionRankings} 
                            dataKey="eodSubmissionPercentage"
                            rankKey="eodSubmissionPercentageRank"
                            currentUser={user}
                            themeColor="text-blue-600"
                        />
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500">Could not load rankings data for the selected period.</p>
            )}
        </div>
    );
};

export default RankingsPage;
