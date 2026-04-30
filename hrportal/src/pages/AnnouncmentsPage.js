// // src/pages/hr/AnnouncementsPage.js
// import React, { useState, useEffect } from 'react';
// import api from "../api/api"
// import Spinner from '../components/Spinner';
// import Button from '../components/Button';
// import { formatDate } from '../utils/formatDate';

// const AnnouncementsPage = () => {
//     const [announcements, setAnnouncements] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');

//     const fetchAnnouncements = async () => {
//         try {
//             setLoading(true);
//             const { data } = await api.get('/hr/announcements');
//             setAnnouncements(data);
//         } catch (error) {
//             console.error("Failed to fetch announcements", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchAnnouncements();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await api.post('/hr/announcements', { title, content });
//             setTitle('');
//             setContent('');
//             fetchAnnouncements(); // Refresh the list
//         } catch (error) {
//             console.error("Failed to create announcement", error);
//             alert("Could not create announcement.");
//         }
//     };

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className="space-y-8">
//             <h1 className="text-3xl font-bold text-gray-800">Company Announcements</h1>

//             {/* Form to create a new announcement */}
//             <div className="bg-white p-6 rounded-lg shadow">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create New Announcement</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
//                         <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
//                     </div>
//                     <div>
//                         <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
//                         <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows="5" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
//                     </div>
//                     <Button type="submit">Post Announcement</Button>
//                 </form>
//             </div>

//             {/* List of past announcements */}
//             <div className="bg-white p-6 rounded-lg shadow">
//                 <h2 className="text-2xl font-semibold text-gray-700 mb-4">Posted Announcements</h2>
//                 <div className="space-y-4">
//                     {announcements.map(ann => (
//                         <div key={ann._id} className="border-b pb-4">
//                             <h3 className="text-xl font-bold">{ann.title}</h3>
//                             <p className="text-sm text-gray-500">Posted by {ann.createdBy.name} on {formatDate(ann.createdAt)}</p>
//                             <p className="mt-2 text-gray-700 whitespace-pre-wrap">{ann.content}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AnnouncementsPage;

// // src/pages/hr/AnnouncementsPage.js
// import React, { useState, useEffect } from 'react';
// import api from '../api/api';
// import Spinner from '../components/Spinner';
// import Button from '../components/Button';
// import { formatDate } from '../utils/formatDate';
// // Custom animations if needed

// const AnnouncementsPage = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');

//   const fetchAnnouncements = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get('/hr/announcements');
//       setAnnouncements(data);
//     } catch (error) {
//       console.error('Failed to fetch announcements', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/hr/announcements', { title, content });
//       setTitle('');
//       setContent('');
//       fetchAnnouncements();
//     } catch (error) {
//       console.error('Failed to create announcement', error);
//       alert('Could not create announcement.');
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-10 px-6 space-y-10 animate-fade-in-up">
//       <h1 className="text-4xl font-extrabold text-center text-gray-800 drop-shadow">
//         📣 Company Announcements
//       </h1>

//       {/* Form Section */}
//       <div className="max-w-3xl mx-auto bg-white bg-opacity-80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl animate-fade-in-up transition-all duration-700">
//         <h2 className="text-2xl font-bold text-gray-700 mb-6">📝 Create New Announcement</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               placeholder="Enter announcement title"
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
//             />
//           </div>
//           <div>
//             <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
//               Content
//             </label>
//             <textarea
//               id="content"
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               required
//               rows="5"
//               placeholder="Write your announcement..."
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
//             />
//           </div>
//           <Button type="submit">🚀 Post Announcement</Button>
//         </form>
//       </div>

