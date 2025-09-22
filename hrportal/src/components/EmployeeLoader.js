import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

const EmployeeLoader = ({ name, action }) => {
  const [quote, setQuote] = useState("");
  const [index, setIndex] = useState(0);

  const funnyQuotes = [
    `✨ Wait "${name}", the system is aligning the stars just for you ✨`,
    `☕ Hold tight "${name}", our coffee-powered servers are waking up...`,
    `📜 Almost there "${name}", your attendance is being etched in history!`,
    `🐹 Patience "${name}", the office hamsters are running faster...`,
    `🏅 One sec "${name}", polishing your attendance badge...`,
    `🛰️ Relax "${name}", satellites are locking onto your vibe...`,
    `🧙 Don’t move "${name}", a wizard is logging your entry...`,
    `🔮 Loading magic for you "${name}", please stand by...`,
    `🏆 Hang on "${name}", saving your spot in the hall of legends...`,
    `🚀 Wait "${name}", the system is double-checking your awesomeness!`,
    `🌈 "${name}", good vibes are charging up your dashboard...`,
    `🔥 "${name}", we’re firing up the engines for your success...`,
    `💎 "${name}", polishing your diamond-studded record...`,
    `🎶 Hold on "${name}", background music is tuning just for you...`,
    `🌍 "${name}", connecting you with the universe’s attendance grid...`,
    `⚡ "${name}", sparking up today’s energy for your log...`,
    `🎉 Almost there "${name}", confetti is being prepared...`,
    `🦸‍♂️ "${name}", your superhero attendance cape is loading...`,
    `📡 "${name}", syncing with cosmic wifi...`,
    `💡 "${name}", bright ideas are being logged with your check-in...`,
  ];

  // Rotate quotes every 3.5s
  useEffect(() => {
    setQuote(funnyQuotes[0]);
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % funnyQuotes.length;
        setQuote(funnyQuotes[next]);
        return next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [name]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      {/* Card */}
      <div className="relative bg-white/90 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-[90%] sm:w-[420px] text-center border border-white/20 overflow-hidden">
        
        {/* Animated Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 opacity-40 blur-3xl animate-gradientMove"></div>
        
        {/* Spinner */}
        <div className="relative flex justify-center">
          <Spinner className="w-14 h-14 text-indigo-600 spinSlow" />
        </div>

        {/* Progress Bar */}
        <div className="relative mt-4 h-2 w-3/4 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 animate-progressBar"></div>
        </div>

        {/* Title */}
        <div className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide drop-shadow-md fadeIn">
          {action === "checkin" ? "✨ Checking In..." : "🌙 Checking Out..."}
        </div>

        {/* Quote */}
        {quote && (
          <div className="mt-4 text-lg sm:text-xl font-semibold italic bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 text-transparent bg-clip-text fadeIn quoteText">
            {quote}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        .fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
        .spinSlow {
          animation: spin 3s linear infinite;
        }
        .quoteText {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 8s ease infinite;
        }
        @keyframes progressBar {
          0% { left: -50%; width: 50%; }
          50% { left: 25%; width: 60%; }
          100% { left: 100%; width: 50%; }
        }
        .animate-progressBar {
          animation: progressBar 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmployeeLoader;
