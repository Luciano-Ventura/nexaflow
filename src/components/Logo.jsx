import React from 'react';

const Logo = ({ size = 40, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="nexaModernGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06B6D4" />   {/* Cyber Cyan */}
                    <stop offset="50%" stopColor="#3B82F6" />  {/* Tech Blue */}
                    <stop offset="100%" stopColor="#A855F7" /> {/* Growth Purple */}
                </linearGradient>

                <linearGradient id="nexaAccentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />   {/* Tech Blue */}
                    <stop offset="100%" stopColor="#EC4899" /> {/* Marketing Neon Pink */}
                </linearGradient>

                <filter id="modernGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g filter="url(#modernGlow)">
                {/* 
                 * A sleek, continuous-looking 'N' forming an upward arrow 
                 * to symbolize Growth, Flow, and Paid Traffic Analytics 
                 */}

                {/* Left stem of the N */}
                <path d="M 18 80 L 18 40" stroke="url(#nexaModernGrad)" strokeWidth="14" strokeLinecap="round" />

                {/* Diagonal connecting N (Flowing up) */}
                <path d="M 18 40 L 64 80" stroke="url(#nexaModernGrad)" strokeWidth="14" strokeLinecap="round" />

                {/* Right Stem - The Growth Arrow soaring up */}
                <path d="M 42 40 L 64 20 L 64 80 M 64 20 L 86 40" stroke="url(#nexaAccentGrad)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />

                {/* Small Tech Tracker Node at origin */}
                <circle cx="18" cy="80" r="7" fill="#06B6D4" />

                {/* Small Growth Node at destination */}
                <circle cx="64" cy="20" r="7" fill="#F472B6" />
            </g>
        </svg>
    );
};

export default Logo;
