import React from 'react';

type TextElement = 'p' | 'span' | 'div';

type TextOwnProps<C extends TextElement> = {
  as?: C;
  children: React.ReactNode;
  className?: string;
  variant?: 'body' | 'caption' | 'small' | 'subtle' | 'error';
  color?: 'default' | 'primary' | 'secondary' | 'accent' | 'white' | 'black' | 'red';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
};

type TextProps<C extends TextElement> = TextOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof TextOwnProps<C>>;

const Text = <C extends TextElement = 'p'>({
  as,
  children,
  className = '',
  variant = 'body',
  color = 'default',
  weight,
  truncate = false,
  ...props
}: TextProps<C>) => {
  const Component = as || 'p';

  const baseStyle = 'leading-normal';

  const variantStyles = {
    body: 'text-base',
    caption: 'text-sm',
    small: 'text-xs',
    subtle: 'text-sm text-[var(--text-secondary)]',
    error: 'text-sm text-[var(--color-netflix-red-dark)]',
  };

  const colorStyles = {
    default: 'text-[var(--text-DEFAULT)]',
    primary: 'text-[var(--text-primary)]',
    secondary: 'text-[var(--text-secondary)]',
    accent: 'text-[var(--text-accent)]',
    white: 'text-[var(--color-netflix-white)]',
    black: 'text-[var(--color-netflix-black)]',
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
};

Text.displayName = 'Text';

export default Text;
