
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-neuroPurple to-neuroTeal p-2 shadow-lg",
        className
      )}
      {...props}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100" 
        className="w-full h-full text-white"
      >
        <path 
          d="M50 10 L80 50 L50 90 L20 50 Z" 
          fill="white" 
          stroke="none"
        />
        <circle 
          cx="50" 
          cy="50" 
          r="10" 
          fill="transparent" 
          stroke="white" 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default Logo;
