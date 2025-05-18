import React from 'react';

type TextElement = 'p' | 'span' | 'div'; // Could add more like 'label' if needed

interface TextProps<C extends TextElement = 'p'> {
  as?: C; // Allows rendering as p, span, or div
  children: React.ReactNode;
  className?: string;
  variant?: 'body' | 'caption' | 'small' | 'subtle' | 'error'; // Predefined styles
  color?: 
    | 'default' 
    | 'primary' 
    | 'secondary' 
    | 'accent' 
    | 'white' 
    | 'black' 
    | 'red'; // Theme colors
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean; // Option for text-ellipsis
} & React.ComponentPropsWithoutRef<C>;


const Text = <C extends TextElement = 'p'>(({
  as,
  children,
  className = '',
  variant = 'body',
  color = 'default',
  weight,
  truncate = false,
  ...props
}: TextProps<C>): JSX.Element => {
  const Component = as || 'p';

  const baseStyle = 'leading-normal'; // Default leading

  const variantStyles = {
    body: 'text-base', // Typically 16px
    caption: 'text-sm', // Typically 14px
    small: 'text-xs',   // Typically 12px
    subtle: 'text-sm text-[var(--text-secondary)]', // Smaller and secondary color
    error: 'text-sm text-[var(--color-netflix-red-dark)]',
  };

  const colorStyles = {
    default: 'text-[var(--text-DEFAULT)]',
    primary: 'text-[var(--text-primary)]', // Often same as netflix-white
    secondary: 'text-[var(--text-secondary)]',
    accent: 'text-[var(--text-accent)]', // netflix-red
    white: 'text-[var(--color-netflix-white)]',
    black: 'text-[var(--color-netflix-black)]', // For light backgrounds if ever needed
    red: 'text-[var(--color-netflix-red)]',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const truncateStyle = truncate ? 'truncate' : '';

  return (
    <Component
      className={`${baseStyle} ${variantStyles[variant]} ${colorStyles[color]} ${
        weight ? weightStyles[weight] : ''
      } ${truncateStyle} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

export default Text;
