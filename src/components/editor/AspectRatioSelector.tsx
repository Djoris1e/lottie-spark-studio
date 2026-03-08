import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Monitor, Smartphone, Square } from 'lucide-react';
import { AspectRatioPreset, ASPECT_RATIOS } from '@/types/editor';

const RATIO_ICONS: Record<AspectRatioPreset, React.ReactNode> = {
  '9:16': <Smartphone className="h-3.5 w-3.5" />,
  '1:1': <Square className="h-3.5 w-3.5" />,
  '16:9': <Monitor className="h-3.5 w-3.5" />,
};

export function AspectRatioSelector() {
  const { state, dispatch } = useEditor();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="text-xs gap-1.5">
          {RATIO_ICONS[state.aspectRatio]}
          {state.aspectRatio}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-card border-border p-2">
        <div className="space-y-1">
          {(Object.entries(ASPECT_RATIOS) as [AspectRatioPreset, typeof ASPECT_RATIOS['9:16']][]).map(([key, config]) => (
            <button
              key={key}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                state.aspectRatio === key ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-foreground'
              }`}
              onClick={() => dispatch({ type: 'SET_ASPECT_RATIO', payload: key })}
            >
              {RATIO_ICONS[key]}
              <div className="text-left">
                <div className="font-medium">{config.label}</div>
                <div className="opacity-60 text-[10px]">{config.description} • {config.width}×{config.height}</div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
