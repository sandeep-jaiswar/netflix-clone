'use client';

import React, { useState, useEffect } from 'react';
import { Container, Logo } from '@/components/atoms';
import { NavLink, SearchBar, ProfileDropdown } from '@/components/molecules';
import { Bell } from 'lucide-react';

const mainNavLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/tv-shows', label: 'TV Shows' },
  { href: '/movies', label: 'Movies' },
  { href: '/new-popular', label: 'New & Popular' },
  { href: '/my-list', label: 'My List' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

// Add this at the top of Header.tsx (or right above your component)
interface HeaderProps {
  currentUser: {
    name: string;
    email: string;
    imageUrl: string | null;
  };
  onSignOut: () => void;
}

// Update your component signature to accept props
const Header: React.FC<HeaderProps> = ({ currentUser, onSignOut }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Now use currentUser and onSignOut in your JSX instead of hard-coded values
  return (
    <header className={isScrolled ? 'scrolled' : ''}>
      <img
        src={currentUser.imageUrl ?? 'https://via.placeholder.com/100'}
        alt={currentUser.name}
      />
      <div>
        <p>{currentUser.name}</p>
        <p>{currentUser.email}</p>
      </div>
      <button onClick={onSignOut}>Sign Out</button>
    </header>
  );
};

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-colors duration-300 ease-in-out
        ${isScrolled ? 'bg-[var(--color-netflix-black)]' : 'bg-gradient-to-b from-black/70 to-transparent'}
      `}
    >
      <Container as="div" className="flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Logo className="h-6 w-auto md:h-7 lg:h-8" />
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {mainNavLinks.map((link) => (
              <NavLink key={link.href} href={link.href} exact={link.exact}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:space-x-5">
          <SearchBar className="hidden sm:flex" />

          <button aria-label="Notifications" className="text-[var(--color-netflix-white)] hover:text-[var(--color-netflix-gray-light)] transition-colors">
            <Bell size={22} />
          </button>

          <ProfileDropdown user={currentUser} onSignOut={handleSignOut} />

        </div>
      </Container>
    </header>
  );
};

export default Header;
