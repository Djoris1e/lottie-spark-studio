import { useRef, useEffect, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { useEditor } from '@/context/EditorContext';
import { Layer, LottieLayer, TextLayer } from '@/types/editor';
import { calculateSnap } from '@/lib/snapGuides';
import { getBeatIntensity } from '@/lib/audioAnalyzer';

export function EditorCanvas() {
  const { state, dispatch, selectedLayer } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ layerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [resizing, setResizing] = useState<{ layerId: string; startX: number; startY: number; origW: number; origH: number } | null>(null);

  const scale = state.zoom;
  const { width: CW, height: CH } = state.canvasSize;

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
        const rawX = dragging.origX + dx;
        const rawY = dragging.origY + dy;

        const layer = state.layers.find(l => l.id === dragging.layerId);
        if (!layer) return;

        // Snap guides
        const snap = calculateSnap(rawX, rawY, layer.size.width, layer.size.height, state.canvasSize, state.layers, dragging.layerId);
        dispatch({ type: 'SET_SNAP_GUIDES', payload: { x: snap.guideX, y: snap.guideY } });
        dispatch({
          type: 'UPDATE_LAYER',
          payload: { id: dragging.layerId, updates: { position: { x: snap.x, y: snap.y } } },
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
      dispatch({ type: 'SET_SNAP_GUIDES', payload: { x: null, y: null } });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, scale, dispatch, state.layers, state.canvasSize]);

  const sortedLayers = [...state.layers].sort((a, b) => a.zIndex - b.zIndex);

  // Beat intensity for current time
  const beatIntensity = state.audio.beats.length > 0
    ? getBeatIntensity(state.currentTime, state.audio.beats)
    : 0;

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
          width: CW * scale,
          height: CH * scale,
          background: state.backgroundGradient || state.backgroundColor,
          borderRadius: 8,
          overflow: 'hidden',
        }}
        onClick={handleCanvasClick}
      >
        {/* Snap guides */}
        {state.snapGuides.x !== null && (
          <div
            className="absolute top-0 bottom-0 w-px z-50 pointer-events-none"
            style={{ left: state.snapGuides.x * scale, background: 'hsl(var(--accent))' }}
          />
        )}
        {state.snapGuides.y !== null && (
          <div
            className="absolute left-0 right-0 h-px z-50 pointer-events-none"
            style={{ top: state.snapGuides.y * scale, background: 'hsl(var(--accent))' }}
          />
        )}

        {sortedLayers.map(layer => {
          if (!layer.visible) return null;

          // Calculate beat sync transforms
          let beatTransform = '';
          let beatOpacity = layer.opacity;
          if (beatIntensity > 0 && layer.beatSyncMode && layer.beatSyncMode !== 'none') {
            const intensity = beatIntensity * (layer.beatSyncIntensity || 0.5);
            switch (layer.beatSyncMode) {
              case 'pulse':
                beatTransform = `scale(${1 + intensity * 0.15})`;
                break;
              case 'flash':
                beatOpacity = Math.min(1, layer.opacity + intensity * 0.5);
                break;
              case 'bounce':
                beatTransform = `translateY(${-intensity * 20}px)`;
                break;
              case 'rotate':
                beatTransform = `rotate(${intensity * 15}deg)`;
                break;
            }
          }

          return (
            <div
              key={layer.id}
              className={`absolute cursor-move transition-none ${state.selectedLayerId === layer.id ? 'ring-2 ring-primary ring-offset-0' : ''}`}
              style={{
                left: layer.position.x * scale,
                top: layer.position.y * scale,
                width: layer.size.width * scale,
                height: layer.size.height * scale,
                opacity: beatOpacity,
                transform: `rotate(${layer.rotation}deg) ${beatTransform}`,
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
          );
        })}
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
