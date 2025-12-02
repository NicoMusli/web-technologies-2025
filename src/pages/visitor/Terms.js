import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar userType="visitor" />

      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

          <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the ACSA Print website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Printing Services</h2>
              <p>
                We strive to provide high-quality printing services. However, please note:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Colors may vary slightly from what you see on your screen due to different display calibrations.</li>
                <li>You are responsible for ensuring the quality and resolution of uploaded designs.</li>
                <li>We reserve the right to refuse to print content that is illegal, offensive, or violates intellectual property rights.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Orders and Payments</h2>
              <p>
                All orders are subject to acceptance and availability. Prices are subject to change without notice. Payment is required at the time of ordering unless otherwise agreed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Shipping and Delivery</h2>
              <p>
                Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs processing. Risk of loss passes to you upon delivery to the carrier.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h2>
              <p>
                Due to the custom nature of our products, we generally do not accept returns unless the product is defective or damaged upon arrival. Please contact us within 48 hours of receiving your order if there are any issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p>
                You retain ownership of the designs you upload. By uploading content, you grant us a license to use, reproduce, and modify it solely for the purpose of fulfilling your order.
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

export default Terms;
