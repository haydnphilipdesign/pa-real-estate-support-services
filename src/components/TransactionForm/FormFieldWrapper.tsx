import React from 'react';
import { motion } from 'framer-motion';

interface FormFieldWrapperProps {
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  children,
  className = '',
  layoutId
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  );
}; 