//       {/* Announcement List */}
//       <div className="max-w-4xl mx-auto space-y-6">
//         <h2 className="text-2xl font-bold text-gray-700">📌 Posted Announcements</h2>
//         {announcements.map((ann) => (
//           <div
//             key={ann._id}
//             className="bg-white rounded-xl shadow-md p-6 hover:scale-[1.01] hover:shadow-lg transition-all duration-300 animate-fade-in-up"
//           >
//             <h3 className="text-xl font-bold text-blue-800">{ann.title}</h3>
//             <p className="text-sm text-gray-500">
//               Posted by <span className="font-medium">{ann.createdBy.name}</span> on {formatDate(ann.createdAt)}
//             </p>
//             <p className="mt-4 text-gray-700 whitespace-pre-wrap">{ann.content}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AnnouncementsPage;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { formatDate } from '../utils/formatDate';
import { motion } from 'framer-motion';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/hr/announcements');
            setAnnouncements(data);
        } catch (error) {
            console.error('Failed to fetch announcements', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hr/announcements', { title, content });
            setTitle('');
            setContent('');
            fetchAnnouncements();
        } catch (error) {
            console.error('Failed to create announcement', error);
            alert('Could not create announcement.');
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fff5e6] via-white to-[#f5e6d3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-white/50">
                    <Spinner />
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff5e6] via-[#f5e6d3] to-[#fff5e6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 md:px-8 py-10 space-y-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#433020] dark:text-gray-100 drop-shadow-sm tracking-tight flex items-center gap-3">
                    <span className="w-2 h-10 bg-[#8a6144] rounded-full inline-block"></span>
                    Company Announcements
                </h1>

                {/* Form Section */}
                <div className="bg-white/90 dark:bg-gray-800/90 p-6 md:p-8 rounded-3xl shadow-xl shadow-[#433020]/5 border border-white/50 dark:border-gray-700 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-[#433020] dark:text-gray-100 mb-6 flex items-center gap-2">
                        📝 Create New Announcement
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-[#8a6144] uppercase tracking-widest mb-2 font-mono ml-1">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="What is this announcement about?"
                                className="w-full p-3.5 bg-[#fffbf5]/50 dark:bg-gray-900/50 border-2 border-[#8a6144]/10 dark:border-gray-700 rounded-2xl text-[#433020] dark:text-gray-100 placeholder:text-gray-400 focus:ring-4 focus:ring-[#8a6144]/10 focus:border-[#8a6144] outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block text-sm font-bold text-[#8a6144] uppercase tracking-widest mb-2 font-mono ml-1">Content</label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows="5"
                                placeholder="Describe the announcement in detail..."
                                className="w-full p-3.5 bg-[#fffbf5]/50 dark:bg-gray-900/50 border-2 border-[#8a6144]/10 dark:border-gray-700 rounded-2xl text-[#433020] dark:text-gray-100 placeholder:text-gray-400 focus:ring-4 focus:ring-[#8a6144]/10 focus:border-[#8a6144] outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                        <Button type="submit" variant="brand" className="px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            🚀 Post Announcement
                        </Button>
                    </form>
                </div>

                {/* List Section */}
                <div className="bg-white/90 dark:bg-gray-800/90 p-6 md:p-8 rounded-3xl shadow-xl shadow-[#433020]/5 border border-white/50 dark:border-gray-700 backdrop-blur-md">
                    <h2 className="text-2xl font-bold text-[#433020] dark:text-gray-100 mb-6 flex items-center gap-2">
                        📌 Posted Announcements
                    </h2>
                    <div className="space-y-8">
                        {announcements.length > 0 ? (
                            announcements.map((ann, index) => (
                                <div key={ann._id} className="border-b dark:border-gray-700 pb-8 last:border-0 last:pb-0 group">
                                    <h3 className="text-2xl font-bold text-[#433020] dark:text-gray-100 group-hover:text-[#8a6144] transition-colors">{ann.title}</h3>
                                    <p className="inline-flex items-center text-xs font-bold text-[#8a6144] dark:text-gray-400 mt-2 bg-[#fff5e6] dark:bg-gray-700/50 px-3 py-1 rounded-full border border-[#8a6144]/10">
                                        📅 Posted by {ann.createdBy?.name || 'Deleted User'} on {formatDate(ann.createdAt)}
                                    </p>
                                    <p className="mt-5 text-[#433020] dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm md:text-base bg-[#fffbf5]/30 dark:bg-transparent p-4 rounded-2xl border border-transparent group-hover:border-[#8a6144]/10 transition-all">
                                        {ann.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-[#8a6144] dark:text-gray-500 italic text-lg font-medium">No announcements have been posted yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AnnouncementsPage;