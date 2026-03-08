import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { EditorState, Layer, LottieLayer, TextLayer, CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/editor';

type EditorAction =
  | { type: 'ADD_LAYER'; payload: Layer }
  | { type: 'REMOVE_LAYER'; payload: string }
  | { type: 'UPDATE_LAYER'; payload: { id: string; updates: Partial<Layer> } }
  | { type: 'SELECT_LAYER'; payload: string | null }
  | { type: 'REORDER_LAYERS'; payload: Layer[] }
  | { type: 'SET_BACKGROUND'; payload: string }
  | { type: 'SET_BACKGROUND_GRADIENT'; payload: string | undefined }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; payload: string }
  | { type: 'TOGGLE_LAYER_LOCK'; payload: string }
  | { type: 'DUPLICATE_LAYER'; payload: string }
  | { type: 'MOVE_LAYER_UP'; payload: string }
  | { type: 'MOVE_LAYER_DOWN'; payload: string };

const initialState: EditorState = {
  layers: [],
  selectedLayerId: null,
  canvasSize: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
  backgroundColor: '#0a0a0f',
  duration: 5,
  currentTime: 0,
  isPlaying: false,
  zoom: 0.3,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'ADD_LAYER': {
      const newLayer = { ...action.payload, zIndex: state.layers.length };
      return { ...state, layers: [...state.layers, newLayer], selectedLayerId: newLayer.id };
    }
    case 'REMOVE_LAYER':
      return {
        ...state,
        layers: state.layers.filter(l => l.id !== action.payload),
        selectedLayerId: state.selectedLayerId === action.payload ? null : state.selectedLayerId,
      };
    case 'UPDATE_LAYER':
      return {
        ...state,
        layers: state.layers.map(l =>
          l.id === action.payload.id ? { ...l, ...action.payload.updates } as Layer : l
        ),
      };
    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.payload };
    case 'REORDER_LAYERS':
      return { ...state, layers: action.payload };
    case 'SET_BACKGROUND':
      return { ...state, backgroundColor: action.payload };
    case 'SET_BACKGROUND_GRADIENT':
      return { ...state, backgroundGradient: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };
    case 'TOGGLE_LAYER_VISIBILITY':
      return {
        ...state,
        layers: state.layers.map(l =>
          l.id === action.payload ? { ...l, visible: !l.visible } as Layer : l
        ),
      };
    case 'TOGGLE_LAYER_LOCK':
      return {
        ...state,
        layers: state.layers.map(l =>
          l.id === action.payload ? { ...l, locked: !l.locked } as Layer : l
        ),
      };
    case 'DUPLICATE_LAYER': {
      const source = state.layers.find(l => l.id === action.payload);
      if (!source) return state;
      const dup = {
        ...source,
        id: crypto.randomUUID(),
        name: source.name + ' copy',
        position: { x: source.position.x + 20, y: source.position.y + 20 },
        zIndex: state.layers.length,
      } as Layer;
      return { ...state, layers: [...state.layers, dup], selectedLayerId: dup.id };
    }
    case 'MOVE_LAYER_UP': {
      const idx = state.layers.findIndex(l => l.id === action.payload);
      if (idx >= state.layers.length - 1) return state;
      const newLayers = [...state.layers];
      [newLayers[idx], newLayers[idx + 1]] = [newLayers[idx + 1], newLayers[idx]];
      return { ...state, layers: newLayers.map((l, i) => ({ ...l, zIndex: i } as Layer)) };
    }
    case 'MOVE_LAYER_DOWN': {
      const idx = state.layers.findIndex(l => l.id === action.payload);
      if (idx <= 0) return state;
      const newLayers = [...state.layers];
      [newLayers[idx], newLayers[idx - 1]] = [newLayers[idx - 1], newLayers[idx]];
      return { ...state, layers: newLayers.map((l, i) => ({ ...l, zIndex: i } as Layer)) };
    }
    default:
      return state;
  }
}

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  addLottieLayer: (name: string, animationData: any, animationUrl: string) => void;
  addTextLayer: (text?: string) => void;
  selectedLayer: Layer | null;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const addLottieLayer = useCallback((name: string, animationData: any, animationUrl: string) => {
    const layer: LottieLayer = {
      id: crypto.randomUUID(),
      type: 'lottie',
      name,
      visible: true,
      locked: false,
      position: { x: CANVAS_WIDTH / 2 - 200, y: CANVAS_HEIGHT / 2 - 200 },
      size: { width: 400, height: 400 },
      rotation: 0,
      opacity: 1,
      zIndex: 0,
      animationData,
      animationUrl,
      loop: true,
      speed: 1,
    };
    dispatch({ type: 'ADD_LAYER', payload: layer });
  }, []);

  const addTextLayer = useCallback((text = 'Your Text') => {
    const layer: TextLayer = {
      id: crypto.randomUUID(),
      type: 'text',
      name: 'Text',
      visible: true,
      locked: false,
      position: { x: CANVAS_WIDTH / 2 - 200, y: CANVAS_HEIGHT / 2 - 50 },
      size: { width: 400, height: 100 },
      rotation: 0,
      opacity: 1,
      zIndex: 0,
      text,
      fontFamily: 'Space Grotesk',
      fontSize: 64,
      fontWeight: 700,
      color: '#ffffff',
      textAlign: 'center',
      animation: 'none',
    };
    dispatch({ type: 'ADD_LAYER', payload: layer });
  }, []);

  const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId) || null;

  return (
    <EditorContext.Provider value={{ state, dispatch, addLottieLayer, addTextLayer, selectedLayer }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
