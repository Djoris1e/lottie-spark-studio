import { Layer, Size } from '@/types/editor';

const SNAP_THRESHOLD = 8; // pixels

export interface SnapResult {
  x: number;
  y: number;
  guideX: number | null;
  guideY: number | null;
}

/**
 * Calculate snap positions for a layer being dragged
 */
export function calculateSnap(
  dragX: number,
  dragY: number,
  dragW: number,
  dragH: number,
  canvasSize: Size,
  otherLayers: Layer[],
  dragLayerId: string
): SnapResult {
  let snapX = dragX;
  let snapY = dragY;
  let guideX: number | null = null;
  let guideY: number | null = null;

  const dragCenterX = dragX + dragW / 2;
  const dragCenterY = dragY + dragH / 2;
  const dragRight = dragX + dragW;
  const dragBottom = dragY + dragH;

  // Canvas center guides
  const canvasCenterX = canvasSize.width / 2;
  const canvasCenterY = canvasSize.height / 2;

  // Snap points to check (edge + center)
  const xPoints = [
    { val: dragX, target: 0 },
    { val: dragCenterX, target: canvasCenterX },
    { val: dragRight, target: canvasSize.width },
  ];

  const yPoints = [
    { val: dragY, target: 0 },
    { val: dragCenterY, target: canvasCenterY },
    { val: dragBottom, target: canvasSize.height },
  ];

  // Also snap to other layers
  for (const layer of otherLayers) {
    if (layer.id === dragLayerId) continue;
    const lCenterX = layer.position.x + layer.size.width / 2;
    const lCenterY = layer.position.y + layer.size.height / 2;

    xPoints.push(
      { val: dragX, target: layer.position.x },
      { val: dragX, target: layer.position.x + layer.size.width },
      { val: dragRight, target: layer.position.x },
      { val: dragRight, target: layer.position.x + layer.size.width },
      { val: dragCenterX, target: lCenterX },
    );
    yPoints.push(
      { val: dragY, target: layer.position.y },
      { val: dragY, target: layer.position.y + layer.size.height },
      { val: dragBottom, target: layer.position.y },
      { val: dragBottom, target: layer.position.y + layer.size.height },
      { val: dragCenterY, target: lCenterY },
    );
  }

  // Find closest snap for X
  let minDistX = SNAP_THRESHOLD;
  for (const p of xPoints) {
    const dist = Math.abs(p.val - p.target);
    if (dist < minDistX) {
      minDistX = dist;
      snapX = dragX + (p.target - p.val);
      guideX = p.target;
    }
  }

  // Find closest snap for Y
  let minDistY = SNAP_THRESHOLD;
  for (const p of yPoints) {
    const dist = Math.abs(p.val - p.target);
    if (dist < minDistY) {
      minDistY = dist;
      snapY = dragY + (p.target - p.val);
      guideY = p.target;
    }
  }

  return { x: snapX, y: snapY, guideX, guideY };
}
