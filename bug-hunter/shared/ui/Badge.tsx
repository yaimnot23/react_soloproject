import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'red' | 'green' | 'gray' | 'blue';
  className?: string;
}

export function Badge({ children, color = 'gray', className }: BadgeProps) {
  const colorStyles = {
    red: 'bg-red-100 text-red-800 border-red-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorStyles[color],
        className
      )}
    >
      {children}
    </span>
  );
}