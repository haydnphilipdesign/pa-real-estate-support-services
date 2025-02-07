import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { id: 1, value: '30+', label: 'Years of Excellence', description: 'Decades of dedicated service in real estate' },
  { id: 2, value: '2,000+', label: 'Successful Transactions', description: 'Expert coordination from contract to closing' },
  { id: 3, value: '10,000+', label: 'Agent Hours Saved', description: 'Allowing agents to focus on growing their business' },
  { id: 4, value: '$500M+', label: 'Transaction Volume', description: 'Trusted with significant real estate portfolios' },
];

const Statistics: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Proven Excellence in Numbers
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            A track record of success built on dedication, expertise, and unwavering commitment to excellence
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <motion.div 
              key={stat.id}
              className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm shadow-xl hover:bg-white/15 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.id * 0.1 }}
            >
              <div className="text-5xl font-bold mb-3 text-white">{stat.value}</div>
              <div className="text-lg font-semibold text-brand-gold mb-2">{stat.label}</div>
              <div className="text-sm text-gray-300">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
