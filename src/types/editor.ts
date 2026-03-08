export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface LottieAnimationData {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  category: AnimationCategory;
  source: 'builtin' | 'lottiefiles' | 'upload';
}

export type AnimationCategory = 
  | 'backgrounds'
  | 'characters'
  | 'icons'
  | 'transitions'
  | 'effects'
  | 'stickers'
  | 'reactions'
  | 'text-animations';

export interface BaseLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  position: Position;
  size: Size;
  rotation: number;
  opacity: number;
  zIndex: number;
  // Beat sync
  beatSyncMode?: BeatSyncMode;
  beatSyncIntensity?: number; // 0-1
}

export interface LottieLayer extends BaseLayer {
  type: 'lottie';
  animationData: any;
  animationUrl: string;
  loop: boolean;
  speed: number;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  animation: TextAnimation;
}

export type TextAnimation = 'none' | 'fade-in' | 'typewriter' | 'bounce' | 'slide-up' | 'slide-down';

export type Layer = LottieLayer | TextLayer;

export type BeatSyncMode = 'none' | 'pulse' | 'flash' | 'bounce' | 'rotate' | 'reveal';

export type AspectRatioPreset = '9:16' | '1:1' | '16:9';

export interface AspectRatioConfig {
  label: string;
  width: number;
  height: number;
  description: string;
}

export const ASPECT_RATIOS: Record<AspectRatioPreset, AspectRatioConfig> = {
  '9:16': { label: '9:16', width: 1080, height: 1920, description: 'Reels / TikTok' },
  '1:1': { label: '1:1', width: 1080, height: 1080, description: 'Square Post' },
  '16:9': { label: '16:9', width: 1920, height: 1080, description: 'YouTube / Landscape' },
};

export interface AudioState {
  file: File | null;
  url: string | null;
  duration: number;
  waveformData: number[]; // normalized 0-1 amplitude values
  beats: number[]; // timestamps in seconds
  isAnalyzing: boolean;
}

export interface EditorState {
  layers: Layer[];
  selectedLayerId: string | null;
  canvasSize: Size;
  aspectRatio: AspectRatioPreset;
  backgroundColor: string;
  backgroundGradient?: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  zoom: number;
  audio: AudioState;
  // Snap guides
  snapGuides: { x: number | null; y: number | null };
}

export interface ExportSettings {
  width: number;
  height: number;
  fps: number;
  duration: number;
  format: 'mp4';
}

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1920;

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  fps: 30,
  duration: 5,
  format: 'mp4',
};

export const FONT_OPTIONS = [
  'Space Grotesk',
  'Inter',
  'Roboto',
  'Montserrat',
  'Playfair Display',
  'Bebas Neue',
  'Oswald',
  'Permanent Marker',
  'Pacifico',
  'Anton',
];

export const ANIMATION_CATEGORIES: { value: AnimationCategory; label: string }[] = [
  { value: 'backgrounds', label: 'Backgrounds' },
  { value: 'characters', label: 'Characters' },
  { value: 'icons', label: 'Icons' },
  { value: 'transitions', label: 'Transitions' },
  { value: 'effects', label: 'Effects' },
  { value: 'stickers', label: 'Stickers' },
  { value: 'reactions', label: 'Reactions' },
  { value: 'text-animations', label: 'Text Animations' },
];

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  aspectRatio: AspectRatioPreset;
  backgroundColor: string;
  backgroundGradient?: string;
  layers: Omit<Layer, 'id'>[];
  duration: number;
}
