'use client';

import React from 'react';
import Image from 'next/image';
import { Heading, Text } from '@/components/atoms';
import { PlayCircle, PlusCircle, CheckCircle, ChevronDownCircle } from 'lucide-react';
import { TmdbContentItem } from '@/types/tmdb';

interface ContentCardProps extends TmdbContentItem {
  onClick?: (id: string, type: 'movie' | 'tv') => void;
  onPlay?: (id: string) => void;
  onMyListToggle?: (id: string, currentStatus: boolean, type: 'movie' | 'tv') => void;
  isInMyList?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  imageUrl,
  releaseYear,
  type,
  matchPercentage,
  duration,
  genres,
  maturityRating,
  onClick,
  onPlay,
  onMyListToggle,
  isInMyList = false,
}) => {
  const handleClick = () => onClick?.(id, type);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  function stopPropagationAndHandle<T extends unknown[]>(
    handler?: (id: string, ...args: T) => void,
    ...extraArgs: T
  ): (e: React.MouseEvent) => void {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      if (handler) {
        handler(id, ...extraArgs);
      }
    };
  }

  return (
    <div
      className="group relative aspect-[16/9] md:aspect-[18/10] lg:aspect-[16/9] w-full rounded-md overflow-hidden shadow-lg 
                 bg-netflix-gray-dark 
                 hover:scale-105 md:hover:scale-110 lg:hover:scale-[1.15] hover:shadow-card-hover hover:z-20 
                 transition-all duration-300 ease-in-out 
                 focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-background"
    >
      <button
        className="absolute inset-0 w-full h-full z-10 cursor-pointer"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`View details for ${title}`}
      />

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${title} poster`}
          fill
          sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 18vw, (min-width: 768px) 23vw, (min-width: 640px) 30vw, 45vw"
          className="transition-opacity duration-300 group-hover:opacity-50 object-cover"
        />
      ) : (
        <div className="w-full h-full bg-netflix-gray flex items-center justify-center">
          <Text color="secondary" variant="small">No Image</Text>
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 
                   bg-gradient-to-t from-black/95 via-black/80 to-transparent 
                   opacity-0 group-hover:opacity-100 
                   translate-y-4 group-hover:translate-y-0 
                   transition-all duration-300 ease-in-out z-20 pointer-events-none"
      >
        <Heading as="h3" variant="cardTitle" className="!text-sm sm:!text-base md:!text-lg text-white truncate text-shadow-md mb-1 md:mb-1.5">
          {title}
        </Heading>

        <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 md:mb-2 pointer-events-auto">
          <button
            onClick={stopPropagationAndHandle(onPlay)}
            className="p-1 sm:p-1.5 bg-white hover:bg-gray-200 rounded-full text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`Play ${title}`}
          >
            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
          </button>
          <button
            onClick={stopPropagationAndHandle(onMyListToggle, isInMyList, type)}
            className="p-1 sm:p-1.5 border-2 border-white/60 hover:border-white rounded-full text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={isInMyList ? `Remove ${title} from My List` : `Add ${title} to My List`}
          >
            {isInMyList
              ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
              : <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />}
          </button>
          <button
            onClick={stopPropagationAndHandle(onClick, type)}
            className="p-1 sm:p-1.5 border-2 border-white/60 hover:border-white rounded-full text-white/90 hover:text-white ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={`More info for ${title}`}
          >
            <ChevronDownCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-300 flex-wrap">
          {matchPercentage && <Text weight="bold" className="!text-green-400 text-shadow-sm">{matchPercentage}% Match</Text>}
          {releaseYear && <Text className="!text-gray-300 text-shadow-sm">{releaseYear}</Text>}
          {maturityRating && (
            <Text className="!text-gray-300 border border-gray-500 px-1 text-[0.6rem] md:text-xs leading-none text-shadow-sm">
              {maturityRating}
            </Text>
          )}
          {duration && <Text className="!text-gray-300 text-shadow-sm">{duration}</Text>}
        </div>
        {genres && genres.length > 0 && (
          <div className="mt-1 md:mt-1.5">
            <Text variant="small" className="!text-gray-300 line-clamp-1 text-shadow-sm">
              {genres.slice(0, 3).join(' \u2022 ')}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
