import React from 'react';

export const GoldTrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <defs>
      <radialGradient id="gold-star-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF59D" />
        <stop offset="60%" stopColor="#FBC02D" />
        <stop offset="100%" stopColor="#B1740F" />
      </radialGradient>
    </defs>
    <path
      fill="url(#gold-star-grad)"
      stroke="#A56707"
      strokeWidth="0.5"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);