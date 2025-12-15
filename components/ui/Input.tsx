import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const baseClasses = 'bg-gray-700/50 border border-gray-600 text-gray-200 text-sm rounded-md focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5';
    return <input ref={ref} className={`${baseClasses} ${className}`} {...props} />;
  }
);

Input.displayName = 'Input';

export default Input;
