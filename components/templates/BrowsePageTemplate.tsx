import React from 'react';
import { Header, HeroSection, ContentRow, Footer } from '@/components/organisms';

interface HeroContent {
  id: string;
  title: string;
  description: string;
  backgroundImageUrl: string;
}

interface ContentItem {
  id: string;
  title: string;
  imageUrl: string | null;
  type: 'movie' | 'tv'; 
  isInMyList?: boolean; // Added for My List status
}

interface ContentCategory {
  id: string;
  title: string;
  items: ContentItem[];
}

interface BrowsePageTemplateProps {
  heroData: HeroContent;
  categories: ContentCategory[];
  onCardClick: (contentId: string, contentType: 'movie' | 'tv') => void; 
  onPlayHero: (heroId: string) => void;
  onMoreInfoHero: (heroId: string) => void;
  onPlayContent: (contentId: string) => void; // Assuming play doesn't need more args here
  onMyListContent: (contentId: string, currentStatus: boolean, contentType: 'movie' | 'tv') => void; // Updated signature
}

const BrowsePageTemplate: React.FC<BrowsePageTemplateProps> = ({
  heroData,
  categories,
  onCardClick,
  onPlayHero,
  onMoreInfoHero,
  onPlayContent,
  onMyListContent,
}) => {
  return (
    <div className="bg-[var(--color-background)] min-h-screen flex flex-col">
      <Header currentUser={{
        email: "test@test.com",
        imageUrl: "",
        name: "Test User"
      }} onSignOut={() => {}} />

      <main className="flex-grow">
        <HeroSection
          title={heroData.title}
          description={heroData.description}
          backgroundImageUrl={heroData.backgroundImageUrl}
          onPlay={() => onPlayHero(heroData.id)}
          onMoreInfo={() => onMoreInfoHero(heroData.id)}
        />

        <div className="py-4 md:py-8 lg:py-12 space-y-8 md:space-y-12 lg:space-y-16">
          {categories.map((category) => (
            <ContentRow
              key={category.id}
              title={category.title}
              items={category.items}
              onCardClick={onCardClick} 
              onPlay={onPlayContent}
              onMyList={onMyListContent} // Passed down
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePageTemplate;
