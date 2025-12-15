import React from 'react';

export const PitchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.5-6H21M3 21h18M3 4.5h18M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
