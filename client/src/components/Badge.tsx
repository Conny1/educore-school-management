import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant, className }) => {
  const getVariantClasses = (val: string = '') => {
    const v = val.toLowerCase();
    
    // Status color mapping
    if (['active', 'present', 'approved', 'paid', 'completed', 'mpesa', 'cash', 'bank_transfer', 'cheque', 'bank'].includes(v)) {
      return 'bg-[#dcfce7] text-[#166534]';
    }
    if (['absent', 'suspended', 'cancelled', 'inactive', 'on_hold'].includes(v)) {
      return 'bg-[#fee2e2] text-[#991b1b]';
    }
    if (['pending', 'planning', 'late', 'on_leave'].includes(v)) {
      return 'bg-[#fef3c7] text-[#92400e]';
    }
    if (['transferred', 'half_day', 'excused'].includes(v)) {
      return 'bg-blue-100 text-blue-800';
    }
    
    // Default
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={cn(
      'inline-flex items-center px-[10px] py-[4px] rounded-[100px] text-[0.7rem] font-semibold uppercase transition-colors',
      getVariantClasses(variant || children?.toString()),
      className
    )}>
      {children}
    </span>
  );
};
