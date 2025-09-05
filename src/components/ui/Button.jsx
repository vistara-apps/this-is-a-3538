import React from 'react';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    secondary: 'bg-surface text-primary border border-gray-300 hover:bg-gray-50 focus:ring-accent',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-accent',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-accent'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;