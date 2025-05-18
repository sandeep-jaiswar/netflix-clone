'use client';

import React from 'react';
import Image from 'next/image';
import { Heading } from '@/components/atoms';
import { PlayCircle, PlusCircle, ChevronDownCircle } from 'lucide-react';

interface ContentCardProps {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: (id: string) => void;
  onPlay?: (id: string) => void;
  onMyList?: (id: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  imageUrl,
  onClick,
  onPlay,
  onMyList,
}) => {
  const handleClick = () => onClick?.(id);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const stopPropagation =
    (handler?: (id: string) => void) => (e: React.MouseEvent) => {
      e.stopPropagation();
      handler?.(id);
    };

  return (
    <button
      className="group relative aspect-[16/9] md:aspect-[18/10] lg:aspect-[16/9] w-full rounded-md overflow-hidden shadow-lg cursor-pointer 
                 bg-netflix-gray-dark hover:scale-105 md:hover:scale-110 lg:hover:scale-[1.15] hover:shadow-card-hover hover:z-20 
                 transition-all duration-200 ease-in-out"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${title}`}
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="(min-width: 1024px) 18vw, (min-width: 768px) 23vw, 45vw"
        className="transition-opacity duration-200 group-hover:opacity-75 object-cover"
      />

      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Heading as="h3" variant="cardTitle" className="!text-sm sm:!text-base text-white truncate text-shadow">
          {title}
        </Heading>
        <div className="hidden group-hover:flex items-center space-x-2 mt-1 sm:mt-2">
          <button
            onClick={stopPropagation(onPlay)}
            className="p-1 bg-white/80 hover:bg-white rounded-full text-black"
            aria-label={`Play ${title}`}
          >
            <PlayCircle className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={stopPropagation(onMyList)}
            className="p-1 border-2 border-white/50 hover:border-white rounded-full text-white/80 hover:text-white"
            aria-label={`Add ${title} to My List`}
          >
            <PlusCircle className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={stopPropagation(onClick)}
            className="p-1 border-2 border-white/50 hover:border-white rounded-full text-white/80 hover:text-white ml-auto"
            aria-label={`More info for ${title}`}
          >
            <ChevronDownCircle className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </button>
  );
};

export default ContentCard;
