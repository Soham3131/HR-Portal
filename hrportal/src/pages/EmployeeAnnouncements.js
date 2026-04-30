// import React, { useState, useEffect } from 'react';
// import api from "../api/api"
// import Spinner from '../components/Spinner';
// import Button from '../components//Button';
// import { formatDate } from '../utils/formatDate';

// const EmployeeAnnouncements = () => {
//     const [announcements, setAnnouncements] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchAnnouncements = async () => {
//         try {
//             setLoading(true);
//             const { data } = await api.get('/employee/announcements');
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

//     const handleMarkAsRead = async () => {
//         try {
//             await api.post('/employee/announcements/read');
//             // Optimistically update the UI without a full refetch
//             setAnnouncements(announcements.map(ann => ({ ...ann, isRead: true })));
//         } catch (error) {
//             console.error("Failed to mark as read", error);
//         }
//     };

//     const hasUnread = announcements.some(ann => !ann.isRead);

//     if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-gray-800">Company Announcements</h1>
//                 {hasUnread && <Button onClick={handleMarkAsRead}>Mark All as Read</Button>}
//             </div>

//             <div className="space-y-4">
//                 {announcements.map(ann => (
//                     <div key={ann._id} className={`p-6 rounded-lg shadow ${ann.isRead ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-500'}`}>
//                         {!ann.isRead && <p className="text-xs font-bold text-blue-600 uppercase mb-1">New</p>}
//                         <h2 className="text-2xl font-bold text-gray-800">{ann.title}</h2>
//                         <p className="text-sm text-gray-500 mb-4">Posted on {formatDate(ann.createdAt)}</p>
//                         <p className="text-gray-700 whitespace-pre-wrap">{ann.content}</p>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default EmployeeAnnouncements;
import React, { useState, useEffect } from 'react';
import api from "../api/api";
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { formatDate } from '../utils/formatDate';
import { motion } from 'framer-motion';

const EmployeeAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/employee/announcements');
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleMarkAsRead = async () => {
    try {
      await api.post('/employee/announcements/read');
      setAnnouncements(announcements.map(ann => ({ ...ann, isRead: true })));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const hasUnread = announcements.some(ann => !ann.isRead);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#fff5e6] via-white to-[#f5e6d3] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-white/50">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#fff5e6] via-[#f5e6d3] to-[#fff5e6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#433020] dark:text-gray-100 drop-shadow-sm tracking-tight flex items-center gap-3">
              <span className="w-2 h-10 bg-[#8a6144] rounded-full inline-block"></span>
              Company Announcements
            </h1>
          </div>
          {hasUnread && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex w-full md:w-auto justify-start md:justify-end"
            >
              <Button
                onClick={handleMarkAsRead}
                variant="brand"
                className="whitespace-nowrap text-[11px] md:text-sm py-2 px-6 w-auto"
              >
                Mark All as Read
              </Button>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          {announcements.map((ann, index) => (
            <motion.div
              key={ann._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 rounded-3xl shadow-xl shadow-[#433020]/5 dark:shadow-black/20 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/50 dark:border-gray-700 ${ann.isRead ? '' : 'border-l-8 border-l-red-500'
                } hover:shadow-2xl hover:shadow-[#433020]/10 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300`}
            >
              {!ann.isRead && (
                <p className="text-xs font-extrabold text-red-500 uppercase mb-2 animate-pulse tracking-wide">
                  New
                </p>
              )}
              <h2 className="text-2xl font-bold text-[#433020] dark:text-gray-100 mb-2">{ann.title}</h2>
              <p className="text-sm text-[#8a6144] dark:text-gray-400 mb-4 font-medium">📅 Posted on {formatDate(ann.createdAt)}</p>
              <p className="text-[#433020] dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeAnnouncements;