import React from 'react';

export const BootAwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <defs>
      <radialGradient id="silver-star-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f5f5f5" />
        <stop offset="60%" stopColor="#e0e0e0" />
        <stop offset="100%" stopColor="#a0a0a0" />
      </radialGradient>
    </defs>
    <path
      fill="url(#silver-star-grad)"
      stroke="#6b7280"
      strokeWidth="0.5"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);