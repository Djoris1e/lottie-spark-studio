import { useRef, useEffect, useState, useCallback } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { useEditor } from '@/context/EditorContext';
import { Layer, LottieLayer, TextLayer, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/editor';

export function EditorCanvas() {
  const { state, dispatch, selectedLayer } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ layerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [resizing, setResizing] = useState<{ layerId: string; startX: number; startY: number; origW: number; origH: number } | null>(null);

  const scale = state.zoom;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvas === 'true') {
      dispatch({ type: 'SELECT_LAYER', payload: null });
    }
  };

  const handleLayerMouseDown = (e: React.MouseEvent, layer: Layer) => {
    if (layer.locked) return;
    e.stopPropagation();
    dispatch({ type: 'SELECT_LAYER', payload: layer.id });
    setDragging({
      layerId: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: layer.position.x,
      origY: layer.position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, layer: Layer) => {
    if (layer.locked) return;
    e.stopPropagation();
    setResizing({
      layerId: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      origW: layer.size.width,
      origH: layer.size.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = (e.clientX - dragging.startX) / scale;
        const dy = (e.clientY - dragging.startY) / scale;
        dispatch({
          type: 'UPDATE_LAYER',
          payload: {
            id: dragging.layerId,
            updates: { position: { x: dragging.origX + dx, y: dragging.origY + dy } },
          },
        });
      }
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / scale;
        const dy = (e.clientY - resizing.startY) / scale;
        dispatch({
          type: 'UPDATE_LAYER',
          payload: {
            id: resizing.layerId,
            updates: {
              size: {
                width: Math.max(50, resizing.origW + dx),
                height: Math.max(50, resizing.origH + dy),
              },
            },
          },
        });
      }
    };
    const handleMouseUp = () => {
      setDragging(null);
      setResizing(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, scale, dispatch]);

  const sortedLayers = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-auto editor-grid"
      style={{ background: `hsl(var(--canvas-bg))` }}
      onClick={handleCanvasClick}
    >
      <div
        ref={containerRef}
        className="relative shadow-2xl"
        data-canvas="true"
        style={{
          width: CANVAS_WIDTH * scale,
          height: CANVAS_HEIGHT * scale,
          background: state.backgroundGradient || state.backgroundColor,
          borderRadius: 8,
          overflow: 'hidden',
        }}
        onClick={handleCanvasClick}
      >
        {sortedLayers.map(layer => (
          layer.visible && (
            <div
              key={layer.id}
              className={`absolute cursor-move ${state.selectedLayerId === layer.id ? 'ring-2 ring-primary ring-offset-0' : ''}`}
              style={{
                left: layer.position.x * scale,
                top: layer.position.y * scale,
                width: layer.size.width * scale,
                height: layer.size.height * scale,
                opacity: layer.opacity,
                transform: `rotate(${layer.rotation}deg)`,
                zIndex: layer.zIndex,
              }}
              onMouseDown={(e) => handleLayerMouseDown(e, layer)}
            >
              {layer.type === 'lottie' && <LottieRenderer layer={layer} scale={scale} />}
              {layer.type === 'text' && <TextRenderer layer={layer} scale={scale} />}
              
              {state.selectedLayerId === layer.id && !layer.locked && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-tl cursor-se-resize"
                  onMouseDown={(e) => handleResizeMouseDown(e, layer)}
                />
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}

function LottieRenderer({ layer, scale }: { layer: LottieLayer; scale: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    animRef.current = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop: layer.loop,
      autoplay: true,
      animationData: layer.animationData,
    });
    animRef.current.setSpeed(layer.speed);
    return () => { animRef.current?.destroy(); };
  }, [layer.animationData, layer.loop, layer.speed]);

  return <div ref={ref} className="w-full h-full" />;
}

function TextRenderer({ layer, scale }: { layer: TextLayer; scale: number }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      style={{
        fontFamily: layer.fontFamily,
        fontSize: layer.fontSize * scale,
        fontWeight: layer.fontWeight,
        color: layer.color,
        textAlign: layer.textAlign,
        WebkitTextStroke: layer.strokeWidth ? `${layer.strokeWidth}px ${layer.strokeColor || '#000'}` : undefined,
        textShadow: layer.shadowBlur ? `0 0 ${layer.shadowBlur}px ${layer.shadowColor || 'rgba(0,0,0,0.5)'}` : undefined,
        lineHeight: 1.1,
        wordBreak: 'break-word',
        padding: '4px',
      }}
    >
      {layer.text}
    </div>
  );
}
