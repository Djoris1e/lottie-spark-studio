

## Lottie Video Maker — Feature Roadmap

### Phase 1: Core Polish (Foundation)
1. **LottieFiles API Integration** — Search and browse thousands of animations directly from LottieFiles public API
2. **Undo/Redo System** — History stack for all editor actions
3. **Snap & Align Guides** — Smart guides when dragging layers (center, edge snapping)
4. **Pre-made Templates** — Starter compositions (birthday, promo, countdown, quote posts)
5. **Multiple Aspect Ratios** — 9:16, 1:1, 16:9 selector with canvas resize

### Phase 2: Audio & Beat Sync (Flagship Feature)
6. **Music Upload & Waveform** — Upload MP3/WAV, display waveform on the timeline
7. **Beat Detection Engine** — Analyze audio using Web Audio API (`AnalyserNode` + onset detection) to extract beat timestamps
8. **Beat-Synced Animations** — Auto-trigger animation keyframes on beats (scale pulse, opacity flash, rotation bounce)
9. **Beat-Synced Text** — Text appears/disappears/transitions word-by-word on each beat
10. **Audio Visualization Layers** — Animated bars, circles, or waveforms that react to audio frequencies in real-time

### Phase 3: Advanced Editor
11. **Keyframe Timeline** — Per-layer property keyframes (position, scale, opacity, rotation) with easing curves
12. **Scene/Slide System** — Multiple scenes with transitions (fade, slide, zoom) stitched into one video
13. **Image & Video Layers** — Import static images or short video clips as layers
14. **Mask & Crop Tools** — Circle/rectangle masks on any layer
15. **Color Filters & Overlays** — Film grain, vignette, color grading presets

### Phase 4: AI-Powered
16. **AI Music Generation** — Generate background music from a text prompt using ElevenLabs Music API
17. **AI Sound Effects** — Generate transition sounds, whooshes, impacts from text descriptions
18. **AI Text Suggestions** — Generate caption/quote text based on selected animation mood
19. **Auto-Compose** — Describe your video in plain text → AI picks animations, arranges layers, sets timing

### Phase 5: Social & Sharing
20. **Cloud Save & Gallery** — Save projects to Supabase, browse your creations
21. **Public Template Marketplace** — Share and remix other users' templates
22. **Direct Social Posting** — Export and post directly to TikTok/Instagram (via their APIs)
23. **Collaboration** — Real-time multi-user editing with presence cursors

---

### Beat Sync — Technical Approach

The flagship audio feature would work like this:

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Upload MP3  │────▶│ Web Audio API│────▶│ Beat timestamps  │
│             │     │ AnalyserNode │     │ [0.4, 0.8, 1.2] │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────┐               │
                    │ Timeline     │◀──────────────┘
                    │ beat markers │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │ Auto-generate keyframes │
              │ on each beat for:       │
              │ • Scale pulse           │
              │ • Color flash           │
              │ • Text appear/bounce    │
              │ • Layer swap            │
              └─────────────────────────┘
```

- **Beat detection**: Decode audio with `AudioContext.decodeAudioData()`, run onset detection on the PCM data (energy-based algorithm comparing short-term energy windows)
- **Waveform display**: Render audio waveform on the timeline using canvas, with beat markers overlaid
- **Sync modes**: "Pulse" (scale bounce on beat), "Switch" (cycle through layers on beat), "Reveal" (show text word-by-word), "Custom" (user picks property + easing per beat)
- **Export**: Mix audio into the MP4 using MediaRecorder with both canvas stream + audio source connected to a single `MediaStream`

### Suggested Build Order
Start with **Phase 1** items 1-3 to polish the core, then jump to **Phase 2** (audio/beat sync) as the killer differentiator. Phase 3-5 can follow incrementally.

