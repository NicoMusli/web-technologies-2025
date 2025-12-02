import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Billing and shipping details</li>
                <li>Order history and preferences</li>
                <li>Files and designs you upload for printing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Process your orders and payments</li>
                <li>Communicate with you about your orders and our services</li>
                <li>Improve our website and customer service</li>
                <li>Send you marketing communications (which you can opt out of)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your payment information is processed securely through our payment providers and is not stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You can manage your account details through your profile settings or contact us for assistance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@acsaprint.com
                <br />
                Address: Résidence Ben Fateh, Rue Loubnane, Marrakech 40000, Morocco
              </p>
            </section>

            <div className="pt-8 border-t border-gray-100 text-sm text-gray-500">
              Last updated: November 24, 2025
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
