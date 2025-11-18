
import React from 'react';
import { motion } from 'framer-motion';
import { PRIMARY_COLOR } from '../../config';

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const dotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: ["0%", "100%", "0%"],
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const Loader: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <motion.div
            className="flex space-x-2"
            variants={containerVariants}
            initial="initial"
            animate="animate"
        >
            {/* FIX: Use `background` instead of `backgroundColor` to avoid MotionStyle type error. */}
            <motion.span className="block w-4 h-4 rounded-full" style={{ background: PRIMARY_COLOR }} variants={dotVariants} />
            {/* FIX: Use `background` instead of `backgroundColor` to avoid MotionStyle type error. */}
            <motion.span className="block w-4 h-4 rounded-full" style={{ background: PRIMARY_COLOR }} variants={dotVariants} />
            {/* FIX: Use `background` instead of `backgroundColor` to avoid MotionStyle type error. */}
            <motion.span className="block w-4 h-4 rounded-full" style={{ background: PRIMARY_COLOR }} variants={dotVariants} />
        </motion.div>
        <p className="text-lg font-medium text-gray-300">{text}</p>
    </div>
  );
};

export default Loader;
