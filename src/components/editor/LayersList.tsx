import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Layers, Eye, EyeOff, Trash2, GripVertical, Image } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LayersList() {
  const { state, dispatch } = useEditor();
  const sortedLayers = [...state.layers].sort((a, b) => b.zIndex - a.zIndex);

  const getLayerColor = (type: string) => {
    switch (type) {
      case 'lottie': return 'bg-accent';
      case 'text': return 'bg-primary';
      case 'gif': return 'bg-yellow-500';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="border-t border-border">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold text-foreground">Layers ({state.layers.length})</h3>
      </div>
      <ScrollArea className="h-40">
        {sortedLayers.map(layer => (
          <div
            key={layer.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer hover:bg-secondary/50 transition-colors ${
              state.selectedLayerId === layer.id ? 'bg-secondary border-l-2 border-primary' : ''
            }`}
            onClick={() => dispatch({ type: 'SELECT_LAYER', payload: layer.id })}
          >
            <GripVertical className="h-3 w-3 text-muted-foreground/50" />
            <span className={`h-2 w-2 rounded-full ${getLayerColor(layer.type)}`} />
            {layer.type === 'gif' && <Image className="h-3 w-3 text-muted-foreground" />}
            <span className="flex-1 truncate text-foreground">{layer.name}</span>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={e => { e.stopPropagation(); dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', payload: layer.id }); }}>
              {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_LAYER', payload: layer.id }); }}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {state.layers.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No layers yet</p>
        )}
      </ScrollArea>
    </div>
  );
}
