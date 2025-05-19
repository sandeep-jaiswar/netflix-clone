'use client';

import React, { useState } from 'react';
import { ContentDetailModal } from '@/components/organisms';
import { BrowsePageTemplate } from '@/components/templates';

// --- Types ---
type ContentData = {
  id: string;
  title: string;
  description: string;
  type: 'MOVIE' | 'SHOW';
  releaseDate: Date;
  durationMinutes: number;
  ageRating: string;
  thumbnailUrl: string;
  heroImageUrl: string;
  previewVideoUrl: string;
};

// --- Mock Data ---
const mockHeroData = {
  id: 'hero-123',
  title: 'Featured Movie Title',
  description:
    'This is a captivating description of the featured movie or show. It draws the audience in and makes them want to watch. Thrills, drama, and excitement await!',
  backgroundImageUrl: 'https://via.placeholder.com/1920x1080/222222/FFFFFF?text=Hero+Background',
};

const mockCategories = [
  {
    id: 'trending-now',
    title: 'Trending Now',
    items: Array.from({ length: 7 }, (_, i) => ({
      id: `content-${i + 1}`,
      title: `Content ${i + 1}`,
      imageUrl: `https://via.placeholder.com/500x281/000000/FFFFFF?text=Content+${i + 1}`,
    })),
  },
  {
    id: 'new-releases',
    title: 'New Releases',
    items: [
      {
        id: 'content-8',
        title: 'Content 8',
        imageUrl: 'https://via.placeholder.com/500x281/333333/FFFFFF?text=Content+8',
      },
      {
        id: 'content-9',
        title: 'Content 9',
        imageUrl: 'https://via.placeholder.com/500x281/555555/FFFFFF?text=Content+9',
      },
    ],
  },
  {
    id: 'comedies',
    title: 'Comedies',
    items: [
      {
        id: 'content-10',
        title: 'Comedy 1',
        imageUrl: 'https://via.placeholder.com/500x281/FFA500/000000?text=Comedy+1',
      },
      {
        id: 'content-11',
        title: 'Comedy 2',
        imageUrl: 'https://via.placeholder.com/500x281/FFC0CB/000000?text=Comedy+2',
      },
    ],
  },
];

const baseContent: ContentData = {
  id: 'content-1',
  title: 'Content 1 Detailed View',
  description:
    'This is a detailed description for Content 1. It explains the plot, characters, and themes.',
  type: 'MOVIE',
  releaseDate: new Date('2023-01-15'),
  durationMinutes: 125,
  ageRating: 'PG-13',
  thumbnailUrl: 'https://via.placeholder.com/500x281/FF0000/FFFFFF?text=Content+1',
  heroImageUrl: 'https://via.placeholder.com/1280x720/FF0000/FFFFFF?text=Content+1+Modal+Hero',
  previewVideoUrl: 'your_preview_video.mp4',
};

// --- Helper Functions ---
function generateModalImageUrl(thumbnailUrl: string) {
  return thumbnailUrl
    .replace('500x281', '1280x720')
    .replace('Content', 'Modal%20Hero');
}

function generateHeroModalImageUrl(backgroundUrl: string) {
  return backgroundUrl
    .replace('1920x1080', '1280x720')
    .replace('Hero+Background', 'Hero+Modal+Detail');
}

// --- Component ---
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, setCurrentModalContent] = useState<ContentData | null>(null);

  const handleCardClick = (contentId: string) => {
    console.log(`Card clicked: ${contentId}`);
    const clickedItem = mockCategories.flatMap(cat => cat.items).find(item => item.id === contentId);

    if (!clickedItem) return;

    setCurrentModalContent({
      ...baseContent,
      id: clickedItem.id,
      title: `${clickedItem.title} - Details`,
      heroImageUrl: generateModalImageUrl(clickedItem.imageUrl),
    });
    setIsModalOpen(true);
  };

  const handleMoreInfoHero = (heroId: string) => {
    console.log(`More info hero: ${heroId}`);
    setCurrentModalContent({
      ...baseContent,
      id: heroId,
      title: `${mockHeroData.title} - Details`,
      description: mockHeroData.description,
      heroImageUrl: generateHeroModalImageUrl(mockHeroData.backgroundImageUrl),
    });
    setIsModalOpen(true);
  };

  const handlePlayHero = (heroId: string) => {
    console.log(`Play hero: ${heroId}`);
  };

  const handlePlayContent = (contentId: string) => {
    console.log(`Play content: ${contentId}`);
  };

  const handleMyListContent = (contentId: string) => {
    console.log(`Toggle My List for content: ${contentId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModalContent(null);
  };

  const handlePlayFromModal = (id: string) => {
    console.log(`Play from modal: ${id}`);
  };

  const handleMyListFromModal = (id: string, isInMyList: boolean) => {
    console.log(`Toggle My List from modal: ${id}, isInMyList: ${isInMyList}`);
  };

  return (
    <>
      <BrowsePageTemplate
        heroData={mockHeroData}
        categories={mockCategories}
        onCardClick={handleCardClick}
        onPlayHero={handlePlayHero}
        onMoreInfoHero={handleMoreInfoHero}
        onPlayContent={handlePlayContent}
        onMyListContent={handleMyListContent}
      />

      {isModalOpen && currentModalContent && (
        <ContentDetailModal
          content={currentModalContent}
          isOpen={isModalOpen}
          onClose={closeModal}
          onPlay={handlePlayFromModal}
          onMyListToggle={handleMyListFromModal}
        />
      )}
    </>
  );
}
