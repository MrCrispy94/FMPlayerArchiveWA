
import React from 'react';

export const LineGraphIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v16.5h16.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 17.25L9 12l4.5 4.5 6-6" />
  </svg>
);
