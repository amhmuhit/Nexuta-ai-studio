
import React from 'react';
// FIX: Import HTMLMotionProps to correctly type the button component for framer-motion.
import { motion, HTMLMotionProps } from 'framer-motion';
import { PRIMARY_COLOR } from '../../config';

// FIX: Extend HTMLMotionProps<'button'> instead of React.ButtonHTMLAttributes to ensure compatibility with motion.button.
interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, icon, variant = 'primary', isLoading = false, ...props }) => {
  const primaryClasses = `bg-purple-600 text-white hover:bg-purple-700`;
  const secondaryClasses = 'bg-gray-700 text-gray-200 hover:bg-gray-600';

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: `0px 0px 12px ${PRIMARY_COLOR}` }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative flex items-center justify-center px-6 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${variant === 'primary' ? primaryClasses : secondaryClasses}`}
      {...props}
      disabled={isLoading || props.disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        </div>
      ) : (
        <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
