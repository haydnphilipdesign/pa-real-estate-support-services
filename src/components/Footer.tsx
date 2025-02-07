import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="col-span-1">
            <Link to="/" className="block mb-4">
              <h3 className="text-xl font-bold text-brand-blue">
                PA Real Estate Support Services
              </h3>
            </Link>
            <p className="text-gray-600 text-sm md:text-base">
              Your trusted partner in reliable transaction management, serving the Pocono Mountains area.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">Quick Links</h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-blue transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-brand-blue transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/work-with-me" className="text-gray-600 hover:text-brand-blue transition-colors duration-300">
                  Work With Me
                </Link>
              </li>
              <li>
                <Link to="/agent-portal" className="text-gray-600 hover:text-brand-blue transition-colors duration-300">
                  Agent Portal
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">Legal</h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-brand-blue transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-brand-blue transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-6">Contact</h3>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <a
                  href="tel:+5705884637"
                  className="flex items-center text-sm md:text-base text-gray-600 hover:text-brand-blue transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-brand-gold" />
                  (570) 588-4637
                </a>
              </li>
              <li>
                <a
                  href="mailto:debbie@parealestatesupport.com"
                  className="flex items-center text-sm md:text-base text-gray-600 hover:text-brand-blue transition-colors duration-300 whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-brand-gold flex-shrink-0" />
                  debbie@parealestatesupport.com
                </a>
              </li>
              <li>
                <div className="flex items-start text-sm md:text-base text-gray-600">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 text-brand-gold flex-shrink-0 mt-1" />
                  <span>Pocono Mountains, PA</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 text-center"
        >
          <p className="text-sm md:text-base text-gray-600">
            &copy; {new Date().getFullYear()} PA Real Estate Support Services. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
