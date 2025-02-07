import React from 'react';
import PageHero from '../components/PageHero';

const AgentPortal: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Agent Portal" 
        subtitle="Access your transaction tools and resources"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="relative w-full">
            <style>
              {`
                iframe {
                  height: 2800px !important;
                }
                /* Hide Google Forms footer */
                iframe[src*="google.com/forms"] {
                  margin-bottom: -70px;
                }
              `}
            </style>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSeGqH73flaQ_iTW_OzZchrwWMnUUul8fgUjEHSTKeXh845BgQ/viewform?embedded=true"
              width="100%"
              height="2800"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full"
            >
              Loading form...
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPortal; 