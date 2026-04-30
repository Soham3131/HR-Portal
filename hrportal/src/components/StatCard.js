// src/components/dashboard/StatCard.js
import React from 'react';
import Card from '../components/Card';

const StatCard = ({ title, value, icon, colorClass = 'text-blue-500' }) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`text-4xl ${colorClass}`}>
          {icon}
        </div>
        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-500 truncate uppercase tracking-wider">{title}</p>
          <p className="text-xl sm:text-2xl font-black text-[#433020]">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;