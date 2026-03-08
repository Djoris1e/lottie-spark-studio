import { useRef, useEffect, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { Plus } from 'lucide-react';
import { LottieAnimationData } from '@/types/editor';

interface AnimationCardProps {
  animation: LottieAnimationData;
  onAdd: (anim: LottieAnimationData) => void;
}

export function AnimationCard({ animation, onAdd }: AnimationCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Timeout to mark as error if never loads
    const timeout = setTimeout(() => {
      if (!loaded) setError(true);
    }, 8000);

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: animation.url,
      });
      
      animRef.current.addEventListener('DOMLoaded', () => {
        setLoaded(true);
        clearTimeout(timeout);
      });
      animRef.current.addEventListener('error', () => {
        setError(true);
        clearTimeout(timeout);
      });
    } catch {
      setError(true);
      clearTimeout(timeout);
    }

    return () => {
      clearTimeout(timeout);
      animRef.current?.destroy();
    };
  }, [animation.url]);

  const handleMouseEnter = () => animRef.current?.play();
  const handleMouseLeave = () => {
    animRef.current?.pause();
    animRef.current?.goToAndStop(0, true);
  };

  if (error) {
    return (
      <div
        className="group relative rounded-lg border border-border bg-secondary/30 overflow-hidden cursor-pointer hover:border-primary/50 transition-all opacity-50"
        onClick={() => onAdd(animation)}
      >
        <div className="aspect-square relative flex items-center justify-center">
          <span className="text-muted-foreground text-[10px] text-center px-2">{animation.name}</span>
        </div>
        <div className="p-1.5 border-t border-border">
          <p className="text-xs text-foreground truncate">{animation.name}</p>
          <p className="text-[10px] text-destructive">Unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative rounded-lg border border-border bg-secondary/50 overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:glow-primary"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onAdd(animation)}
    >
      <div className="aspect-square relative">
        <div ref={containerRef} className="absolute inset-0 p-2" />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="p-1.5 border-t border-border">
        <p className="text-xs text-foreground truncate">{animation.name}</p>
        <p className="text-[10px] text-muted-foreground capitalize">{animation.category}</p>
      </div>
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
          <Plus className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}
