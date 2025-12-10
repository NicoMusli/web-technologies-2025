import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar userType="visitor" />

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-32 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-pulse-slow"></div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
            We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">ACSA Print</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Where traditional craftsmanship meets modern innovation. We bring your vision to life with precision, passion, and excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {/* Mission Section */}
        <section className="relative">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-10">Our Mission</h2>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              <p className="text-2xl text-gray-700 mb-8 leading-relaxed font-medium">
                "To provide exceptional printing services that bring our customers' ideas to life."
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                We believe in combining traditional craftsmanship with cutting-edge technology to
                deliver products that exceed expectations. Our commitment is to transform your vision into reality with precision, quality,
                and dedication.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Experts</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">The passionate people behind every perfect print.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: 'Nicola', role: 'Founder & CEO', icon: '👨‍💼', color: 'bg-blue-100 text-blue-600', desc: 'Visionary leader driving innovation and excellence.' },
              { name: 'Amelie', role: 'Creative Director', icon: '👩‍🎨', color: 'bg-purple-100 text-purple-600', desc: 'Bringing artistic flair and creativity to every project.' },
              { name: 'Reda', role: 'Production Manager', icon: '⚙️', color: 'bg-orange-100 text-orange-600', desc: 'Ensuring flawless execution and operational efficiency.' },
              { name: 'Alberto', role: 'Technical Lead', icon: '💻', color: 'bg-indigo-100 text-indigo-600', desc: 'Mastering the technology behind our premium prints.' },
              { name: 'Davide', role: 'Customer Success', icon: '🌟', color: 'bg-green-100 text-green-600', desc: 'Dedicated to ensuring your complete satisfaction.' },
              { name: 'Mark', role: 'Head of Logistics', icon: '📦', color: 'bg-teal-100 text-teal-600', desc: 'Ensuring your orders arrive safely and on time.' }
            ].map((member, index) => (
              <div key={index} className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 text-center relative overflow-hidden w-full sm:w-80">
                <div className={`w-24 h-24 ${member.color} rounded-full flex items-center justify-center text-4xl mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  {member.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-16 text-center">Trusted by Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { text: "Outstanding quality and service! ACSA Print delivered exactly what we needed for our marketing campaign. Highly recommended!", author: "John Smith", role: "Marketing Director" },
                { text: "Fast turnaround and excellent quality. The team was professional and helpful throughout the entire process.", author: "Maria Garcia", role: "Business Owner" },
                { text: "We've been using ACSA Print for years. They never disappoint! Quality prints, competitive prices, and amazing customer service.", author: "David Lee", role: "Event Coordinator" },
                { text: "The best printing service I've ever used. Professional, reliable, and always delivers on time. Five stars!", author: "Sarah Johnson", role: "Designer" }
              ].map((review, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="flex text-yellow-400 mb-6 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    ))}
                  </div>
                  <p className="text-gray-200 text-lg italic mb-8 leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{review.author}</p>
                      <p className="text-blue-300 text-sm">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;
