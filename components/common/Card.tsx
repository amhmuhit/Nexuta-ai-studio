
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
