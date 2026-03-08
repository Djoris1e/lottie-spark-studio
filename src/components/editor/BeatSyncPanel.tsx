import { useEditor } from '@/context/EditorContext';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BeatSyncMode } from '@/types/editor';
import { Zap } from 'lucide-react';

const SYNC_MODES: { value: BeatSyncMode; label: string; desc: string }[] = [
  { value: 'none', label: 'None', desc: 'No beat sync' },
  { value: 'pulse', label: 'Pulse', desc: 'Scale bounce on beat' },
  { value: 'flash', label: 'Flash', desc: 'Opacity flash on beat' },
  { value: 'bounce', label: 'Bounce', desc: 'Vertical bounce on beat' },
  { value: 'rotate', label: 'Rotate', desc: 'Rotation kick on beat' },
  { value: 'reveal', label: 'Reveal', desc: 'Appear on beat (text)' },
];

export function BeatSyncPanel() {
  const { state, dispatch, selectedLayer } = useEditor();

  if (!selectedLayer || state.audio.beats.length === 0) return null;

  const update = (updates: Record<string, any>) => {
    dispatch({ type: 'UPDATE_LAYER', payload: { id: selectedLayer.id, updates } });
  };

  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        <Zap className="h-3 w-3 text-accent" />
        Beat Sync
      </h3>

      <div>
        <Label className="text-xs">Sync Mode</Label>
        <Select
          value={selectedLayer.beatSyncMode || 'none'}
          onValueChange={(v: BeatSyncMode) => update({ beatSyncMode: v })}
        >
          <SelectTrigger className="h-8 text-xs bg-secondary">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SYNC_MODES.map(m => (
              <SelectItem key={m.value} value={m.value}>
                <div>
                  <span>{m.label}</span>
                  <span className="text-muted-foreground ml-1 text-[10px]">— {m.desc}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedLayer.beatSyncMode && selectedLayer.beatSyncMode !== 'none' && (
        <div>
          <Label className="text-xs">
            Intensity: {Math.round((selectedLayer.beatSyncIntensity || 0.5) * 100)}%
          </Label>
          <Slider
            min={0.1}
            max={1}
            step={0.05}
            value={[selectedLayer.beatSyncIntensity || 0.5]}
            onValueChange={([v]) => update({ beatSyncIntensity: v })}
          />
        </div>
      )}

      <p className="text-[10px] text-muted-foreground">
        {state.audio.beats.length} beats detected • Sync effects apply during playback & export
      </p>
    </div>
  );
}
