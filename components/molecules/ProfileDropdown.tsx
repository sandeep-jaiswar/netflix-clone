'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut, UserCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Text } from '@/components/atoms';
import UserAvatar from './UserAvatar';

interface ProfileDropdownProps {
  user?: {
    name?: string | null;
    email?: string | null;
    imageUrl?: string | null;
  };
  onSignOut?: () => void;
}

interface DropdownItemProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
  children: React.ReactNode;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href, onClick, icon: Icon, children }) => {
  const content = (
    <span className="flex items-center px-4 py-2 text-sm text-[var(--color-netflix-gray-light)] hover:bg-[var(--color-netflix-gray-dark)] cursor-pointer w-full">
      {Icon && <Icon size={18} className="mr-3" />}
      {children}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        role="menuitem"
        className="block w-full"
      >
        {content}
      </Link>
    );
  }
  return <div role="menuitem" onClick={onClick} className="block w-full">{content}</div>;
};


const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const placeholderUser = {
    name: 'Profile Name',
    email: 'user@example.com',
    imageUrl: null,
    ...user,
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center space-x-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="profile-menu"
      >
        <UserAvatar src={placeholderUser.imageUrl} alt={placeholderUser.name || 'User Profile'} size={32} />
        <ChevronDown
          size={16}
          className={`text-[var(--color-netflix-white)] transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>

      {isOpen && (
        <div
          id="profile-menu"
          className="absolute top-full right-0 mt-2 w-56 bg-[var(--color-netflix-black)] border border-[var(--color-netflix-gray-dark)] rounded-md shadow-xl py-1 z-[60]"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          onKeyDown={(e) => {
            const menuItems = Array.from(
              e.currentTarget.querySelectorAll('[role="menuitem"]')
            );
            const currentIndex = menuItems.indexOf(
              document.activeElement as HTMLElement
            );

            // Handle arrow navigation
            if (e.key === 'ArrowDown' && currentIndex < menuItems.length - 1) {
              (menuItems[currentIndex + 1] as HTMLElement).focus();
              e.preventDefault();
            }
            if (e.key === 'ArrowUp' && currentIndex > 0) {
              (menuItems[currentIndex - 1] as HTMLElement).focus();
              e.preventDefault();
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        >
          <div className="px-4 py-3 border-b border-[var(--color-netflix-gray-dark)]">
            <Text color="white" weight="semibold" truncate>
              {placeholderUser.name}
            </Text>
            {placeholderUser.email && (
              <Text variant="small" color="secondary" truncate>
                {placeholderUser.email}
              </Text>
            )}
          </div>
          <div role="none" className="py-1">
            <DropdownItem href="/account" icon={UserCircle}>
              Account
            </DropdownItem>
            <DropdownItem href="/help" icon={HelpCircle}>
              Help Center
            </DropdownItem>
          </div>
          {onSignOut && (
            <div role="none" className="py-1 border-t border-[var(--color-netflix-gray-dark)]">
              <DropdownItem onClick={onSignOut} icon={LogOut}>
                Sign out
              </DropdownItem>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
