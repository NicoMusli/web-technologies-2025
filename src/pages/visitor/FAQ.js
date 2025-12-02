import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full py-6 text-left flex justify-between items-center focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
          {question}
        </span>
        <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
          }`}
      >
        <p className="text-gray-600 leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What file formats do you accept?",
      answer: "We accept most common file formats including PDF, AI, PSD, JPG, and PNG. For the best print quality, we recommend using high-resolution PDF files with CMYK color mode and at least 300 DPI."
    },
    {
      question: "How long will it take to receive my order?",
      answer: "Production times vary by product, typically ranging from 2-5 business days. Shipping time depends on your location and the shipping method selected. You can track your order status in your account dashboard."
    },
    {
      question: "Do you offer design services?",
      answer: "Yes! If you don't have a design ready, our professional design team can help create one for you. Please contact us for a quote on design services."
    },
    {
      question: "Can I cancel or change my order?",
      answer: "You can request changes or cancellation through your account dashboard if the order hasn't entered the production phase yet. Once production has started, we cannot guarantee changes or cancellations."
    },
    {
      question: "What is your return policy?",
      answer: "Since our products are custom-made, we cannot accept returns for change of mind. However, if there is a printing error or damage during shipping, please contact us within 48 hours and we will reprint your order or offer a refund."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we primarily ship within Morocco. For international shipping inquiries, please contact our support team directly to discuss options and rates."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our printing services and ordering process.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?{' '}
            <a href="/contact" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
