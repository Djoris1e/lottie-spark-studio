

## Lottie Video Maker — Social Media Content Creator

### Overview
A canvas-based editor where users browse/search Lottie animations, drag them onto a canvas, add customizable text, and export as MP4 video in 9:16 (portrait) format — perfect for social media content.

### Pages & Navigation
1. **Home/Gallery** — Browse and search Lottie animations from multiple sources
2. **Canvas Editor** — Main workspace for composing videos
3. **Export** — Preview and download as MP4

### Features

#### 1. Animation Library Panel
- **LottieFiles API integration** — Search thousands of free public animations by keyword/category
- **Built-in curated collection** — Pre-bundled popular animations (reactions, transitions, stickers, backgrounds)
- **User uploads** — Upload custom `.json` Lottie files
- Categories: Backgrounds, Characters, Icons, Transitions, Effects, Text animations

#### 2. Canvas Editor
- **9:16 portrait canvas** (1080×1920) optimized for Reels/TikTok/Shorts
- **Drag & drop** Lottie animations from the library onto the canvas
- **Resize, move, and layer** animations freely
- **Text overlays** — Add text with configurable font, size, color, position, and animation style
- **Background color/gradient** picker
- **Layer management** — Reorder, show/hide, delete layers
- **Timeline scrubber** — Set video duration (1–30 seconds), preview playback
- **Real-time preview** — See all animations playing together on canvas

#### 3. Text Configuration
- Font family selection (popular web fonts)
- Font size, color, stroke/shadow
- Text animation presets (fade in, typewriter, bounce, slide)
- Positioning and alignment controls

#### 4. Video Export
- Render canvas to **MP4** using canvas recording (MediaRecorder API + canvas capture)
- **9:16 aspect ratio** output at 1080×1920
- Progress indicator during rendering
- Download button for the final MP4 file

### Design & UX
- Dark-themed editor interface (professional creative tool feel)
- Left sidebar: Animation library with search + categories
- Center: Canvas workspace with zoom controls
- Right sidebar: Properties panel (selected element settings)
- Bottom: Simple timeline/duration bar
- Responsive but optimized for desktop use

### Technical Approach
- **lottie-web** for rendering Lottie animations on canvas
- **LottieFiles API** for browsing public animations
- **HTML Canvas** for compositing all layers
- **MediaRecorder API** for client-side MP4 export (no server needed)
- All processing happens in the browser — no backend required

