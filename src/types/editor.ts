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
  url: string; // URL to the JSON file
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
}

export interface LottieLayer extends BaseLayer {
  type: 'lottie';
  animationData: any; // parsed JSON
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

export interface EditorState {
  layers: Layer[];
  selectedLayerId: string | null;
  canvasSize: Size;
  backgroundColor: string;
  backgroundGradient?: string;
  duration: number; // seconds
  currentTime: number; // seconds
  isPlaying: boolean;
  zoom: number;
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
