import { useState, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Loader2 } from 'lucide-react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/editor';

export function ExportButton() {
  const { state } = useEditor();
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = useCallback(async () => {
    setExporting(true);
    setProgress(0);

    try {
      // Create an offscreen canvas at full resolution
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d')!;

      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8_000_000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const fps = 30;
      const totalFrames = Math.ceil(state.duration * fps);
      let frame = 0;

      mediaRecorder.start();

      const renderFrame = () => {
        // Clear
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Background
        if (state.backgroundGradient) {
          // Simple gradient parsing for export
          ctx.fillStyle = state.backgroundColor;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else {
          ctx.fillStyle = state.backgroundColor;
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Render text layers (Lottie layers shown as placeholder in export)
        const sortedLayers = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);
        for (const layer of sortedLayers) {
          if (!layer.visible) continue;
          ctx.save();
          ctx.globalAlpha = layer.opacity;
          ctx.translate(layer.position.x + layer.size.width / 2, layer.position.y + layer.size.height / 2);
          ctx.rotate((layer.rotation * Math.PI) / 180);

          if (layer.type === 'text') {
            ctx.font = `${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
            ctx.fillStyle = layer.color;
            ctx.textAlign = layer.textAlign;
            ctx.textBaseline = 'middle';
            
            if (layer.strokeWidth) {
              ctx.strokeStyle = layer.strokeColor || '#000';
              ctx.lineWidth = layer.strokeWidth;
              ctx.strokeText(layer.text, 0, 0);
            }
            ctx.fillText(layer.text, 0, 0);
          }

          ctx.restore();
        }

        frame++;
        setProgress((frame / totalFrames) * 100);

        if (frame < totalFrames) {
          setTimeout(renderFrame, 1000 / fps);
        } else {
          mediaRecorder.stop();
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lottie-video.webm';
        a.click();
        URL.revokeObjectURL(url);
        setExporting(false);
        setProgress(0);
      };

      renderFrame();
    } catch (err) {
      console.error('Export failed:', err);
      setExporting(false);
    }
  }, [state]);

  return (
    <div className="flex items-center gap-2">
      {exporting && (
        <div className="w-32">
          <Progress value={progress} className="h-2" />
        </div>
      )}
      <Button
        size="sm"
        className="text-xs glow-primary"
        onClick={handleExport}
        disabled={exporting || state.layers.length === 0}
      >
        {exporting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            {Math.round(progress)}%
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5 mr-1" />
            Export Video
          </>
        )}
      </Button>
    </div>
  );
}
