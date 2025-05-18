'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Text, Button } from '@/components/atoms';
import { PlayCircle, PlusCircle, ChevronDown, ThumbsUp } from 'lucide-react';

export interface ContentCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration?: string;
  matchPercentage?: number;
  ageRating?: string;
  genres?: string[];
  onPlay?: (id: string) => void;
  onAddToMyList?: (id: string) => void;
  onMoreInfo?: (id: string) => void;
  isMyListItem?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  id,
  title,
  thumbnailUrl,
  duration,
  matchPercentage,
  ageRating,
  genres,
  onPlay,
  onAddToMyList,
  onMoreInfo,
  isMyListItem,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative aspect-[16/9] md:aspect-[1.85/1] bg-[var(--color-netflix-gray-dark)] rounded-md overflow-hidden shadow-md 
                 hover:shadow-[var(--shadow-card-hover)] group
                 transition-all duration-300 ease-in-out transform hover:scale-105 hover:z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onMoreInfo && onMoreInfo(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onMoreInfo && onMoreInfo(id)}
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 30vw, (max-width: 1200px) 20vw, 15vw"
        className="object-cover transition-opacity duration-300 group-hover:opacity-80"
      />

      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <Text
            as="h3"
            variant="caption"
            weight="bold"
            color="white"
            className="truncate mb-1"
            title={title}
          >
            {title}
          </Text>
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="icon"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onPlay?.(id); }}
              aria-label={`Play ${title}`}
              className="bg-white/90 hover:bg-white text-black p-1 rounded-full"
            >
              <PlayCircle size={20} />
            </Button>
            <Button
              variant="icon"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onAddToMyList?.(id); }}
              aria-label={isMyListItem ? `Remove ${title} from My List` : `Add ${title} to My List`}
              className="border-2 border-gray-400/70 hover:border-white text-white p-1 rounded-full"
            >
              <PlusCircle size={20} /> 
            </Button>
             <Button
              variant="icon"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onMoreInfo?.(id); }}
              aria-label={`More info about ${title}`}
              className="border-2 border-gray-400/70 hover:border-white text-white p-1 rounded-full ml-auto"
            >
              <ChevronDown size={20} />
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            {matchPercentage && (
              <Text color="accent" weight="bold">
                {matchPercentage}% Match
              </Text>
            )}
            {ageRating && (
              <Text
                as="span"
                color="white"
                className="border border-gray-400/70 px-1 py-0.5 rounded-sm text-[10px]"
              >
                {ageRating}
              </Text>
            )}
            {duration && <Text color="secondary">{duration}</Text>}
          </div>
          {genres && genres.length > 0 && (
            <Text color="secondary" variant="small" className="truncate mt-1">
              {genres.join(' • ')}
            </Text>
          )}
        </div>
      )}
      {!isHovered && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
           <Text as="h3" variant="caption" weight="semibold" color="white" className="truncate" title={title}>
            {title}
          </Text>
        </div>
      )}
    </div>
  );
};

export default ContentCard;
