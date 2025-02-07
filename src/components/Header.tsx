import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '/logo-flat.png';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/agent-portal', label: 'Agent Portal' },
  ];

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 50,
        damping: 15,
        mass: 1,
        delay: 0.2
      } 
    },
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const menuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-brand-blue'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3
              }
            }}
          >
            <Link 
              to="/" 
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-brand-gold rounded-lg opacity-0 group-hover:opacity-75 blur transition duration-300" />
              <img 
                src={Logo} 
                alt="PA Real Estate Support Services" 
                className="h-12 relative"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`relative font-medium group ${
                    location.pathname === item.path 
                      ? scrolled ? 'text-brand-blue' : 'text-white'
                      : scrolled ? 'text-gray-600 hover:text-brand-blue' : 'text-white hover:text-brand-gold'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-blue to-brand-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                    location.pathname === item.path ? 'scale-x-100' : ''
                  }`} />
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.7
                }
              }}
            >
              <Link
                to="/work-with-me"
                className={`relative inline-flex items-center px-6 py-2 overflow-hidden font-medium transition-all rounded-lg group ${
                  scrolled 
                    ? 'bg-brand-blue text-white hover:bg-gradient-to-r hover:from-brand-blue hover:to-brand-gold'
                    : 'bg-white text-brand-blue hover:bg-brand-gold hover:text-white'
                }`}
              >
                <span className="relative">Work With Me</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden relative z-50 p-2 transition-colors ${
              scrolled || isOpen ? 'text-gray-600 hover:text-brand-blue' : 'text-white hover:text-brand-gold'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 md:hidden bg-white/95 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 space-y-8 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-sm"
              >
                <img 
                  src={Logo} 
                  alt="PA Real Estate Support Services" 
                  className="h-16 mx-auto mb-12"
                />
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`block text-center py-4 text-xl font-medium transition-colors ${
                        location.pathname === item.path 
                          ? 'text-brand-blue' 
                          : 'text-gray-600 hover:text-brand-blue'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Link
                    to="/work-with-me"
                    className="block w-full text-center px-8 py-4 bg-brand-blue text-white rounded-lg hover:bg-brand-gold transition-colors"
                  >
                    Work With Me
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;