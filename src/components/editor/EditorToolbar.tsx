import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Type, Download, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(180deg, #0c0c1d 0%, #1a1a3e 50%, #2d1b69 100%)',
  'linear-gradient(180deg, #000000 0%, #1a1a2e 100%)',
];

export function EditorToolbar() {
  const { state, dispatch, addTextLayer } = useEditor();

  return (
    <div className="h-12 border-b border-border flex items-center justify-between px-4" style={{ background: 'hsl(var(--editor-toolbar))' }}>
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-bold text-foreground tracking-tight mr-4">
          <span className="text-primary">Lottie</span> Video Maker
        </h1>

        <Button variant="secondary" size="sm" className="text-xs" onClick={() => addTextLayer()}>
          <Type className="h-3.5 w-3.5 mr-1" />
          Add Text
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="text-xs">
              <Palette className="h-3.5 w-3.5 mr-1" />
              Background
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-card border-border">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Solid Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={state.backgroundColor}
                    onChange={e => {
                      dispatch({ type: 'SET_BACKGROUND', payload: e.target.value });
                      dispatch({ type: 'SET_BACKGROUND_GRADIENT', payload: undefined });
                    }}
                    className="h-8 w-8 rounded border border-border cursor-pointer"
                  />
                  <Input className="h-8 text-xs bg-secondary flex-1" value={state.backgroundColor} onChange={e => dispatch({ type: 'SET_BACKGROUND', payload: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Gradient Presets</Label>
                <div className="grid grid-cols-4 gap-1.5 mt-1">
                  {GRADIENT_PRESETS.map((g, i) => (
                    <div
                      key={i}
                      className="h-8 rounded cursor-pointer border border-border hover:ring-2 hover:ring-primary transition-all"
                      style={{ background: g }}
                      onClick={() => dispatch({ type: 'SET_BACKGROUND_GRADIENT', payload: g })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.max(0.1, state.zoom - 0.05) })}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground font-mono w-10 text-center">{Math.round(state.zoom * 100)}%</span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatch({ type: 'SET_ZOOM', payload: Math.min(1, state.zoom + 0.05) })}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
