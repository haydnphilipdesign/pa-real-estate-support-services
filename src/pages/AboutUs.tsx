import React from "react";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProfileSection from '../components/ProfileSection';
import { ArrowRight, Calendar, CheckCircle2, Target, Presentation, Users } from 'lucide-react';
import useScrollToTop from "../hooks/useScrollToTop";
import Timeline from "../components/Timeline";
import PageHero from '../components/PageHero';
// Enhanced Core Value Component
const CoreValue = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ComponentType<any> }) => (
  <motion.div
    className="group relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-blue/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300 blur opacity-0 group-hover:opacity-100"></div>
    <div className="relative bg-white rounded-xl shadow-lg p-8 h-full transform group-hover:-translate-y-1 transition-all duration-300">
      <div className="bg-gradient-to-br from-brand-gold/10 to-brand-blue/10 p-4 rounded-xl w-fit mb-6">
        <Icon className="w-8 h-8 text-brand-blue" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const AboutMe: React.FC = () => {
  useScrollToTop();
  
  return (
    <div className="bg-white">
      <PageHero
        title="Meet Your Transaction Expert"
        subtitle="Dedicated support for your real estate business"
        backgroundImage="/notebooks.jpg"
        height="large"
        overlay="gradient"
        overlayOpacity={0.7}
      />

      {/* Profile Section */}
      <ProfileSection />

      {/* Journey Section */}
      <section className="py-24 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">Professional Journey</h2>
            <p className="text-white/90 max-w-3xl mx-auto text-xl font-light">
              A path defined by continuous growth, dedication to excellence, and a 
              commitment to revolutionizing real estate transactions.
            </p>
          </motion.div>

          <div className="space-y-20 max-w-5xl mx-auto">
            <Timeline />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-brand-blue to-brand-gold bg-clip-text text-transparent">
              My Core Values
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              These principles guide every interaction and transaction, ensuring 
              consistent excellence in service delivery.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: CheckCircle2,
                title: "Integrity",
                description: "Maintaining the highest standards of honesty and ethical conduct in every transaction. I believe in complete transparency, clear communication, and always acting in the best interest of my clients. Every decision and action is guided by strong moral principles."
              },
              {
                icon: Target,
                title: "Excellence",
                description: "Striving for perfection in every detail, ensuring smooth and successful closings. I continuously update my knowledge and skills to provide the best possible service. My commitment to excellence means no detail is too small and no challenge is too big."
              },
              {
                icon: Users,
                title: "Client Focus",
                description: "Putting clients' needs first, providing personalized attention and support. I understand that each transaction is unique and requires individualized attention. My goal is to exceed expectations by anticipating needs and proactively addressing concerns."
              }
            ].map((value, index) => (
              <CoreValue key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.03)_100%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl font-bold mb-6 text-white">Ready to Work Together?</h2>
            <p className="text-white/90 mb-12 text-xl font-light">
              Let's discuss how my experience and dedication can help streamline your 
              real estate transactions and ensure your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/workwithme"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-white px-10 py-5 rounded-xl font-semibold hover:from-brand-gold/90 hover:to-brand-gold transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-lg">Schedule a Consultation</span>
                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-500"
              >
                <span className="text-lg">Get in Touch</span>
                <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutMe;