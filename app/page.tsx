'use client';

import React, { useState } from 'react';
import { ContentDetailModal } from '@/components/organisms';
import { BrowsePageTemplate } from '@/components/templates';

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
    items: [
      { id: 'content-1', title: 'Content 1', imageUrl: 'https://via.placeholder.com/500x281/FF0000/FFFFFF?text=Content+1' },
      { id: 'content-2', title: 'Content 2', imageUrl: 'https://via.placeholder.com/500x281/00FF00/000000?text=Content+2' },
      { id: 'content-3', title: 'Content 3', imageUrl: 'https://via.placeholder.com/500x281/0000FF/FFFFFF?text=Content+3' },
      { id: 'content-4', title: 'Content 4', imageUrl: 'https://via.placeholder.com/500x281/FFFF00/000000?text=Content+4' },
      { id: 'content-5', title: 'Content 5', imageUrl: 'https://via.placeholder.com/500x281/FF00FF/FFFFFF?text=Content+5' },
      { id: 'content-6', title: 'Content 6', imageUrl: 'https://via.placeholder.com/500x281/00FFFF/000000?text=Content+6' },
      { id: 'content-7', title: 'Content 7', imageUrl: 'https://via.placeholder.com/500x281/E50914/FFFFFF?text=Content+7' },
    ],
  },
  {
    id: 'new-releases',
    title: 'New Releases',
    items: [
      { id: 'content-8', title: 'Content 8', imageUrl: 'https://via.placeholder.com/500x281/333333/FFFFFF?text=Content+8' },
      { id: 'content-9', title: 'Content 9', imageUrl: 'https://via.placeholder.com/500x281/555555/FFFFFF?text=Content+9' },
    ],
  },
    {
    id: 'comedies',
    title: 'Comedies',
    items: [
      { id: 'content-10', title: 'Comedy 1', imageUrl: 'https://via.placeholder.com/500x281/FFA500/000000?text=Comedy+1' },
      { id: 'content-11', title: 'Comedy 2', imageUrl: 'https://via.placeholder.com/500x281/FFC0CB/000000?text=Comedy+2' },
    ],
  },
];

const mockSelectedContentData = {
    id: 'content-1',
    title: 'Content 1 Detailed View',
    description: 'This is a much longer and more detailed description for Content 1. It explains the plot, characters, and themes. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    type: 'MOVIE' as 'MOVIE' | 'SHOW',
    releaseDate: new Date('2023-01-15'),
    durationMinutes: 125,
    ageRating: 'PG-13',
    thumbnailUrl: 'https://via.placeholder.com/500x281/FF0000/FFFFFF?text=Content+1',
    heroImageUrl: 'https://via.placeholder.com/1280x720/FF0000/FFFFFF?text=Content+1+Modal+Hero',
    previewVideoUrl: 'your_preview_video.mp4',
    // isInMyList: true, 
};

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, setCurrentModalContent] = useState<typeof mockSelectedContentData | null>(null);

  const handleCardClick = (contentId: string) => {
    console.log(`Card clicked: ${contentId}. Opening modal...`);
    const clickedItem = mockCategories.flatMap(cat => cat.items).find(item => item.id === contentId);
    setCurrentModalContent({
        ...mockSelectedContentData,
        id: contentId,
        title: clickedItem ? `${clickedItem.title} - Details` : 'Detailed View',
        heroImageUrl: clickedItem ? clickedItem.imageUrl.replace('500x281', '1280x720').replace('Content', 'Modal%20Hero') : mockSelectedContentData.heroImageUrl,
    });
    setIsModalOpen(true);
  };

  const handlePlayHero = (heroId: string) => {
    console.log(`Play hero: ${heroId}`);
  };
  
  const handleMoreInfoHero = (heroId: string) => {
    console.log(`More info hero: ${heroId}`);
    setCurrentModalContent({
        ...mockSelectedContentData,
        id: heroId,
        title: `${mockHeroData.title} - Details`,
        description: mockHeroData.description,
        heroImageUrl: mockHeroData.backgroundImageUrl.replace('1920x1080', '1280x720').replace('Hero+Background','Hero+Modal+Detail'),
    });
    setIsModalOpen(true);
  };

  const handlePlayContent = (contentId: string) => {
    console.log(`Play content: ${contentId}`);
  };

  const handleMyListContent = (contentId: string) => {
    console.log(`Toggle My List for content: ${contentId}`);
    if (currentModalContent && currentModalContent.id === contentId) {
        console.log("My List status would be toggled here.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModalContent(null);
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
          onPlay={(id) => console.log(`Play from modal: ${id}`)}
          onMyListToggle={(id, isInMyList) => {
            console.log(`Toggle My List from modal for: ${id}. Currently in list: ${isInMyList}`);
             if (currentModalContent && currentModalContent.id === id) {
                console.log("My List status would be toggled from modal.");
            }
          }}
        />
      )}
    </>
  );
}
