import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements; // Allow rendering as div, section, main, etc.
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as = 'div', // Default to a div
}) => {
  const Component = as;
  const baseStyle = 'mx-auto px-4 sm:px-6 lg:px-8'; 
  const maxWidthStyle = 'max-w-screen-2xl'; 

  return (
    <Component className={`${baseStyle} ${maxWidthStyle} ${className}`}>
      {children}
    </Component>
  );
};

export default Container;
