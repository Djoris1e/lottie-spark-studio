import { useEditor } from '@/context/EditorContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Timeline() {
  const { state, dispatch } = useEditor();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.isPlaying) {
      const startTime = performance.now();
      const startOffset = state.currentTime;

      const tick = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const newTime = startOffset + elapsed;
        if (newTime >= state.duration) {
          dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
          dispatch({ type: 'SET_PLAYING', payload: false });
          return;
        }
        dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
        intervalRef.current = requestAnimationFrame(tick);
      };
      intervalRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
    };
  }, [state.isPlaying, state.duration]);

  const togglePlay = () => dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
  const reset = () => {
    dispatch({ type: 'SET_PLAYING', payload: false });
    dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
  };

  const formatTime = (t: number) => {
    const s = Math.floor(t);
    const ms = Math.floor((t - s) * 10);
    return `${s}.${ms}s`;
  };

  return (
    <div className="h-16 border-t border-border flex items-center gap-3 px-4" style={{ background: 'hsl(var(--timeline-bg))' }}>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlay}>
          {state.isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <span className="text-xs text-muted-foreground font-mono w-10">{formatTime(state.currentTime)}</span>

      <div className="flex-1">
        <Slider
          min={0}
          max={state.duration}
          step={0.1}
          value={[state.currentTime]}
          onValueChange={([v]) => {
            dispatch({ type: 'SET_PLAYING', payload: false });
            dispatch({ type: 'SET_CURRENT_TIME', payload: v });
          }}
        />
      </div>

      <span className="text-xs text-muted-foreground font-mono w-10">{formatTime(state.duration)}</span>

      <div className="flex items-center gap-2 ml-2">
        <span className="text-xs text-muted-foreground">Duration:</span>
        <Slider
          className="w-24"
          min={1}
          max={30}
          step={1}
          value={[state.duration]}
          onValueChange={([v]) => dispatch({ type: 'SET_DURATION', payload: v })}
        />
        <span className="text-xs font-mono text-foreground w-6">{state.duration}s</span>
      </div>
    </div>
  );
}
