'use client';

import React, { useState, useCallback } from 'react';
import { Input, Button } from '@/components/atoms';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = 'Search titles, people, genres',
  initialValue = '',
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query);
  };

  const handleClear = useCallback(() => {
    setQuery('');
    onClear?.();
  },[onClear, setQuery]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-xs ${className}`}
    >
      <Input
        type="search"
        name="search"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        leftIcon={Search}
        inputClassName={`
          bg-transparent border border-[var(--color-netflix-gray)] focus:border-white 
          transition-all duration-300 ease-in-out
          h-9 text-sm pr-10
        `}
        className="w-full"
      />
      {query && (
        <Button
          type="button"
          variant="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 hover:bg-transparent"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-[var(--color-netflix-gray-light)] hover:text-white" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
