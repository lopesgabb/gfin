import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  size = 'md',
  color = 'bg-emerald-500'
}) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  const height = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height[size]}`}>
      <div 
        className={`${color} h-full transition-all duration-500 ease-out rounded-full`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
