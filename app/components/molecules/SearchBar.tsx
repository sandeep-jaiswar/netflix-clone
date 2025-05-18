import React, { useState } from 'react';
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
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };

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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        leftIcon={Search}
        inputClassName={`
          bg-transparent border border-[var(--color-netflix-gray)] focus:border-white 
          transition-all duration-300 ease-in-out
          h-9 text-sm
          ${query ? 'pr-10' : 'pr-3'}
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
          <X size={18} className="text-[var(--color-netflix-gray-light)] hover:text-white" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
