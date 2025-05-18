'use client'; // Because NavLink and SearchBar might have client-side logic

import React, { useState, useEffect } from 'react';
import { Container, Logo } from '@/components/atoms';
import { NavLink, SearchBar, UserAvatar } from '@/components/molecules';
import { Bell, ChevronDown } from 'lucide-react'; // Icons for notifications and dropdown

// Define navigation links structure
const mainNavLinks = [
  { href: '/', label: 'Home', exact: true },
  { href: '/tv-shows', label: 'TV Shows' },
  { href: '/movies', label: 'Movies' },
  { href: '/new-popular', label: 'New & Popular' },
  { href: '/my-list', label: 'My List' },
];

interface HeaderProps {
  // user?: { name?: string | null; imageUrl?: string | null; };
}

const Header: React.FC<HeaderProps> = (/* { user } */) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const user = { imageUrl: null, name: 'Profile' };
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

          <div className="relative">
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              tabIndex={0}
              role="button"
              aria-expanded={isProfileDropdownOpen}
              aria-haspopup="true"
              aria-controls="profile-menu"
            >
              <UserAvatar src={user?.imageUrl} alt={user?.name || 'User Profile'} size={32} />
              <ChevronDown
                size={16}
                className={`
                  text-[var(--color-netflix-white)] transition-transform duration-200
                  ${isProfileDropdownOpen ? 'rotate-180' : 'rotate-0'}
                `}
              />
            </div>
            {isProfileDropdownOpen && (
              <div
                id="profile-menu"
                className="absolute top-full right-0 mt-2 w-48 bg-[var(--color-netflix-black)] border border-[var(--color-netflix-gray-dark)] rounded-md shadow-lg py-1 z-50"
                role="menu"
              >
                <a href="#" role="menuitem" className="block px-4 py-2 text-sm text-[var(--color-netflix-gray-light)] hover:bg-[var(--color-netflix-gray-dark)]">Account</a>
                <a href="#" role="menuitem" className="block px-4 py-2 text-sm text-[var(--color-netflix-gray-light)] hover:bg-[var(--color-netflix-gray-dark)]">Help Center</a>
                <hr className="border-t border-[var(--color-netflix-gray-dark)] my-1" />
                <a href="#" role="menuitem" className="block px-4 py-2 text-sm text-[var(--color-netflix-gray-light)] hover:bg-[var(--color-netflix-gray-dark)]">Sign out of Netflix</a>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
