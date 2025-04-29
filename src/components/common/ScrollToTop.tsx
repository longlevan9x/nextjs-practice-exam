'use client';
import React, { useState, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

const ScrollToTop: React.FC = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!showScrollTop) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-16 cursor-pointer right-4 bg-blue-800 text-white p-3 hover:bg-blue-900 transition-all duration-200 z-50 hover:scale-105"
            aria-label="Lên đầu trang"
        >
            <ArrowUpIcon className="w-6 h-6" />
        </button>
    );
};

export default ScrollToTop; 