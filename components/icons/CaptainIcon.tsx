import React from 'react';

interface CaptainIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export const CaptainIcon: React.FC<CaptainIconProps> = ({ title, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    {title && <title>{title}</title>}
    <g>
      <path
        d="M12 2L4 6v6c0 4.42 8 8 8 8s8-3.58 8-8V6L12 2z"
        fill="#132257"
        stroke="#a5b4fc"
        strokeWidth="1"
      />
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="12"
        fontFamily="Inter, sans-serif"
        fontWeight="bold"
      >
        C
      </text>
    </g>
  </svg>
);