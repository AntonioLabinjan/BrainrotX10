# BRAINROT X10 v0.7 — Infinite Vertical Video Feed

A satirical infinite-scroll feed with locally generated vertical MP4 clips and four original mascot channels.

## Features
- Infinite feed: appends 8 new cards as the sentinel approaches the viewport.
- Four local 9:16 MP4 clips: CEO Capybara, Crypto Pigeon, Finance Frog, and Wi-Fi Raccoon.
- Videos autoplay muted when their cards enter the viewport, loop continuously, and pause when scrolled away.
- Per-card sound toggle (browser autoplay policies may require a user click before audio is allowed).
- Global pause/resume, session timer, clip counter, likes, and reset.
- No API keys, backend, or external content API required.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Regenerate the videos

Requires Python 3 and FFmpeg available on PATH.

```bash
npm run generate:videos
```

The generator uses the bundled mascot WebP files and produces six-second, 720x1280, 24 FPS H.264 MP4 clips in `public/videos/`.

## Notes
- The four MP4s are locally generated motion-graphic clips based on the mascot artwork, not AI-generated full character animation.
- Infinite scroll reuses the four local video clips while generating new text/tag combinations.
- This is a satirical UI prototype, not a validated attention or cognitive-performance measurement tool.
