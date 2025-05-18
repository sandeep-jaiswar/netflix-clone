import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  // We can add size props later if needed, e.g., small, medium, large
  // For now, it will scale based on the className width/height or its container
}

const Logo: React.FC<LogoProps> = ({ className = '', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 276.7" // Adjusted viewBox for a typical Netflix logo aspect ratio
      className={`fill-[var(--color-netflix-red)] ${className}`} // Use fill for SVG color
      aria-label="Netflix Logo" // Accessibility
      role="img" // Accessibility
      {...props}
    >
      {/* A simplified representation of the Netflix logo paths */}
      <path d="M140.5 276.7L0 0h50.6l90.2 184.4L180.4 0h49.4l-140 276.7h-49.3zM303.8 0h-53.2v276.7h53.2V0zM467.1 0h-53.2v276.7h53.2V0zM616.8 138.4c0-76.5 62-138.4 138.4-138.4S893.6 62 893.6 138.4s-62 138.4-138.4 138.4S616.8 214.8 616.8 138.4zm53.1 0c0 47.1 38.2 85.3 85.3 85.3s85.3-38.2 85.3-85.3-38.2-85.3-85.3-85.3-85.3 38.2-85.3 85.3zM1024 0v276.7h-50.9L834.8 144.1v132.6h-53.2V0h50.6l138.3 132.6V0H1024z" />
    </svg>
  );
};

Logo.displayName = 'Logo';

export default Logo;
