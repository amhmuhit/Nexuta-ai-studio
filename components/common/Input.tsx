
import React from 'react';
import { PRIMARY_COLOR } from '../../config';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="relative w-full">
      {label && <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>}
      <input
        id={id}
        className={`w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300`}
        style={{ '--tw-ring-color': PRIMARY_COLOR } as React.CSSProperties}
        {...props}
      />
    </div>
  );
};

export default Input;
