import { useEditor } from '@/context/EditorContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Timeline() {
  const { state, dispatch } = useEditor();
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio element
  useEffect(() => {
    if (state.audio.url) {
      if (!audioRef.current) {
        audioRef.current = new Audio(state.audio.url);
      } else if (audioRef.current.src !== state.audio.url) {
        audioRef.current.src = state.audio.url;
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [state.audio.url]);

  useEffect(() => {
    if (state.isPlaying) {
      const startTime = performance.now();
      const startOffset = state.currentTime;

      // Play audio
      if (audioRef.current) {
        audioRef.current.currentTime = startOffset;
        audioRef.current.play().catch(() => {});
      }

      const tick = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const newTime = startOffset + elapsed;
        if (newTime >= state.duration) {
          dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
          dispatch({ type: 'SET_PLAYING', payload: false });
          if (audioRef.current) audioRef.current.pause();
          return;
        }
        dispatch({ type: 'SET_CURRENT_TIME', payload: newTime });
        intervalRef.current = requestAnimationFrame(tick);
      };
      intervalRef.current = requestAnimationFrame(tick);
    } else {
      if (audioRef.current) audioRef.current.pause();
    }
    return () => {
      if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
    };
  }, [state.isPlaying, state.duration]);

  const togglePlay = () => dispatch({ type: 'SET_PLAYING', payload: !state.isPlaying });
  const reset = () => {
    dispatch({ type: 'SET_PLAYING', payload: false });
    dispatch({ type: 'SET_CURRENT_TIME', payload: 0 });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (t: number) => {
    const s = Math.floor(t);
    const ms = Math.floor((t - s) * 10);
    return `${s}.${ms}s`;
  };

  const hasAudio = state.audio.waveformData.length > 0;
  const hasBeats = state.audio.beats.length > 0;

  return (
    <div className="border-t border-border" style={{ background: 'hsl(var(--timeline-bg))' }}>
      {/* Waveform display */}
      {hasAudio && (
        <div className="relative h-12 mx-16 mt-1">
          <WaveformDisplay
            waveformData={state.audio.waveformData}
            beats={state.audio.beats}
            duration={state.duration}
            currentTime={state.currentTime}
          />
        </div>
      )}

      <div className="h-14 flex items-center gap-3 px-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={togglePlay}>
            {state.isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
        </div>

        <span className="text-xs text-muted-foreground font-mono w-10">{formatTime(state.currentTime)}</span>

        <div className="flex-1 relative">
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
          {/* Beat markers on slider */}
          {hasBeats && (
            <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
              {state.audio.beats
                .filter(b => b <= state.duration)
                .map((beat, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full w-0.5 rounded-full"
                    style={{
                      left: `${(beat / state.duration) * 100}%`,
                      background: 'hsl(var(--accent) / 0.4)',
                    }}
                  />
                ))}
            </div>
          )}
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
    </div>
  );
}

function WaveformDisplay({
  waveformData,
  beats,
  duration,
  currentTime,
}: {
  waveformData: number[];
  beats: number[];
  duration: number;
  currentTime: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Draw waveform bars
    const barCount = waveformData.length;
    const barWidth = w / barCount;
    const progressRatio = currentTime / duration;

    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth;
      const barH = waveformData[i] * h * 0.8;
      const isPast = (i / barCount) < progressRatio;

      ctx.fillStyle = isPast
        ? 'hsl(262, 83%, 58%)'
        : 'hsl(220, 9%, 30%)';
      ctx.fillRect(x, h / 2 - barH / 2, Math.max(1, barWidth - 0.5), barH);
    }

    // Draw beat markers
    for (const beat of beats) {
      if (beat > duration) continue;
      const x = (beat / duration) * w;
      ctx.fillStyle = 'hsl(173, 80%, 40%)';
      ctx.fillRect(x - 1, 0, 2, h);
    }

    // Playhead
    const playX = progressRatio * w;
    ctx.fillStyle = 'hsl(0, 0%, 100%)';
    ctx.fillRect(playX - 1, 0, 2, h);
  }, [waveformData, beats, duration, currentTime]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={48}
      className="w-full h-full rounded"
      style={{ opacity: 0.8 }}
    />
  );
}
