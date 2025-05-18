'use client';

import React, { useRef } from 'react';
import { Heading } from '@/components/atoms';
import { ContentCard, ContentCardProps } from '@/components/molecules/ContentCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRowProps {
  title: string;
  items: ContentCardProps[];
  onPlayItem?: (id: string) => void;
  onAddToMyListItem?: (id: string) => void;
  onMoreInfoItem?: (id: string) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  onPlayItem,
  onAddToMyListItem,
  onMoreInfoItem,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-12 group/row">
      <Heading as="h2" variant="sectionTitle" className="mb-3 md:mb-4 ml-4 sm:ml-6 lg:ml-8 text-[var(--text-primary)]">
        {title}
      </Heading>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-full w-10 md:w-12
                     bg-gradient-to-r from-black/60 to-transparent 
                     text-white opacity-0 group-hover/row:opacity-100 hover:bg-black/80
                     transition-opacity duration-300 flex items-center justify-center
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft size={32} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide space-x-2 md:space-x-3 lg:space-x-4 
                     px-4 sm:px-6 lg:px-8 py-2"
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[40vw] sm:w-[30vw] md:w-[23vw] lg:w-[18vw] xl:w-[15vw]">
              <ContentCard
                {...item}
                onPlay={onPlayItem}
                onAddToMyList={onAddToMyListItem}
                onMoreInfo={onMoreInfoItem}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-full w-10 md:w-12
                     bg-gradient-to-l from-black/60 to-transparent
                     text-white opacity-0 group-hover/row:opacity-100 hover:bg-black/80
                     transition-opacity duration-300 flex items-center justify-center
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
