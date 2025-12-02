import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const OfferCarousel = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [products.length, isPaused]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
    };

    const handleSwipe = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }
        if (touchEndX.current - touchStartX.current > 50) {
            setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
        }
    };

    if (products.length === 0) return null;

    return (
        <div
            className="relative h-[600px] w-full flex flex-col items-center justify-center overflow-hidden py-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
                {products.map((product, index) => {
                    let position = 'hidden';
                    const len = products.length;
                    const normalizedCurrent = currentIndex;
                    const normalizedIndex = index;
                    let diff = (normalizedIndex - normalizedCurrent + len) % len;

                    if (diff === 0) position = 'center';
                    else if (diff === 1) position = 'right';
                    else if (diff === len - 1) position = 'left';

                    if (len > 3 && position === 'hidden') return null;

                    return (
                        <div
                            key={product.id}
                            className={`absolute transition-all duration-700 ease-in-out transform
                                ${position === 'center'
                                    ? 'z-30 scale-100 opacity-100 translate-x-0'
                                    : position === 'left'
                                        ? 'z-20 scale-90 opacity-40 -translate-x-[60%]'
                                        : 'z-20 scale-90 opacity-40 translate-x-[60%]'
                                }
                            `}
                            style={{
                                width: '380px',
                                maxWidth: '90vw',
                            }}
                        >
                            <div className={`
                                relative bg-white rounded-[2rem] overflow-hidden h-full
                                transition-all duration-300 border border-gray-100
                                ${position === 'center' ? 'ring-1 ring-black/5' : ''}
                            `}>
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    {product.onSale && product.discountPercentage > 0 && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg backdrop-blur-md bg-opacity-95 animate-bounce">
                                                -{product.discountPercentage}%
                                            </span>
                                        </div>
                                    )}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex flex-col items-center text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 mb-6 text-sm line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-center gap-4 mb-8">
                                        {product.onSale && product.originalPrice && (
                                            <span className="text-gray-400 line-through text-lg font-medium">
                                                €{product.originalPrice.toFixed(2)}
                                            </span>
                                        )}
                                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                            €{product.salePrice.toFixed(2)}
                                        </span>
                                    </div>

                                    <Link
                                        to={`/products/${product.slug || product.id}`}
                                        className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group/btn"
                                    >
                                        View Details
                                        <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-0 flex gap-6 z-30">
                {products.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`
                            h-2 rounded-full transition-all duration-300 
                            ${idx === currentIndex
                                ? 'w-8 bg-blue-600'
                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }
                        `}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Side Controls */}
            <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)}
                className="absolute left-4 md:left-12 z-30 p-4 bg-white/90 backdrop-blur-md rounded-full text-gray-800 hover:text-blue-600 hover:scale-110 transition-all duration-300 group hidden md:block"
            >
                <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % products.length)}
                className="absolute right-4 md:right-12 z-30 p-4 bg-white/90 backdrop-blur-md rounded-full text-gray-800 hover:text-blue-600 hover:scale-110 transition-all duration-300 group hidden md:block"
            >
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default OfferCarousel;
