import React, { useState } from 'react';
import { motion } from 'framer-motion';

const IntakeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    role: '',
    // Add other form fields as needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Form submission logic here
      console.log('Form submitted', formData);
    } catch (error) {
      console.error('Form submission error', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form fields will go here */}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntakeForm;
