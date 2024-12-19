import React from 'react';

const Button = ({ text, onClick, className }) => {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
