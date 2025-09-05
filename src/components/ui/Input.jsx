import React from 'react';

function Input({ 
  className = '', 
  type = 'text',
  ...props 
}) {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent';
  
  return (
    <input
      type={type}
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}

export default Input;