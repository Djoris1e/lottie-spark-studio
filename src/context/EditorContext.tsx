import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { EditorState, Layer, LottieLayer, TextLayer, AudioState, AspectRatioPreset, ASPECT_RATIOS, BeatSyncMode } from '@/types/editor';

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
  | { type: 'MOVE_LAYER_DOWN'; payload: string }
  | { type: 'SET_ASPECT_RATIO'; payload: AspectRatioPreset }
  | { type: 'SET_AUDIO'; payload: Partial<AudioState> }
  | { type: 'CLEAR_AUDIO' }
  | { type: 'SET_SNAP_GUIDES'; payload: { x: number | null; y: number | null } }
  | { type: 'LOAD_STATE'; payload: Partial<EditorState> };

const defaultAudio: AudioState = {
  file: null,
  url: null,
  duration: 0,
  waveformData: [],
  beats: [],
  isAnalyzing: false,
};

const initialState: EditorState = {
  layers: [],
  selectedLayerId: null,
  canvasSize: { width: 1080, height: 1920 },
  aspectRatio: '9:16',
  backgroundColor: '#0a0a0f',
  duration: 5,
  currentTime: 0,
  isPlaying: false,
  zoom: 0.3,
  audio: defaultAudio,
  snapGuides: { x: null, y: null },
};

// History for undo/redo
const MAX_HISTORY = 50;

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
    case 'SET_ASPECT_RATIO': {
      const config = ASPECT_RATIOS[action.payload];
      return { ...state, aspectRatio: action.payload, canvasSize: { width: config.width, height: config.height } };
    }
    case 'SET_AUDIO':
      return { ...state, audio: { ...state.audio, ...action.payload } };
    case 'CLEAR_AUDIO':
      return { ...state, audio: defaultAudio };
    case 'SET_SNAP_GUIDES':
      return { ...state, snapGuides: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Actions that should be tracked in undo history
const UNDOABLE_ACTIONS = new Set([
  'ADD_LAYER', 'REMOVE_LAYER', 'UPDATE_LAYER', 'REORDER_LAYERS',
  'SET_BACKGROUND', 'SET_BACKGROUND_GRADIENT', 'DUPLICATE_LAYER',
  'MOVE_LAYER_UP', 'MOVE_LAYER_DOWN', 'TOGGLE_LAYER_VISIBILITY',
  'TOGGLE_LAYER_LOCK', 'SET_ASPECT_RATIO',
]);

interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  addLottieLayer: (name: string, animationData: any, animationUrl: string) => void;
  addTextLayer: (text?: string) => void;
  selectedLayer: Layer | null;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(editorReducer, initialState);
  const historyRef = useRef<EditorState[]>([initialState]);
  const historyIndexRef = useRef(0);
  const skipHistoryRef = useRef(false);

  const dispatch = useCallback((action: EditorAction) => {
    rawDispatch(action);
    
    // Only track undoable actions in history
    if (!skipHistoryRef.current && UNDOABLE_ACTIONS.has(action.type)) {
      // We need to compute the next state for history
      // This is a bit redundant but keeps history clean
      setTimeout(() => {
        // Get current state after dispatch
        // We use a ref-based approach instead
      }, 0);
    }
  }, []);

  // Simplified undo/redo using snapshots
  const stateRef = useRef(state);
  stateRef.current = state;

  // Track state changes for undo
  const lastTrackedRef = useRef<string>('');
  
  React.useEffect(() => {
    const stateKey = JSON.stringify({
      layers: state.layers.map(l => ({ ...l, animationData: undefined })),
      backgroundColor: state.backgroundColor,
      backgroundGradient: state.backgroundGradient,
      aspectRatio: state.aspectRatio,
    });
    
    if (stateKey !== lastTrackedRef.current && !skipHistoryRef.current) {
      lastTrackedRef.current = stateKey;
      // Trim future history
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push({ ...state });
      if (historyRef.current.length > MAX_HISTORY) {
        historyRef.current.shift();
      } else {
        historyIndexRef.current = historyRef.current.length - 1;
      }
    }
  }, [state.layers, state.backgroundColor, state.backgroundGradient, state.aspectRatio]);

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      skipHistoryRef.current = true;
      const prev = historyRef.current[historyIndexRef.current];
      rawDispatch({ type: 'LOAD_STATE', payload: prev });
      setTimeout(() => { skipHistoryRef.current = false; }, 0);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      skipHistoryRef.current = true;
      const next = historyRef.current[historyIndexRef.current];
      rawDispatch({ type: 'LOAD_STATE', payload: next });
      setTimeout(() => { skipHistoryRef.current = false; }, 0);
    }
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  // Keyboard shortcuts for undo/redo
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      // Delete selected layer
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedLayerId) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        dispatch({ type: 'REMOVE_LAYER', payload: state.selectedLayerId });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, state.selectedLayerId, dispatch]);

  const addLottieLayer = useCallback((name: string, animationData: any, animationUrl: string) => {
    const layer: LottieLayer = {
      id: crypto.randomUUID(),
      type: 'lottie',
      name,
      visible: true,
      locked: false,
      position: { x: state.canvasSize.width / 2 - 200, y: state.canvasSize.height / 2 - 200 },
      size: { width: 400, height: 400 },
      rotation: 0,
      opacity: 1,
      zIndex: 0,
      animationData,
      animationUrl,
      loop: true,
      speed: 1,
      beatSyncMode: 'none',
      beatSyncIntensity: 0.5,
    };
    dispatch({ type: 'ADD_LAYER', payload: layer });
  }, [state.canvasSize, dispatch]);

  const addTextLayer = useCallback((text = 'Your Text') => {
    const layer: TextLayer = {
      id: crypto.randomUUID(),
      type: 'text',
      name: 'Text',
      visible: true,
      locked: false,
      position: { x: state.canvasSize.width / 2 - 200, y: state.canvasSize.height / 2 - 50 },
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
      beatSyncMode: 'none',
      beatSyncIntensity: 0.5,
    };
    dispatch({ type: 'ADD_LAYER', payload: layer });
  }, [state.canvasSize, dispatch]);

  const selectedLayer = state.layers.find(l => l.id === state.selectedLayerId) || null;

  return (
    <EditorContext.Provider value={{ state, dispatch, addLottieLayer, addTextLayer, selectedLayer, undo, redo, canUndo, canRedo }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
