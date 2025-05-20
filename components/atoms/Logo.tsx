import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // We can add size props later if needed, e.g., small, medium, large
  // For now, it will scale based on the className width/height or its container
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '', ...props }) => {
  return (
    <svg width="300" height="100" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" className={`fill-[var(--color-netflix-red)] ${className}`} {...props}>
      <rect width="800" height="200" fill="black" />
      <text x="50" y="140"
        font-family="Arial, Helvetica, sans-serif"
        font-size="140"
        font-weight="bold"
        letter-spacing="10">
        NETFLIX
      </text>
    </svg>


  );
};

Logo.displayName = 'Logo';

export default Logo;
