import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LayoutTemplate } from 'lucide-react';
import { templates } from '@/data/templates';
import { Layer, ASPECT_RATIOS } from '@/types/editor';
import { useState } from 'react';

export function TemplateGallery() {
  const { dispatch } = useEditor();
  const [open, setOpen] = useState(false);

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const config = ASPECT_RATIOS[template.aspectRatio];
    dispatch({ type: 'SET_ASPECT_RATIO', payload: template.aspectRatio });
    dispatch({ type: 'SET_BACKGROUND', payload: template.backgroundColor });
    if (template.backgroundGradient) {
      dispatch({ type: 'SET_BACKGROUND_GRADIENT', payload: template.backgroundGradient });
    }
    dispatch({ type: 'SET_DURATION', payload: template.duration });

    // Clear existing layers and add template layers
    dispatch({ type: 'LOAD_STATE', payload: { layers: [], selectedLayerId: null } });

    for (const layerData of template.layers) {
      const layer = { ...layerData, id: crypto.randomUUID() } as Layer;
      dispatch({ type: 'ADD_LAYER', payload: layer });
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="text-xs">
          <LayoutTemplate className="h-3.5 w-3.5 mr-1" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Start from a Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {templates.map(template => (
            <button
              key={template.id}
              className="group relative rounded-lg border border-border overflow-hidden text-left hover:border-primary transition-colors"
              onClick={() => applyTemplate(template.id)}
            >
              <div
                className="h-32 flex items-center justify-center text-4xl"
                style={{ background: template.backgroundGradient || template.backgroundColor }}
              >
                {template.thumbnail}
              </div>
              <div className="p-2.5">
                <div className="text-sm font-medium text-foreground">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
                <div className="text-[10px] text-muted-foreground/60 mt-1">
                  {template.aspectRatio} • {template.duration}s • {template.layers.length} layers
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
