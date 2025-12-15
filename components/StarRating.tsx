
import React from 'react';

interface StarRatingProps {
  rating: number; // A number between 0 and 5
  size?: 'sm' | 'md' | 'lg';
}

const Star: React.FC<{ type: 'full' | 'half' | 'empty'; color: string; sizeClass: string }> = ({ type, color, sizeClass }) => {
  const id = `grad-${Math.random()}`;
  return (
    <svg className={sizeClass} viewBox="0 0 24 24" fill={type === 'full' ? color : (type === 'half' ? `url(#${id})` : 'none')} stroke={color} strokeWidth="1.5">
       {type === 'half' && (
         <defs>
           <linearGradient id={id}>
             <stop offset="50%" stopColor={color} />
             <stop offset="50%" stopColor="transparent" stopOpacity="0" />
           </linearGradient>
         </defs>
       )}
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
};

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'md' }) => {
  const stars = [];
  const color = "text-yellow-400";
  const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
  }
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} type="full" color="currentColor" sizeClass={sizeClasses[size]} />);
    } else if (i - 0.5 <= rating) {
      stars.push(<Star key={i} type="half" color="currentColor" sizeClass={sizeClasses[size]} />);
    } else {
      stars.push(<Star key={i} type="empty" color="currentColor" sizeClass={sizeClasses[size]} />);
    }
  }

  return <div className={`flex items-center ${color}`}>{stars}</div>;
};

export default StarRating;
