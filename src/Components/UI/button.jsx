import React from 'react';

const Button = ({ onClick, children, className = '', disabled = false }) => {
  return (
    <button 
      onClick={onClick} 
      className={`inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-black/80 h-10 px-4 py-2 ${className}`} 
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
