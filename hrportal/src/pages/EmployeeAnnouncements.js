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
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow-sm">
            Company Announcements
          </h1>
          {hasUnread && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleMarkAsRead}>
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
              className={`p-6 rounded-xl shadow-md backdrop-blur-md bg-white/80 ${
                ann.isRead ? '' : 'border-l-4 border-blue-500'
              } hover:shadow-lg transition duration-300`}
            >
              {!ann.isRead && (
                <p className="text-xs font-bold text-blue-600 uppercase mb-1 animate-pulse">
                  New
                </p>
              )}
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{ann.title}</h2>
              <p className="text-sm text-gray-500 mb-3">📅 Posted on {formatDate(ann.createdAt)}</p>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeAnnouncements;
