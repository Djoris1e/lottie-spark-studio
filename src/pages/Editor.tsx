import { EditorProvider } from '@/context/EditorContext';
import { AnimationLibrary } from '@/components/editor/AnimationLibrary';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { Timeline } from '@/components/editor/Timeline';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { LayersList } from '@/components/editor/LayersList';
import { ExportButton } from '@/components/editor/ExportButton';

const EditorPage = () => {
  return (
    <EditorProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Toolbar with export button */}
        <div className="flex items-center justify-between pr-4" style={{ background: 'hsl(var(--editor-toolbar))' }}>
          <EditorToolbar />
          <ExportButton />
        </div>

        {/* Main area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Animation library + layers */}
          <div className="w-64 flex flex-col border-r border-border">
            <div className="flex-1 overflow-hidden">
              <AnimationLibrary />
            </div>
            <LayersList />
          </div>

          {/* Center: Canvas */}
          <EditorCanvas />

          {/* Right: Properties */}
          <PropertiesPanel />
        </div>

        {/* Bottom: Timeline */}
        <Timeline />
      </div>
    </EditorProvider>
  );
};

export default EditorPage;
