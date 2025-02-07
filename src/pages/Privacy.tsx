import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '../components/PageHero';
import { Shield, Database, Lock, FileText, Users, Bell, HelpCircle } from 'lucide-react';
import useScrollToTop from '../hooks/useScrollToTop';

const sections = [
  {
    title: "Information Collection and Use",
    icon: Database,
    content: "I collect information that you voluntarily provide when using my services, including:",
    items: [
      "Contact information (name, email, phone number)",
      "Transaction-related information",
      "Communication records and correspondence",
      "Business and professional details"
    ]
  },
  {
    title: "Use of Information",
    icon: FileText,
    content: "The information collected is used to:",
    items: [
      "Provide and improve transaction coordination services",
      "Communicate about your transactions and services",
      "Maintain accurate records",
      "Comply with legal obligations"
    ]
  },
  {
    title: "Data Security",
    icon: Shield,
    content: "I implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. This includes:",
    items: [
      "Secure data storage systems",
      "Encrypted communication channels",
      "Regular security assessments",
      "Limited access to personal information"
    ]
  },
  {
    title: "Information Sharing",
    icon: Users,
    content: "Your information is shared only with:",
    items: [
      "Authorized transaction parties",
      "Required service providers",
      "Legal and regulatory authorities when required",
      "With your explicit consent"
    ]
  },
  {
    title: "Your Rights",
    icon: Lock,
    content: "You have the right to:",
    items: [
      "Access your personal information",
      "Request corrections to your data",
      "Request deletion of your information",
      "Opt-out of certain data uses"
    ]
  },
  {
    title: "Updates to Privacy Policy",
    icon: Bell,
    content: "This privacy policy may be updated periodically. Changes will be communicated through:",
    items: [
      "Direct notification to clients",
      "Website announcements",
      "Email communications",
      "Service updates"
    ]
  },
  {
    title: "Contact Information",
    icon: HelpCircle,
    content: "For privacy-related inquiries or concerns:",
    items: [
      "Email: privacy@parealestatesupport.com",
      "Phone: (570) 588-4637",
      "Response within 24-48 hours",
      "Dedicated privacy support"
    ]
  }
];

const Privacy: React.FC = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageHero
        title="Privacy Policy"
        subtitle="How we protect and handle your information"
        backgroundImage="/andrew-neel-cckf4TsHAuw-unsplash.jpg"
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

export default Privacy;
