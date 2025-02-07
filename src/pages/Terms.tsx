import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import { Shield, Users, FileText, Clock, AlertCircle, DollarSign } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const sections = [
  {
    title: "Service Agreement",
    icon: Shield,
    content: "By engaging my services, you agree to these terms and conditions. I provide professional transaction coordination services for real estate professionals.",
    items: []
  },
  {
    title: "Scope of Services",
    icon: FileText,
    content: "My services include:",
    items: [
      "Transaction coordination from contract to closing",
      "Document management and organization",
      "Timeline tracking and deadline management",
      "Communication coordination between parties",
      "Compliance review and verification"
    ]
  },
  {
    title: "Client Responsibilities",
    icon: Users,
    content: "As a client, you agree to:",
    items: [
      "Provide accurate and timely information",
      "Respond to requests in a timely manner",
      "Review and approve documents as needed",
      "Maintain professional communication"
    ]
  },
  {
    title: "Confidentiality",
    icon: Shield,
    content: "I maintain strict confidentiality of all client information and transaction details. This includes:",
    items: [
      "Personal and business information",
      "Transaction documents and details",
      "Financial information",
      "Communication records"
    ]
  },
  {
    title: "Payment Terms",
    icon: DollarSign,
    content: "Payment details:",
    items: [
      "Fees are based on services provided",
      "Payment is due upon receipt of invoice",
      "Accepted payment methods will be specified",
      "Late payments may incur additional fees"
    ]
  },
  {
    title: "Termination",
    icon: Clock,
    content: "Either party may terminate services with written notice. Upon termination:",
    items: [
      "All pending work will be completed or transferred",
      "Final payments will be processed",
      "All relevant documents will be provided"
    ]
  },
  {
    title: "Limitation of Liability",
    icon: AlertCircle,
    content: "While I strive for excellence in all services, I am not liable for:",
    items: [
      "Third-party actions or delays",
      "Circumstances beyond reasonable control",
      "Indirect or consequential damages"
    ]
  }
];

const Terms: React.FC = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageHero
        title="Terms of Service"
        subtitle="Understanding our working relationship"
        backgroundImage="/aaron-burden-xG8IQMqMITM-unsplash.jpg"
        height="large"
        overlay="gradient"
        overlayOpacity={0.7}
      />

      <section className="py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.02)_100%)]" />
          <div className="absolute inset-0 bg-grid-gray-500/[0.02] bg-[length:32px_32px]" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-gold/20 to-brand-blue/20 rounded-full flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-brand-gold" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  {section.content}
                </p>
                {section.items.length > 0 && (
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500 text-center mt-8"
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
