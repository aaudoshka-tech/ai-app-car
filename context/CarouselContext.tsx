import { createContext, useContext, useState, ReactNode } from 'react';
import { SelectedPhoto, RankedPhoto } from '@/types/photo';

interface CarouselContextValue {
  photos: SelectedPhoto[];
  setPhotos: (photos: SelectedPhoto[]) => void;
  removePhoto: (id: string) => void;
  rankedPhotos: RankedPhoto[];
  setRankedPhotos: (photos: RankedPhoto[]) => void;
  carouselOrder: RankedPhoto[];
  setCarouselOrder: (photos: RankedPhoto[]) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  reset: () => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function CarouselProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotosState] = useState<SelectedPhoto[]>([]);
  const [rankedPhotos, setRankedPhotos] = useState<RankedPhoto[]>([]);
  const [carouselOrder, setCarouselOrder] = useState<RankedPhoto[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const setPhotos = (p: SelectedPhoto[]) => setPhotosState(p);

  const removePhoto = (id: string) => {
    setPhotosState((prev) => prev.filter((p) => p.id !== id));
  };

  const reset = () => {
    setPhotosState([]);
    setRankedPhotos([]);
    setCarouselOrder([]);
    setIsAnalyzing(false);
  };

  return (
    <CarouselContext.Provider
      value={{
        photos,
        setPhotos,
        removePhoto,
        rankedPhotos,
        setRankedPhotos,
        carouselOrder,
        setCarouselOrder,
        isAnalyzing,
        setIsAnalyzing,
        reset,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
}

export function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error('useCarousel must be used within CarouselProvider');
  return ctx;
}
