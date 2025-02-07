import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonialData = [
  {
    id: 1,
    name: 'Bob Hay',
    role: 'Broker at Keller Williams, Former President of the Pennsylvania Association of Realtors (2008)',
    content: `Debbie has been my transaction coordinator since 2012, and before that, she worked with me as my assistant starting in 2006. I can't say enough good things about her! She is incredibly organized, staying on top of every step and detail to ensure smooth transactions every time.

Debbie's professionalism and pleasant demeanor shine through, even in the most difficult situations, making her an essential part of my team. She is, without a doubt, the best!`,
    image: '/bob-hay.jpg'
  },
  {
    id: 2,
    name: 'Cassie Transue',
    role: 'Keller Williams Realtor',
    content: `I have had the pleasure of working alongside Debbie for the past six years. During this time, she has consistently demonstrated outstanding dedication and skill as a transaction coordinator.

Debbie's meticulous approach to managing details in a fast-paced environment is unmatched and has been instrumental in the growth of my businesses. Running multiple businesses, I rely heavily on precise coordination, and Debbie plays a critical role in ensuring our success.

Her experience, judgment, and industry knowledge make her an invaluable team member. For anyone seeking a transaction coordinator with exceptional professionalism and commitment, I highly recommend Debbie.`,
    image: '/cassie-transue.jpg'
  },
  {
    id: 3,
    name: 'Robert Hoffman',
    role: 'Keller Williams Realtor',
    content: `Working with Debbie feels effortless. She's always on top of things, and her communication and customer service are easily 5-star.

Debbie handles challenges with grace, keeping everything on track without getting caught up in emotions. My clients constantly praise her, which speaks volumes about her professionalism and dedication.

With her wealth of experience, Debbie is much more than a transaction coordinator—she's a trusted advisor and an important part of my business success.`,
    image: '/robert-hoffman.jpg'
  },
  {
    id: 4,
    name: 'Axel Struckmeyer',
    role: 'Keller Williams Realtor',
    content: `I have used Debbie O'Brien's Transaction Coordinator services for around 13-14 years. When I was new to real estate, I was also managing another business, and having Debbie's help was invaluable.

She's always been incredibly reliable, detail-oriented, and proactive in managing transactions. Her professionalism and expertise have been a huge asset to my business, allowing me to focus on serving my clients while knowing the transaction details are in capable hands.`,
    image: '/axel-struckmeyer.jpg'
  },
  {
    id: 5,
    name: 'Jess Keller',
    role: 'Keller Williams Realtor',
    content: `Deb and I have been working together for over six years now, and I wouldn't have it any other way! She is an exceptional team player and has consistently exceeded my expectations on so many levels.

I'm grateful for the opportunity to work hand-in-hand with Debbie. She's a true professional who excels in her role.`,
    image: '/jess-keller.jpg'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonialData.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialData.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 overflow-hidden">
      <div className="text-center space-y-4 mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue font-serif">
          Client Testimonials
        </h2>
        <p className="text-lg md:text-xl text-gray-600 italic max-w-2xl mx-auto px-4">
          Hear from the professionals who trust us with their transaction coordination
        </p>
      </div>

      <div className="relative">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex flex-col items-center space-y-6 md:space-y-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue via-brand-gold to-brand-blue rounded-full opacity-75 blur"></div>
              <img
                src={testimonialData[currentIndex].image}
                alt={testimonialData[currentIndex].name}
                className="relative w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <p className="text-base md:text-lg text-gray-700 text-center italic leading-relaxed">
                "{testimonialData[currentIndex].content}"
              </p>
              <div className="text-center">
                <h3 className="font-semibold text-lg md:text-xl text-brand-blue">
                  {testimonialData[currentIndex].name}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {testimonialData[currentIndex].role}
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          onClick={handlePrevious}
          className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-4 lg:-left-12 p-2 md:p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-brand-blue" />
        </motion.button>

        <motion.button
          onClick={handleNext}
          className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-4 lg:-right-12 p-2 md:p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChevronRight className="w-4 h-4 md:w-6 md:h-6 text-brand-blue" />
        </motion.button>
      </div>

      <div className="flex justify-center mt-6 md:mt-8 space-x-2">
        {testimonialData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-brand-blue scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
