import React from 'react';

const Card = ({ children, className = '', onClick }) => {
  const clickableClass = onClick ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg p-6 transition-all duration-300 border border-secondary/30 ${clickableClass} ${className}`}
      style={{
        boxShadow: '0 4px 6px -1px rgba(124, 185, 146, 0.1), 0 2px 4px -1px rgba(124, 185, 146, 0.06)'
      }}
    >
      {children}
    </div>
  );
};

export default Card;
