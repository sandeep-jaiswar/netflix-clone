import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps<C extends HeadingLevel = 'h1'> {
  as?: C; // Allows rendering as any heading level, defaults to h1
  children: React.ReactNode;
  className?: string;
  variant?: 'pageTitle' | 'sectionTitle' | 'cardTitle' | 'subheading'; // Semantic style variants
  color?: 
    | 'default' 
    | 'primary' 
    | 'secondary' 
    | 'accent' 
    | 'white' 
    | 'black'; // Theme colors
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
} & React.ComponentPropsWithoutRef<C>;

const Heading = <C extends HeadingLevel = 'h1'>(({
  as,
  children,
  className = '',
  variant = 'sectionTitle', // Default to sectionTitle as h1 is usually unique
  color = 'primary', // Headings are often primary text color
  weight,
  truncate = false,
  ...props
}: HeadingProps<C>): JSX.Element => {
  const Component = as || 'h1';

  const baseStyle = 'leading-tight';

  const variantStyles = {
    pageTitle: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    sectionTitle: 'text-2xl md:text-3xl font-semibold', 
    cardTitle: 'text-lg md:text-xl font-medium',
    subheading: 'text-xl md:text-2xl font-normal',
  };

  const colorStyles = {
    default: 'text-[var(--text-DEFAULT)]',
    primary: 'text-[var(--text-primary)]',
    secondary: 'text-[var(--text-secondary)]',
    accent: 'text-[var(--text-accent)]',
    white: 'text-[var(--color-netflix-white)]',
    black: 'text-[var(--color-netflix-black)]',
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

Heading.displayName = 'Heading';

export default Heading;
