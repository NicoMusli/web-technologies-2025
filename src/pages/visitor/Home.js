import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { ajaxRequest } from '../../utils/ajax';
import OfferCarousel from '../../components/OfferCarousel';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('Special Offers');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, settingsResponse] = await Promise.all([
          new Promise((resolve, reject) => ajaxRequest('GET', '/api/products', null, (err, data) => err ? reject(err) : resolve(data))),
          new Promise((resolve, reject) => ajaxRequest('GET', '/api/settings', null, (err, data) => err ? reject(err) : resolve(data)))
        ]);

        const taxRate = settingsResponse ? settingsResponse.taxRate : 0;
        const data = productsResponse;

        const saleProducts = data.filter(p => p.onSale);

        let productsToShow;
        if (saleProducts.length > 0) {
          productsToShow = saleProducts;
          setSectionTitle('Special Offers');
        } else {
          productsToShow = data.sort(() => 0.5 - Math.random()).slice(0, 3);
          setSectionTitle('Featured Products');
        }

        const mappedProducts = productsToShow.map(p => {
          const basePrice = p.price;
          const discountedPrice = p.onSale && p.discountPercentage
            ? basePrice * (1 - p.discountPercentage / 100)
            : basePrice;

          const originalPriceWithTax = basePrice * (1 + taxRate);
          const salePriceWithTax = discountedPrice * (1 + taxRate);

          return {
            id: p.id,
            name: p.name,
            description: p.description,
            onSale: p.onSale,
            originalPrice: originalPriceWithTax,
            discountPercentage: p.discountPercentage,
            salePrice: salePriceWithTax,
            slug: p.slug,
            image: p.image || '/example.png'
          };
        });
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [heroRef, heroVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [offersRef, offersVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar userType="visitor" />

      <div className="flex-grow">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-[calc(100vh-5rem)] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 z-10"></div>
          <img
            src="/homeimage.jpeg"
            alt="Professional printing services"
            className={`absolute inset-0 w-full h-full object-cover blur-[4px] transition-transform duration-[2s] ease-out ${heroVisible ? 'scale-105' : 'scale-100'}`}
          />
          <div className={`relative z-20 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-100 text-sm font-semibold mb-6 backdrop-blur-sm">
              PREMIUM PRINTING SERVICES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-white mb-6 md:mb-8 leading-tight tracking-tight">
              Bring your ideas<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                to vibrant life
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 mb-8 md:mb-10 font-light max-w-3xl mx-auto leading-relaxed">
              Experience the perfect blend of quality, speed, and innovation. We turn your digital designs into tangible masterpieces.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 text-base md:py-4 md:px-10 md:text-lg lg:py-5 lg:px-12 lg:text-xl rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Start Printing
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/contact"
                className="w-auto bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 font-bold py-3 px-8 text-base md:py-4 md:px-10 md:text-lg lg:py-5 lg:px-12 lg:text-xl rounded-full transition-all flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-12 md:py-16 lg:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  We use state-of-the-art technology and premium materials to ensure your prints look professional and last longer.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tight deadline? No problem. We offer expedited shipping options to get your prints to you when you need them.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly</h3>
                <p className="text-gray-600 leading-relaxed">
                  We care about the planet. Our sustainable printing practices minimize waste and use eco-friendly materials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Offers/Products Section */}
        <section ref={offersRef} className="py-12 md:py-16 lg:py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-1000 ${offersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Don't Miss Out</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">{sectionTitle}</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover our latest promotions and featured items selected just for you.
              </p>
            </div>

            <div className={`transition-all duration-1000 delay-200 ${offersVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <OfferCarousel products={products} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-12 md:py-16 lg:py-24 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className={`relative z-10 max-w-4xl mx-auto px-4 text-center transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8">Ready to start your project?</h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust ACSA Print for their printing needs.
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-gray-900 font-bold py-4 px-12 rounded-full transition-all transform hover:scale-105 hover:bg-gray-100 shadow-xl"
            >
              Browse Catalog
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
