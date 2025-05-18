import React from 'react';
import { Heading, Text, Button, Container } from '@/components/atoms';
import { PlayCircle, Info } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  description: string;
  backgroundImageUrl: string;
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  backgroundImageUrl,
  onPlay,
  onMoreInfo,
}) => {
  return (
    <div className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] xl:h-[95vh] 2xl:h-screen text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>

      <Container className="relative z-10 flex flex-col justify-center h-full pt-20 md:pt-24 lg:pt-32">
        <div className="max-w-md lg:max-w-xl xl:max-w-2xl space-y-4 md:space-y-6">
          <Heading
            as="h1"
            variant="pageTitle"
            className="!text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl text-shadow-lg"
            color="white"
          >
            {title}
          </Heading>
          <Text variant="body" color="white" className="text-shadow-md line-clamp-3 md:line-clamp-4 lg:line-clamp-5 text-base sm:text-lg">
            {description}
          </Text>
          <div className="flex space-x-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onPlay}
              leftIcon={PlayCircle}
              className="bg-white hover:bg-opacity-90 text-black focus-visible:ring-white"
            >
              Play
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onMoreInfo}
              leftIcon={Info}
              className="bg-gray-500/70 hover:bg-gray-500/50 text-white focus-visible:ring-gray-400"
            >
              More Info
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
