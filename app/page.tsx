'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BrowsePageTemplate } from '@/components/templates';
import { ContentDetailModal } from '@/components/organisms';
import { TmdbContentItem, TmdbDetailedContent, TmdbApiListResponse } from '@/types/tmdb';

interface PageCategory {
  id: string;
  title: string;
  items: TmdbContentItem[];
}

interface PageHeroData {
  id: string;
  title: string;
  description: string;
  backgroundImageUrl: string;
  type?: 'movie' | 'tv'; // Added to assist with play/more info clicks
}

export default function HomePage() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, setCurrentModalContent] = useState<TmdbDetailedContent | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const trendingResponse = await fetch('/api/tmdb/trending?mediaType=all&timeWindow=day&page=1');
        if (!trendingResponse.ok) throw new Error(`Failed to fetch trending: ${trendingResponse.statusText}`);
        const trendingData: TmdbApiListResponse<TmdbContentItem> = await trendingResponse.json();

        if (trendingData.results && trendingData.results.length > 0) {
          const firstTrending = trendingData.results[0];
          setHeroData({
            id: firstTrending.id,
            title: firstTrending.title,
            description: firstTrending.description || 'No description available.',
            backgroundImageUrl: firstTrending.backdropUrl || firstTrending.imageUrl || 'https://via.placeholder.com/1920x1080?text=No+Hero+Image',
            type: firstTrending.type || 'movie', // Default to movie if type is missing
          });
        } else {
           setHeroData({
            id: 'fallback-hero',
            title: 'Welcome to Netflix Clone',
            description: 'Explore a world of entertainment.',
            backgroundImageUrl: 'https://via.placeholder.com/1920x1080/111/fff?text=NETFLIX',
            type: 'movie',
          });
        }

        const categoriesToFetch = [
          { id: 'trending-movies-week', title: 'Trending Movies This Week', endpoint: '/api/tmdb/trending?mediaType=movie&timeWindow=week&page=1' },
          { id: 'trending-tv-week', title: 'Trending TV Shows This Week', endpoint: '/api/tmdb/trending?mediaType=tv&timeWindow=week&page=1' },
        ];

        const fetchedCategories: PageCategory[] = [];
        for (const cat of categoriesToFetch) {
          const catResponse = await fetch(cat.endpoint);
          if (catResponse.ok) {
            const catData: TmdbApiListResponse<TmdbContentItem> = await catResponse.json();
            if(catData.results && catData.results.length > 0) {
                fetchedCategories.push({ id: cat.id, title: cat.title, items: catData.results });
            }
          } else {
            console.warn(`Failed to fetch category: ${cat.title}`);
          }
        }
        setCategories(fetchedCategories);

      } catch (e) {
        console.error("Error fetching page data:", e);
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = useCallback(async (contentId: string, contentTypeFromCard?: 'movie' | 'tv') => {
    let resolvedContentType = contentTypeFromCard;
    if (!resolvedContentType) {
        const itemFromCategories = categories.flatMap(c => c.items).find(i => i.id === contentId);
        resolvedContentType = itemFromCategories?.type || 'movie';
    }

    console.log(`Card clicked: ${contentId} (Type: ${resolvedContentType}). Opening modal...`);
    setIsModalOpen(true);
    setIsModalLoading(true);
    setCurrentModalContent(null);

    try {
      const response = await fetch(`/api/tmdb/details/${resolvedContentType}/${contentId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch details for ${contentId}`);
      }
      const data: TmdbDetailedContent = await response.json();
      setCurrentModalContent(data);
    } catch (e) {
      console.error("Error fetching modal data:", e);
      setCurrentModalContent({
          id: contentId,
          title: "Error Loading Details",
          description: e instanceof Error ? e.message : "Could not load content details.",
          type: resolvedContentType.toUpperCase() as 'MOVIE' | 'SHOW',
          heroImageUrl: 'https://via.placeholder.com/1280x720/000/fff?text=Error',
      });
    } finally {
      setIsModalLoading(false);
    }
  }, [categories]);

  const handlePlayHero = (heroId: string) => {
    console.log(`Play hero: ${heroId}`);
    if (heroData?.type) handleCardClick(heroId, heroData.type);
  };
  
  const handleMoreInfoHero = (heroId: string) => {
    console.log(`More info hero: ${heroId}`);
    if (heroData?.type) handleCardClick(heroId, heroData.type);
  };

  const handlePlayContent = (contentId: string) => {
    console.log(`Play content directly: ${contentId}`);
  };

  const handleMyListContent = (contentId: string) => {
    console.log(`Toggle My List for content: ${contentId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModalContent(null);
  };

  if (isLoading && !heroData) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-white"><p>Loading Netflix...</p></div>;
  }

  if (error) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-red-500"><p>Error: {error}</p></div>;
  }
  
  if (!heroData) {
      return <div className="h-screen w-screen flex items-center justify-center bg-background text-white"><p>Could not load critical data.</p></div>;
  }

  return (
    <>
      <BrowsePageTemplate
        heroData={heroData}
        categories={categories}
        onCardClick={(id) => {
            let itemType: 'movie' | 'tv' | undefined = undefined;
            for (const category of categories) {
                const foundItem = category.items.find(item => item.id === id);
                if (foundItem && foundItem.type) {
                    itemType = foundItem.type;
                    break;
                }
            }
            handleCardClick(id, itemType || 'movie');
        }}
        onPlayHero={handlePlayHero}
        onMoreInfoHero={handleMoreInfoHero}
        onPlayContent={handlePlayContent}
        onMyListContent={handleMyListContent}
      />
      
      {isModalOpen && (
        <ContentDetailModal
          content={isModalLoading ? {id: 'loading', title: 'Loading...', description: '', type: 'MOVIE', heroImageUrl: ''} : currentModalContent}
          isOpen={isModalOpen}
          onClose={closeModal}
          onPlay={(id) => console.log(`Play from modal: ${id}`)}
          onMyListToggle={(id, isInMyList) => {
            console.log(`Toggle My List from modal for: ${id}. Currently in list: ${isInMyList}`);
          }}
        />
      )}
    </>
  );
}
