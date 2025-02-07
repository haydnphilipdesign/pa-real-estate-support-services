import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, Calendar, CheckCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import FAQ from '../components/FAQ';
import WorkTogether from '../components/WorkTogether';
import emailjs from '@emailjs/browser';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    description: "Let's discuss your needs directly",
    action: 'Call (570) 588-4637',
    link: 'tel:+5705884637'
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Send me your questions',
    action: 'debbie@parealestatesupport.com',
    link: 'mailto:debbie@parealestatesupport.com'
  },
  {
    icon: Calendar,
    title: 'Schedule',
    description: 'Book a consultation',
    action: 'Schedule a Call',
    link: 'https://outlook.office365.com/owa/calendar/PARealEstateSupportServices@NETORG4562290.onmicrosoft.com/bookings/'
  }
];

const WorkWithMe: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    try {
      setFormStatus('loading');
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setFormStatus('success');
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Email send error:', error);
      setErrorMessage('Failed to send message. Please try again or contact us directly.');
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageHero
        title="Work With Me"
        subtitle="Let's streamline your real estate transactions together"
        backgroundImage="/gabrielle-henderson-HJckKnwCXxQ-unsplash.jpg"
        height="large"
        overlay="gradient"
        overlayOpacity={0.6}
      />

      {/* How We Work Together */}
      <WorkTogether />

      {/* Contact Methods */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to take your real estate business to the next level? Let's discuss how I can help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold to-brand-blue rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-300" />
                <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center mb-6">
                      <method.icon className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {method.description}
                    </p>
                    {method.link.startsWith('http') ? (
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:text-brand-gold transition-colors duration-300 font-semibold inline-flex items-center gap-2"
                      >
                        <span>{method.action}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        to={method.link}
                        className="text-brand-blue hover:text-brand-gold transition-colors duration-300 font-semibold inline-flex items-center gap-2"
                      >
                        <span>{method.action}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden bg-brand-blue">
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Let's work together to streamline your real estate transactions and grow your business
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Get Started Today</h3>
              {formStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                  <p className="text-gray-600">We'll get back to you as soon as possible.</p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="from_firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        id="from_firstName"
                        name="from_firstName"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label htmlFor="from_lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="from_lastName"
                        name="from_lastName"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="from_email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="from_email"
                      name="from_email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue resize-none"
                    ></textarea>
                  </div>
                  {formStatus === 'error' && (
                    <div className="text-red-500 text-sm">{errorMessage}</div>
                  )}
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full bg-brand-blue text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-blue/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'loading' ? (
                      'Sending...'
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkWithMe;
