'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Heading, Container } from '@/components/atoms';
import { ContentCard } from '@/components/molecules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  imageUrl: string | null;
  type: 'movie' | 'tv'; 
  isInMyList?: boolean; // Added for My List status
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  onCardClick?: (id: string, type: 'movie' | 'tv') => void; 
  onPlay?: (id: string) => void; 
  onMyList?: (id: string, currentStatus: boolean, type: 'movie' | 'tv') => void; // Updated signature
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  onCardClick,
  onPlay,
  onMyList,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  const handleScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const newCanScroll = scrollWidth > clientWidth;
      setCanScroll(newCanScroll);
      if (newCanScroll) {
        setIsAtStart(scrollLeft < 5);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
      } else {
        setIsAtStart(true);
        setIsAtEnd(true);
      }
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const observer = new ResizeObserver(handleScrollability);
      observer.observe(container);
      handleScrollability();
      container.addEventListener('scroll', handleScrollability, { passive: true });
      return () => {
        observer.disconnect();
        container.removeEventListener('scroll', handleScrollability);
      };
    }
  }, [items, handleScrollability]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidthEstimate = container.firstChild ? (container.firstChild as HTMLElement).offsetWidth : 200;
      const scrollDistance = Math.max(container.clientWidth * 0.8, cardWidthEstimate + 16);
      const currentScroll = container.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollDistance : currentScroll + scrollDistance;
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }
  
  const chevronBaseClasses = "absolute top-0 bottom-0 z-30 w-12 md:w-14 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 hidden md:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <Container as="section" className="py-4 md:py-6 group/row relative">
      <Heading as="h2" variant="sectionTitle" className="mb-3 md:mb-4 text-[var(--text-primary)]">
        {title}
      </Heading>
      
      <div className="relative">
        {canScroll && !isAtStart && (
           <button
            onClick={() => scroll('left')}
            className={`${chevronBaseClasses} left-0 rounded-r-md`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex space-x-2 md:space-x-3 lg:space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[23vw] lg:w-[18.5vw] xl:w-[15.5vw] 2xl:w-[calc(100%/7-0.875rem)]">
              <ContentCard
                id={item.id}
                title={item.title}
                imageUrl={item.imageUrl}
                type={item.type} 
                isInMyList={item.isInMyList} // Pass isInMyList to ContentCard
                onClick={onCardClick ? () => onCardClick(item.id, item.type) : undefined}
                onPlay={onPlay ? () => onPlay(item.id) : undefined}
                // ContentCard's onMyListToggle expects (id, currentStatus, type?)
                // The onMyList from props is (id, currentStatus, type)
                onMyListToggle={onMyList ? () => onMyList(item.id, !!item.isInMyList, item.type) : undefined}
              />
            </div>
          ))}
        </div>

        {canScroll && !isAtEnd && (
          <button
            onClick={() => scroll('right')}
            className={`${chevronBaseClasses} right-0 rounded-l-md`}
            aria-label="Scroll right"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </Container>
  );
};

export default ContentRow;
