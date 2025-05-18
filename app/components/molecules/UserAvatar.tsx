import React from 'react';
import Image from 'next/image'; // Using Next.js Image for optimization
import { User } from 'lucide-react'; // Placeholder icon

interface UserAvatarProps {
  src?: string | null; // Avatar image URL
  alt?: string;
  size?: number; // Size in pixels
  className?: string;
  onClick?: () => void; // For dropdown functionality later
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User Avatar',
  size = 32, // Default size (Netflix profile icons are often small in the header)
  className = '',
  onClick,
}) => {
  const containerStyle = `rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`;
  const imageStyle = `object-cover`;

  return (
    <div
      className={`${containerStyle} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={imageStyle}
          priority // Potentially a LCP element if in header
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center bg-[var(--color-netflix-gray-dark)]"
          title={alt} // Show alt as tooltip for placeholder
        >
          <User
            size={size * 0.6}
            className="text-[var(--color-netflix-gray-light)]"
          />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
