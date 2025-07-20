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
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;