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
  type?: 'movie' | 'tv';
}

export default function HomePage() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);
  const [categories, setCategories] = useState<PageCategory[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, setCurrentModalContent] = useState<TmdbDetailedContent | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingPage(true);
      setPageError(null);
      try {
        const heroApiResponse = await fetch('/api/tmdb/trending?mediaType=all&timeWindow=day&page=1');
        if (!heroApiResponse.ok) throw new Error(`Failed to fetch hero data: ${heroApiResponse.statusText}`);
        const heroApiData: TmdbApiListResponse<TmdbContentItem> = await heroApiResponse.json();

        if (heroApiData.results && heroApiData.results.length > 0) {
          const firstItem = heroApiData.results[0];
          setHeroData({
            id: firstItem.id,
            title: firstItem.title,
            description: firstItem.description || 'No description available.',
            backgroundImageUrl: firstItem.backdropUrl || firstItem.imageUrl || 'https://via.placeholder.com/1920x1080?text=No+Hero+Image',
            type: firstItem.type || 'movie',
          });
        } else {
           setHeroData({
            id: 'fallback-hero', title: 'Welcome', description: 'Explore movies and shows.',
            backgroundImageUrl: 'https://via.placeholder.com/1920x1080/111/fff?text=NETFLIX', type: 'movie',
          });
        }

        const categoriesToFetch = [
          { id: 'trending-movies-week', title: 'Trending Movies', endpoint: '/api/tmdb/trending?mediaType=movie&timeWindow=week&page=1' },
          { id: 'trending-tv-week', title: 'Trending TV Shows', endpoint: '/api/tmdb/trending?mediaType=tv&timeWindow=week&page=1' },
        ];

        const fetchedCategoriesPromises = categoriesToFetch.map(async (cat) => {
          try {
            const catResponse = await fetch(cat.endpoint);
            if (catResponse.ok) {
              const catData: TmdbApiListResponse<TmdbContentItem> = await catResponse.json();
              if (catData.results && catData.results.length > 0) {
                const itemsWithMyListStatus = catData.results.map(item => ({
                    ...item,
                    isInMyList: myListIds.has(item.id)
                }));
                return { id: cat.id, title: cat.title, items: itemsWithMyListStatus };
              }
            }
             else { console.warn(`Failed to fetch category: ${cat.title} - ${catResponse.statusText}`); }
          } catch (catError) { console.error(`Error fetching category ${cat.title}:`, catError); }
          return null;
        });
        
        const resolvedCategories = (await Promise.all(fetchedCategoriesPromises)).filter(Boolean) as PageCategory[];
        setCategories(resolvedCategories);

      } catch (e) {
        console.error("Error fetching page data:", e);
        setPageError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
        setIsLoadingPage(false);
      }
    };
    fetchData();
  }, [myListIds]);

  const handleCardClick = useCallback(async (contentId: string, contentTypeFromCard: 'movie' | 'tv') => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setCurrentModalContent(null);
    try {
      const response = await fetch(`/api/tmdb/details/${contentTypeFromCard}/${contentId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch details for ${contentId}`);
      }
      let data: TmdbDetailedContent = await response.json();
      data = { ...data, isInMyList: myListIds.has(data.id) };
      setCurrentModalContent(data);
    } catch (e) {
      console.error("Error fetching modal data:", e);
      setCurrentModalContent({
          id: contentId, 
          title: "Error Loading Details",
          imageUrl: null, // Added missing required property
          description: e instanceof Error ? e.message : "Could not load content details.",
          type: contentTypeFromCard.toUpperCase() as 'MOVIE' | 'SHOW',
          heroImageUrl: 'https://via.placeholder.com/1280x720/000/fff?text=Error',
          isInMyList: myListIds.has(contentId),
      });
    } finally {
      setIsModalLoading(false);
    }
  }, [myListIds]);

  const handlePlayHero = (heroId: string) => {
    if (heroData?.type) handleCardClick(heroId, heroData.type);
  };
  
  const handleMoreInfoHero = (heroId: string) => {
    if (heroData?.type) handleCardClick(heroId, heroData.type);
  };

  const handlePlayContent = (contentId: string) => { console.log("Play content: ", contentId); };

  const handleMyListToggle = useCallback((contentId: string, currentStatus: boolean) => {
    console.log(`Toggling My List for ${contentId}. Was in list: ${currentStatus}`);
    setMyListIds(prev => {
      const newSet = new Set(prev);
      if (currentStatus) newSet.delete(contentId);
      else newSet.add(contentId);
      return newSet;
    });
    if (currentModalContent && currentModalContent.id === contentId) {
        setCurrentModalContent(prev => prev ? ({ ...prev, isInMyList: !currentStatus }) : null);
    }
  }, [currentModalContent]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModalContent(null);
  };

  if (isLoadingPage && !heroData) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-white"><p>Loading Netflix...</p></div>;
  }
  if (pageError) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-red-500"><p>Error: {pageError}</p></div>;
  }
  if (!heroData) {
      return <div className="h-screen w-screen flex items-center justify-center bg-background text-white"><p>Could not load page data.</p></div>;
  }

  return (
    <>
      <BrowsePageTemplate
        heroData={heroData}
        categories={categories}
        onCardClick={handleCardClick} // Type is now expected from ContentRow
        onPlayHero={handlePlayHero}
        onMoreInfoHero={handleMoreInfoHero}
        onPlayContent={handlePlayContent}
        onMyListContent={handleMyListToggle}
      />
      
      {isModalOpen && (
        <ContentDetailModal
          content={isModalLoading ? {id: 'loading', title: 'Loading...', imageUrl: null, description: '', type: 'MOVIE', heroImageUrl: '', isInMyList: false} : currentModalContent}
          isOpen={isModalOpen}
          onClose={closeModal}
          onPlay={(id) => console.log(`Play from modal: ${id}`)}
          onMyListToggle={handleMyListToggle}
        />
      )}
    </>
  );
}
