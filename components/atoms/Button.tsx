import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      isLoading = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center font-semibold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out';

    const variantStyles = {
      primary: 'bg-[var(--color-netflix-red)] hover:bg-[var(--color-netflix-red-dark)] text-[var(--color-netflix-white)] focus-visible:ring-[var(--color-netflix-red)]',
      secondary:
        'bg-[var(--color-netflix-gray-dark)] hover:bg-[var(--color-netflix-gray)] text-[var(--color-netflix-white)] focus-visible:ring-[var(--color-netflix-gray)]',
      ghost: 'hover:bg-[var(--color-netflix-gray-dark)]/50 text-[var(--color-netflix-white)] focus-visible:ring-[var(--color-netflix-gray)]',
      danger: 'bg-[var(--color-netflix-red-dark)] hover:bg-[var(--color-netflix-red)] text-[var(--color-netflix-white)] focus-visible:ring-[var(--color-netflix-red-dark)]',
      icon: 'bg-transparent hover:bg-[var(--color-netflix-gray-dark)]/60 text-[var(--color-netflix-white)] focus-visible:ring-[var(--color-netflix-gray)] p-2 rounded-full',
    };

    const sizeStyles = {
      sm: `px-3 py-1.5 text-sm ${LeftIcon || RightIcon ? 'gap-1.5' : ''}`,
      md: `px-4 py-2 text-base ${LeftIcon || RightIcon ? 'gap-2' : ''}`,
      lg: `px-6 py-3 text-lg ${LeftIcon || RightIcon ? 'gap-2.5' : ''}`,
    };

    const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg
            className={`animate-spin h-5 w-5 ${LeftIcon || RightIcon || children ? 'mr-3' : ''} text-[var(--color-netflix-white)]`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {LeftIcon && !isLoading && <LeftIcon size={iconSize} className={children ? "mr-2" : ""} />}
        {children && <span>{children}</span>}
        {RightIcon && !isLoading && <RightIcon size={iconSize} className={children ? "ml-2" : ""} />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
