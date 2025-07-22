

// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

// export default function Footer() {
//   return (
//     <motion.footer
//       initial={{ opacity: 0, y: 50 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 1 }}
//       viewport={{ once: true }}
//       className="bg-gradient-to-r from-[#2d3f4e] via-[#786d9d] to-[#4a89ac] text-white py-10 relative shadow-lg rounded-t-3xl overflow-hidden"
//     >
//       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

//         {/* Left - Company */}
//         <motion.div
//           initial={{ opacity: 0, x: -40 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//           className="text-left"
//         >
//           <h2 className="text-2xl font-bold">Avani Enterprises</h2>
//           <p className="italic text-sm mt-2 text-white/80">
//             Empowering workforce with trust & technology
//           </p>
//         </motion.div>

//         {/* Center - Title and Tagline */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ delay: 0.2, duration: 1 }}
//           className="text-center"
//         >
//           <h1 className="text-3xl font-extrabold text-orange-400 drop-shadow-sm">
//             HR Portal
//           </h1>
//           <p className="italic text-white/90 mt-1">
//             Simplifying Human Resources, One Click at a Time
//           </p>

//           {/* Animated underline from left to right */}
//           <div className="relative w-32 h-[3px] mx-auto mt-3 overflow-hidden rounded-full">
//             <div className="absolute left-0 top-0 h-full bg-orange-400 animate-underline w-0" />
//           </div>
//         </motion.div>

//         {/* Right - Icons */}
//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           whileInView={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//           className="text-right flex justify-end items-center gap-4"
//         >
//           <a
//             href="mailto:hr@avani.com"
//             className="text-xl hover:text-orange-400 transition duration-300"
//           >
//             <FaEnvelope />
//           </a>
//           <a
//             href="https://linkedin.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-xl hover:text-orange-400 transition duration-300"
//           >
//             <FaLinkedin />
//           </a>
//         </motion.div>
//       </div>

//       {/* Bottom - Made with love */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         className="text-center mt-8 text-sm text-white/70"
//       >
//         <p>© 2025 Avani HR Portal. All rights reserved.</p>
//         <p className="mt-1">
//           Made with{' '}
//           <span className="inline-block relative">
//             <span className="inline-block animate-heartbeat text-red-500 text-lg transition-transform duration-500 hover:scale-[15]">
//               ❤️
//             </span>
//           </span>{' '}
//           by{' '}
//           <span className="text-orange-400 font-semibold">Soham</span>
//         </p>
//       </motion.div>

//       {/* Custom styles */}
//       <style>{`
//         @keyframes heartbeat {
//           0%, 100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.3);
//           }
//         }

//         .animate-heartbeat {
//           animation: heartbeat 1.8s infinite ease-in-out;
//         }

//         @keyframes underline {
//           0% {
//             width: 0%;
//           }
//           100% {
//             width: 100%;
//           }
//         }

//         .animate-underline {
//           animation: underline 2s ease-out forwards;
//         }
//       `}</style>
//     </motion.footer>
//   );
// }

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const [showBigHeart, setShowBigHeart] = useState(false);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-[#2d3f4e] via-[#786d9d] to-[#4a89ac] text-white py-10 relative shadow-lg rounded-t-3xl overflow-hidden"
    >
      {/* Fullscreen Heart Popup */}
      <AnimatePresence>
        {showBigHeart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 12 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.6 }}
            className="fixed top-1/2 left-1/2 z-[9999] pointer-events-none"
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <div className="text-red-500 text-[10rem] select-none">❤️</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left */}
        <div className="text-left">
          <h2 className="text-2xl font-bold">Avani Enterprises</h2>
          <p className="italic text-sm mt-2 text-white/80">
            Empowering workforce with trust & technology
          </p>
        </div>

        {/* Center */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-orange-400 drop-shadow-sm">
            HR Portal
          </h1>
          <p className="italic text-white/90 mt-1">
            Simplifying Human Resources, One Click at a Time
          </p>
          <div className="relative w-32 h-[3px] mx-auto mt-3 overflow-hidden rounded-full">
            <div className="absolute left-0 top-0 h-full bg-orange-400 animate-underline w-0" />
          </div>
        </div>

        {/* Right */}
        <div className="text-right flex justify-end items-center gap-4">
          <a
            href="mailto:kp@avanienterprises.in"
            className="text-xl hover:text-orange-400 transition duration-300"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl hover:text-orange-400 transition duration-300"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Bottom - Made with love line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mt-8 text-sm text-white/70"
      >
        <motion.p
          onMouseEnter={() => setShowBigHeart(true)}
          onMouseLeave={() => setShowBigHeart(false)}
          whileHover={{
            scale: 1.05,
            textShadow: '0px 0px 8px rgba(255, 255, 255, 0.7)',
          }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="inline-block cursor-pointer"
        >
          Made with{' '}
          <span className="inline-block animate-heartbeat text-red-500 text-lg">
            ❤️
          </span>{' '}
          by <span className="text-orange-400 font-semibold">Soham</span>
        </motion.p>
      </motion.div>

      {/* Custom styles */}
      <style>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        .animate-heartbeat {
          animation: heartbeat 1.8s infinite ease-in-out;
        }

        @keyframes underline {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-underline {
          animation: underline 2s ease-out forwards;
        }
      `}</style>
    </motion.footer>
  );
}
