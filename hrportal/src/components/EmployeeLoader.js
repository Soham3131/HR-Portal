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
    <div className="flex flex-col items-center justify-center p-10 bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl text-center max-w-lg mx-auto fadeIn">
      {/* Glass Card */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full fadeInUp">
        
        {/* Spinner */}
        <div className="flex justify-center">
          <Spinner className="w-16 h-16 text-indigo-600 spinSlow" />
        </div>

        {/* Action Title */}
        <div className="mt-6 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-wide drop-shadow-lg bounce">
          {action === "checkin" ? "✨ Checking In..." : "🌙 Checking Out..."}
        </div>

        {/* Funny Rotating Quote */}
        {quote && (
          <div className="mt-6 text-lg sm:text-xl font-semibold italic bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 text-transparent bg-clip-text fadeIn quoteText">
            {quote}
          </div>
        )}

        {/* User Name Highlight */}
        <div className="mt-8 text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 tracking-wider pulse">
          🌟 {name} 🌟
        </div>
      </div>

      {/* Inline CSS Animations */}
      <style>{`
        .fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
        .fadeInUp {
          animation: fadeInUp 1s ease-in-out;
        }
        .pulse {
          animation: pulse 2s infinite;
        }
        .bounce {
          animation: bounce 1.8s infinite;
        }
        .spinSlow {
          animation: spin 3s linear infinite;
        }
        .quoteText {
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EmployeeLoader;
