'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BrowsePageTemplate } from '@/components/templates';
import { ContentDetailModal } from '@/components/organisms';
import { TmdbContentItem, TmdbDetailedContent, TmdbApiListResponse } from '@/types/tmdb';

interface PageCategory {
  id: string;
  title: string;
  items: TmdbContentItem[];
  isLoading: boolean; // Added loading state for individual categories
}

interface PageHeroData {
  id: string;
  title: string;
  description: string;
  backgroundImageUrl: string;
  type: 'movie' | 'tv'; // Made type required for Hero, ensure it's always set
}

const initialCategoriesToFetch = [
  { id: 'trending-movies-week', title: 'Trending Movies', endpoint: '/api/tmdb/trending?mediaType=movie&timeWindow=week&page=1' },
  { id: 'trending-tv-week', title: 'Trending TV Shows', endpoint: '/api/tmdb/trending?mediaType=tv&timeWindow=week&page=1' },
  // Add more categories here if needed
];

export default function HomePage() {
  const [heroData, setHeroData] = useState<PageHeroData | null>(null);
  const [categories, setCategories] = useState<PageCategory[]>(
    initialCategoriesToFetch.map(cat => ({ ...cat, items: [], isLoading: true }))
  );
  const [isLoadingPage, setIsLoadingPage] = useState(true); // Overall page loading, primarily for hero
  const [pageError, setPageError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModalContent, setCurrentModalContent] = useState<TmdbDetailedContent | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoadingPage(true);
      setPageError(null);
      
      // Initialize categories with loading true
      setCategories(initialCategoriesToFetch.map(cat => ({ ...cat, items: [], isLoading: true })));

      try {
        // Fetch Hero Data
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
            type: firstItem.type, // TmdbContentItem.type is now required
          });
        } else {
           setHeroData({
            id: 'fallback-hero', title: 'Welcome', description: 'Explore movies and shows.',
            backgroundImageUrl: 'https://via.placeholder.com/1920x1080/111/fff?text=NETFLIX', type: 'movie',
          });
        }
        setIsLoadingPage(false); // Hero data loaded, main page structure can render

        // Fetch Categories in parallel
        initialCategoriesToFetch.forEach(async (catConfig) => {
          try {
            const catResponse = await fetch(catConfig.endpoint);
            let items: TmdbContentItem[] = [];
            if (catResponse.ok) {
              const catData: TmdbApiListResponse<TmdbContentItem> = await catResponse.json();
              if (catData.results && catData.results.length > 0) {
                items = catData.results.map(item => ({
                    ...item,
                    isInMyList: myListIds.has(item.id)
                }));
              }
            } else { 
              console.warn(`Failed to fetch category: ${catConfig.title} - ${catResponse.statusText}`); 
              // Keep items array empty for this category on error, isLoading will be set to false
            }
            setCategories(prevCategories => 
              prevCategories.map(prevCat => 
                prevCat.id === catConfig.id ? { ...prevCat, items, isLoading: false } : prevCat
              )
            );
          } catch (catError) { 
            console.error(`Error fetching category ${catConfig.title}:`, catError); 
            setCategories(prevCategories => 
              prevCategories.map(prevCat => 
                prevCat.id === catConfig.id ? { ...prevCat, items: [], isLoading: false } : prevCat
              )
            );
          }
        });

      } catch (e) {
        console.error("Error fetching page data:", e);
        setPageError(e instanceof Error ? e.message : 'An unknown error occurred');
        setIsLoadingPage(false); // Also stop loading on error
        // Set all categories to not loading on global page error
        setCategories(prev => prev.map(c => ({ ...c, isLoading: false }))); 
      }
    };
    fetchPageData();
  }, [myListIds]); // myListIds dependency is for re-calculating isInMyList on items

  const handleCardClick = useCallback(async (contentId: string, contentTypeFromCard: 'movie' | 'tv') => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setCurrentModalContent(null);
    try {
      const response = await fetch(`/api/tmdb/details/${contentTypeFromCard}/${contentId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response"}));
        throw new Error(errorData.error || `Failed to fetch details for ${contentId}`);
      }
      let data: TmdbDetailedContent = await response.json();
      data = { ...data, isInMyList: myListIds.has(data.id) };
      setCurrentModalContent(data);
    } catch (e) {
      console.error("Error fetching modal data:", e);
      setCurrentModalContent({
          id: contentId, title: "Error Loading Details",
          imageUrl: null, 
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
    setMyListIds(prev => {
      const newSet = new Set(prev);
      if (currentStatus) newSet.delete(contentId);
      else newSet.add(contentId);
      return newSet;
    });
    // Update modal content if it's the one being toggled
    if (currentModalContent && currentModalContent.id === contentId) {
        setCurrentModalContent(prev => prev ? ({ ...prev, isInMyList: !currentStatus }) : null);
    }
    // Update categories in place
    setCategories(prevCategories => prevCategories.map(cat => ({
        ...cat,
        items: cat.items.map(item => 
            item.id === contentId ? { ...item, isInMyList: !currentStatus } : item
        )
    })));
  }, [currentModalContent]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModalContent(null);
  };

  // Root loading UI will be handled by app/loading.tsx for the initial shell.
  // This handles loading state after the shell is visible, primarily for hero content.
  if (isLoadingPage && !heroData) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-white"><p>Preparing your experience...</p></div>;
  }
  if (pageError) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-red-500"><p>Error: {pageError}</p></div>;
  }
  // If heroData is still null after isLoadingPage is false, means it failed silently or returned no results.
  if (!heroData) {
      return <div className="h-screen w-screen flex items-center justify-center bg-background text-white"><p>Could not load primary content. Please try again later.</p></div>;
  }

  return (
    <>
      <BrowsePageTemplate
        heroData={heroData}
        categories={categories} // categories now include isLoading states for their rows
        onCardClick={handleCardClick} 
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
