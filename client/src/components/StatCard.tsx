import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  color = 'primary',
  className 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white p-5 rounded-[12px] border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col gap-1',
        className
      )}
    >
      <span className="text-[0.75rem] font-semibold text-text-muted uppercase tracking-wider">  {title}</span>
      <div className="text-2xl font-extrabold text-[#1e293b]">{value}</div>
      {trend && (
        <span className={cn(
          'text-[0.7rem]',
          trend.isUp ? 'text-[#10b981]' : 'text-danger'
        )}>
          {trend.isUp ? '+' : '-'} {trend.value}% {trend.isUp ? 'increase' : 'decrease'}
        </span>
      )}
      {description && !trend && (
        <p className="text-[0.7rem] text-text-muted">{description}</p>
      )}
    </motion.div>
  );
};
