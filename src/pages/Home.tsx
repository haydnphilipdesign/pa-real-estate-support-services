"use client";
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Preloader } from '../components/Preloader';
import AboutSection from '../components/AboutSection';
import ServicesOverview from '../components/ServicesOverview';
import Statistics from '../components/Statistics';
import ContactSection from '../components/ContactSection';
import Testimonials from '../components/Testimonials';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { RevealSection } from '../components/GlobalAnimations';
import OptimizedImage from '../components/OptimizedImage';
import useScrollToTop from "../hooks/useScrollToTop";

// Define page and section variants
const pageVariants: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

const sectionVariants: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const Home: React.FC = () => {
  useScrollToTop();
  const [isLoading, setIsLoading] = React.useState(() => {
    const hasVisitedHome = sessionStorage.getItem('hasVisitedHome');
    return !hasVisitedHome;
  });

  React.useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasVisitedHome', 'true');
      }, 1000);
    }
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Preloader key="preloader" />
      ) : (
        <motion.div
          className="min-h-screen"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >                                                                                                                                                                                                                                                               
          {/* Hero section with parallax effect */}
          <Hero />

          {/* Other sections with scroll-triggered animations */}
          <motion.div
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="animate"
            initial="initial"
          >
            <AboutSection />
          </motion.div>

          <motion.div
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="animate"
            initial="initial"
          >
            <ServicesOverview />
          </motion.div>

          <motion.div
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="animate"
            initial="initial"
          >
            <Testimonials />
          </motion.div>

          <motion.div
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="animate"
            initial="initial"
          >
            <Statistics />
          </motion.div>

          <motion.div
            variants={sectionVariants}
            viewport={{ once: true, amount: 0.3 }}
            whileInView="animate"
            initial="initial"
          >
            <ContactSection />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Home;
