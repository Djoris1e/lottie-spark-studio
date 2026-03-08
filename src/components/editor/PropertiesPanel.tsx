import { useEditor } from '@/context/EditorContext';
import { Layer, TextLayer, LottieLayer, FONT_OPTIONS } from '@/types/editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, Copy, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Type } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export function PropertiesPanel() {
  const { state, dispatch, selectedLayer, addTextLayer } = useEditor();

  if (!selectedLayer) {
    return (
      <div className="w-64 bg-card border-l border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-muted-foreground text-sm">
          <p className="text-center mb-4">Select a layer to edit its properties</p>
          <Button variant="outline" size="sm" onClick={() => addTextLayer()}>
            <Type className="h-4 w-4 mr-1" />
            Add Text
          </Button>
        </div>
      </div>
    );
  }

  const update = (updates: Partial<Layer>) => {
    dispatch({ type: 'UPDATE_LAYER', payload: { id: selectedLayer.id, updates } });
  };

  return (
    <div className="w-64 bg-card border-l border-border flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Properties</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: selectedLayer.id })}>
            {selectedLayer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dispatch({ type: 'TOGGLE_LAYER_LOCK', payload: selectedLayer.id })}>
            {selectedLayer.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dispatch({ type: 'DUPLICATE_LAYER', payload: selectedLayer.id })}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => dispatch({ type: 'REMOVE_LAYER', payload: selectedLayer.id })}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Name */}
          <div>
            <Label className="text-xs">Name</Label>
            <Input className="h-8 text-xs bg-secondary" value={selectedLayer.name} onChange={e => update({ name: e.target.value })} />
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input type="number" className="h-8 text-xs bg-secondary" value={Math.round(selectedLayer.position.x)} onChange={e => update({ position: { ...selectedLayer.position, x: +e.target.value } })} />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input type="number" className="h-8 text-xs bg-secondary" value={Math.round(selectedLayer.position.y)} onChange={e => update({ position: { ...selectedLayer.position, y: +e.target.value } })} />
            </div>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Width</Label>
              <Input type="number" className="h-8 text-xs bg-secondary" value={Math.round(selectedLayer.size.width)} onChange={e => update({ size: { ...selectedLayer.size, width: +e.target.value } })} />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input type="number" className="h-8 text-xs bg-secondary" value={Math.round(selectedLayer.size.height)} onChange={e => update({ size: { ...selectedLayer.size, height: +e.target.value } })} />
            </div>
          </div>

          {/* Opacity */}
          <div>
            <Label className="text-xs">Opacity: {Math.round(selectedLayer.opacity * 100)}%</Label>
            <Slider min={0} max={1} step={0.01} value={[selectedLayer.opacity]} onValueChange={([v]) => update({ opacity: v })} />
          </div>

          {/* Rotation */}
          <div>
            <Label className="text-xs">Rotation: {selectedLayer.rotation}°</Label>
            <Slider min={0} max={360} step={1} value={[selectedLayer.rotation]} onValueChange={([v]) => update({ rotation: v })} />
          </div>

          {/* Layer order */}
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => dispatch({ type: 'MOVE_LAYER_UP', payload: selectedLayer.id })}>
              <ChevronUp className="h-3 w-3 mr-1" /> Forward
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 text-xs" onClick={() => dispatch({ type: 'MOVE_LAYER_DOWN', payload: selectedLayer.id })}>
              <ChevronDown className="h-3 w-3 mr-1" /> Back
            </Button>
          </div>

          {/* Text-specific properties */}
          {selectedLayer.type === 'text' && <TextProperties layer={selectedLayer} update={update} />}

          {/* Lottie-specific properties */}
          {selectedLayer.type === 'lottie' && <LottieProperties layer={selectedLayer} update={update} />}
        </div>
      </ScrollArea>
    </div>
  );
}

function TextProperties({ layer, update }: { layer: TextLayer; update: (u: Partial<TextLayer>) => void }) {
  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Text</h3>
      <Textarea className="text-xs bg-secondary min-h-[60px]" value={layer.text} onChange={e => update({ text: e.target.value })} />

      <div>
        <Label className="text-xs">Font</Label>
        <Select value={layer.fontFamily} onValueChange={v => update({ fontFamily: v })}>
          <SelectTrigger className="h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map(f => <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Size</Label>
          <Input type="number" className="h-8 text-xs bg-secondary" value={layer.fontSize} onChange={e => update({ fontSize: +e.target.value })} />
        </div>
        <div>
          <Label className="text-xs">Weight</Label>
          <Select value={String(layer.fontWeight)} onValueChange={v => update({ fontWeight: +v })}>
            <SelectTrigger className="h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[300, 400, 500, 600, 700].map(w => <SelectItem key={w} value={String(w)}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs">Color</Label>
        <div className="flex gap-2 items-center">
          <input type="color" value={layer.color} onChange={e => update({ color: e.target.value })} className="h-8 w-8 rounded border border-border cursor-pointer" />
          <Input className="h-8 text-xs bg-secondary flex-1" value={layer.color} onChange={e => update({ color: e.target.value })} />
        </div>
      </div>

      <div>
        <Label className="text-xs">Align</Label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map(a => (
            <Button key={a} variant={layer.textAlign === a ? 'default' : 'secondary'} size="sm" className="flex-1 text-xs capitalize" onClick={() => update({ textAlign: a })}>
              {a}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs">Animation</Label>
        <Select value={layer.animation} onValueChange={(v: any) => update({ animation: v })}>
          <SelectTrigger className="h-8 text-xs bg-secondary"><SelectValue /></SelectTrigger>
          <SelectContent>
            {['none', 'fade-in', 'typewriter', 'bounce', 'slide-up', 'slide-down'].map(a => (
              <SelectItem key={a} value={a} className="capitalize">{a.replace('-', ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function LottieProperties({ layer, update }: { layer: LottieLayer; update: (u: Partial<LottieLayer>) => void }) {
  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Animation</h3>

      <div>
        <Label className="text-xs">Speed: {layer.speed.toFixed(1)}x</Label>
        <Slider min={0.1} max={3} step={0.1} value={[layer.speed]} onValueChange={([v]) => update({ speed: v })} />
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-xs">Loop</Label>
        <Switch checked={layer.loop} onCheckedChange={v => update({ loop: v })} />
      </div>
    </div>
  );
}
