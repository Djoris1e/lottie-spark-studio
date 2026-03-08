import { useState } from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { AnimationLibrary } from '@/components/editor/AnimationLibrary';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { Timeline } from '@/components/editor/Timeline';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { LayersList } from '@/components/editor/LayersList';
import { ExportButton } from '@/components/editor/ExportButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Layers, Library, Settings2 } from 'lucide-react';

const EditorPage = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <EditorProvider>
        <MobileEditor />
      </EditorProvider>
    );
  }

  return (
    <EditorProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex items-center justify-between pr-4" style={{ background: 'hsl(var(--editor-toolbar))' }}>
          <EditorToolbar />
          <ExportButton />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 flex flex-col border-r border-border">
            <div className="flex-1 overflow-hidden">
              <AnimationLibrary />
            </div>
            <LayersList />
          </div>
          <EditorCanvas />
          <PropertiesPanel />
        </div>
        <Timeline />
      </div>
    </EditorProvider>
  );
};

function MobileEditor() {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [propsOpen, setPropsOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {/* Compact mobile toolbar */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-border" style={{ background: 'hsl(var(--editor-toolbar))' }}>
        <EditorToolbar />
        <ExportButton />
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-hidden relative">
        <EditorCanvas />

        {/* Floating action buttons */}
        <div className="absolute bottom-3 left-3 flex gap-2 z-20">
          <Sheet open={libraryOpen} onOpenChange={setLibraryOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" className="shadow-lg gap-1.5 text-xs">
                <Library className="h-3.5 w-3.5" />
                Library
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0">
              <div className="h-full flex flex-col">
                <AnimationLibrary />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={layersOpen} onOpenChange={setLayersOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" className="shadow-lg gap-1.5 text-xs">
                <Layers className="h-3.5 w-3.5" />
                Layers
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0">
              <div className="h-full pt-10">
                <LayersList />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={propsOpen} onOpenChange={setPropsOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" className="shadow-lg gap-1.5 text-xs">
                <Settings2 className="h-3.5 w-3.5" />
                Properties
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0">
              <div className="h-full pt-10">
                <PropertiesPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Timeline */}
      <Timeline />
    </div>
  );
}

export default EditorPage;
