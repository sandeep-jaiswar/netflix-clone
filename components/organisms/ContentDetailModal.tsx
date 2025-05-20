'use client';

import React, { useEffect, useCallback } from 'react';
import {
  Button,
  Heading,
  Text,
  Logo,
} from '@/components/atoms';
import { X, PlayCircle, PlusCircle, CheckCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

interface DetailedContent {
  id: string;
  title: string;
  description?: string; 
  type: 'MOVIE' | 'SHOW';
  releaseDate?: Date | string;
  durationMinutes?: number;
  ageRating?: string | null; 
  imageUrl?: string | null; // Aligned with TmdbDetailedContent (was thumbnailUrl)
  heroImageUrl?: string | null; 
  previewVideoUrl?: string | null; // Changed to allow null
  isInMyList?: boolean; 
}

interface ContentDetailModalProps {
  content: DetailedContent | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (id: string) => void;
  onMyListToggle: (id: string, isInMyList: boolean) => void;
  similarItems?: { id: string; title: string }[]; 
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  content,
  isOpen,
  onClose,
  onPlay,
  onMyListToggle,
  similarItems = [],
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement;

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        const focusableElements =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.querySelector('[role="dialog"]');
        const firstFocusable = modal?.querySelector(focusableElements) as HTMLElement;
        firstFocusable?.focus();
      }, 50);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
      previouslyFocused?.focus?.();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !content) return null;

  const isInMyList = content.isInMyList ?? false; 
  const releaseYear = content.releaseDate ? new Date(content.releaseDate).getFullYear() : 'N/A';

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-0 md:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => {
        if (e.key !== 'Tab') return;
        const focusableElements =
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = e.currentTarget;
        const focusableContent = modal.querySelectorAll(focusableElements);
        const first = focusableContent[0] as HTMLElement;
        const last = focusableContent[focusableContent.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }}
    >
      <div
        className="bg-[var(--color-netflix-gray-dark)] text-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto scrollbar-hide relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="icon"
          onClick={onClose}
          className="absolute top-3 right-3 z-50 bg-black/50 hover:bg-black/70 rounded-full text-white"
          aria-label="Close details"
        >
          <X size={28} />
        </Button>

        <div className="relative aspect-video bg-black">
          {content.heroImageUrl ? (
            <Image
              src={content.heroImageUrl}
              alt={`Backdrop for ${content.title}`}
              fill
              style={{ objectFit: 'cover' }}
              className="opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <Logo className="w-1/4 h-auto text-netflix-red-dark" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-netflix-gray-dark via-transparent to-transparent">
            <Heading as="h2" id="modal-title" variant="pageTitle" className="!text-2xl md:!text-3xl lg:!text-4xl text-shadow-lg mb-2 md:mb-4">
              {content.title}
            </Heading>
            <div className="flex space-x-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onPlay(content.id)}
                leftIcon={PlayCircle}
                className="bg-white hover:bg-opacity-90 text-black focus-visible:ring-white"
              >
                Play
              </Button>
              <Button
                variant="icon"
                size="lg"
                onClick={() => onMyListToggle(content.id, isInMyList)}
                aria-label={isInMyList ? 'Remove from My List' : 'Add to My List'}
                className="border-2 border-white/50 hover:border-white text-white bg-black/30 hover:bg-black/50 p-2.5"
              >
                {isInMyList ? <CheckCircle size={24} /> : <PlusCircle size={24} />}
              </Button>
              <Button
                variant="icon"
                size="lg"
                aria-label="Like"
                className="border-2 border-white/50 hover:border-white text-white bg-black/30 hover:bg-black/50 p-2.5"
              >
                <ThumbsUp size={24} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-3 text-sm mb-2 flex-wrap">
                <Text color="accent" weight="bold">97% Match</Text> {/* Placeholder */}
                <Text color="secondary">{releaseYear}</Text>
                {content.durationMinutes && (
                  <Text color="secondary">
                    {Math.floor(content.durationMinutes / 60)}h {content.durationMinutes % 60}m
                  </Text>
                )}
                {content.ageRating && (
                  <Text className="border border-white/40 px-1.5 py-0.5 text-xs rounded-sm">
                    {content.ageRating}
                  </Text>
                )}
                <Text className="border border-white/40 px-1.5 py-0.5 text-xs rounded-sm">HD</Text>
              </div>
              <Text variant="body" className="leading-relaxed">
                {content.description || 'No description available.'} 
              </Text>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <Text as="span" color="secondary">Cast: </Text>
                <Text as="span">Actor One, Actor Two, Actress Three</Text>
              </div>
              <div>
                <Text as="span" color="secondary">Genres: </Text>
                <Text as="span">Action, Sci-Fi, Thriller</Text>
              </div>
              <div>
                <Text as="span" color="secondary">This show is: </Text>
                <Text as="span">Exciting, Suspenseful</Text>
              </div>
            </div>
          </div>

          {content.type === 'SHOW' && (
            <div className="mt-6 md:mt-8">
              <Heading as="h3" variant="sectionTitle" className="!text-xl mb-3">
                Episodes
              </Heading>
              <div className="p-4 border border-dashed border-netflix-gray rounded-md">
                <Text color="secondary">Episode selection UI placeholder.</Text>
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-8">
            <Heading as="h3" variant="sectionTitle" className="!text-xl mb-3">
              More Like This
            </Heading>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
              {similarItems.length > 0 ? (
                similarItems.map(item => (
                  <div
                    key={item.id}
                    className="aspect-video bg-netflix-gray flex items-center justify-center rounded-md"
                  >
                    <Text color="secondary" variant="small">
                      {item.title}
                    </Text>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-secondary">
                  No recommendations available.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-6 border-t border-netflix-gray">
            <Heading as="h3" variant="sectionTitle" className="!text-xl mb-3">
              About <Text as="span" weight="bold">{content.title}</Text>
            </Heading>
            <div className="space-y-1 text-sm">
              <div>
                <Text as="span" color="secondary">Creator: </Text>
                <Text>Director Name</Text>
              </div>
              <div>
                <Text as="span" color="secondary">Cast: </Text>
                <Text>Full Cast List...</Text>
              </div>
              <div>
                <Text as="span" color="secondary">Genres: </Text>
                <Text>Full Genre List...</Text>
              </div>
              <div>
                <Text as="span" color="secondary">Maturity rating: </Text>
                <Text>{content.ageRating || 'Not Rated'}. Recommended for certain ages.</Text>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;
