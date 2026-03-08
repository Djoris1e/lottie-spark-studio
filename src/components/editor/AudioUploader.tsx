import { useRef, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Music, X, Loader2, Zap } from 'lucide-react';
import { analyzeAudio } from '@/lib/audioAnalyzer';

export function AudioUploader() {
  const { state, dispatch } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    dispatch({ type: 'SET_AUDIO', payload: { file, url, isAnalyzing: true } });
    setAnalyzing(true);

    try {
      const result = await analyzeAudio(file);
      dispatch({
        type: 'SET_AUDIO',
        payload: {
          waveformData: result.waveformData,
          beats: result.beats,
          duration: result.duration,
          isAnalyzing: false,
        },
      });
      // Auto-adjust video duration to match audio if longer
      if (result.duration > state.duration) {
        dispatch({ type: 'SET_DURATION', payload: Math.min(30, Math.ceil(result.duration)) });
      }
    } catch (err) {
      console.error('Audio analysis failed:', err);
      dispatch({ type: 'SET_AUDIO', payload: { isAnalyzing: false } });
    }
    setAnalyzing(false);
    e.target.value = '';
  };

  const handleClear = () => {
    if (state.audio.url) URL.revokeObjectURL(state.audio.url);
    dispatch({ type: 'CLEAR_AUDIO' });
  };

  if (state.audio.file) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-xs">
          <Music className="h-3 w-3 text-accent" />
          <span className="truncate max-w-[100px] text-foreground">{state.audio.file.name}</span>
          {analyzing && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
          {!analyzing && state.audio.beats.length > 0 && (
            <span className="text-accent flex items-center gap-0.5">
              <Zap className="h-3 w-3" />
              {state.audio.beats.length}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClear}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="secondary" size="sm" className="text-xs" onClick={() => fileInputRef.current?.click()}>
        <Music className="h-3.5 w-3.5 mr-1" />
        Add Music
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleUpload}
      />
    </>
  );
}
