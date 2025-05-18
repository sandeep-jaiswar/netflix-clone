'use client'; // Needed for usePathname

import React from 'react';
import Link from 'next/link'; // Next.js Link component
import { usePathname } from 'next/navigation'; // To determine active state
import { Text } from '@/components/atoms'; // Using our Text atom for consistency

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string; // Custom class for active state
  exact?: boolean; // Whether the path should match exactly for active state
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className = '',
  activeClassName = 'font-bold text-[var(--color-netflix-white)]', // Default active style
  exact = false,
}) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} legacyBehavior={false}> {/* Use new Link behavior */}
      <Text
        as="span" // Render as span, Link will provide the anchor
        className={`
          py-2 px-3 rounded-md text-sm
          transition-colors duration-150 ease-in-out
          hover:text-[var(--color-netflix-gray-light)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-netflix-white)]
          ${isActive ? activeClassName : 'text-[var(--text-secondary)]'}
          ${className}
        `}
        // weight={isActive ? 'semibold' : 'normal'} // Alternative way to set active weight
      >
        {children}
      </Text>
    </Link>
  );
};

export default NavLink;
