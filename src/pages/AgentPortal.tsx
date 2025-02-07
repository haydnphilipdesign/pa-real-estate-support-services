import React, { useState } from 'react';
import useScrollToTop from '../hooks/useScrollToTop';
import { TransactionForm } from '../components/TransactionForm/TransactionForm';
import { TransactionFormProvider } from '../context/TransactionFormContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, Clock, X } from 'lucide-react';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const AgentPortal: React.FC = () => {
  useScrollToTop();
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      {/* Full-screen form overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white overflow-hidden"
          >
            <div className="absolute top-4 right-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowForm(false)}
                className="rounded-full h-10 w-10 bg-white shadow-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <TransactionFormProvider>
              <TransactionForm onClose={() => setShowForm(false)} />
            </TransactionFormProvider>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col">
        <div className="flex-grow bg-gradient-to-b from-[#1e3a8a] to-[#1e3a8a]/90">
          {/* Enhanced Header with Visual Elements */}
          <div className="relative pt-20 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 relative">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Transaction Intake Form
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Streamline your transaction process with our comprehensive digital form
                </p>

                {/* Launch Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => setShowForm(true)}
                    className="mt-8 px-8 py-6 text-lg bg-white text-[#1e3a8a] hover:bg-gray-100 transition-colors rounded-full shadow-lg"
                  >
                    Launch Transaction Form
                  </Button>
                </motion.div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                  {[
                    {
                      icon: FileText,
                      title: "Smart Forms",
                      description: "Intelligent form validation and auto-save functionality"
                    },
                    {
                      icon: Shield,
                      title: "Secure",
                      description: "Your data is encrypted and safely stored"
                    },
                    {
                      icon: Clock,
                      title: "Time-Saving",
                      description: "Complete transactions faster with guided process"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex flex-col items-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                    >
                      <feature.icon className="w-8 h-8 text-[#ffd7ba] mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 text-sm text-center">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default AgentPortal;
