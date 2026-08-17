# ⚡ APEX TURBO Pro // Next-Gen Gaming Performance Monitor & System Booster Suite

![APEX TURBO Gaming Suite](https://img.shields.io/badge/DirectX_12-Ultimate-00ff88?style=for-the-badge&logo=windows)
![Vulkan](https://img.shields.io/badge/Vulkan-1.3_Ready-red?style=for-the-badge&logo=vulkan)
![NVIDIA Reflex](https://img.shields.io/badge/NVIDIA_Reflex-Ultra_Low_Latency-76B900?style=for-the-badge&logo=nvidia)
![DLSS 3.5 & FSR](https://img.shields.io/badge/AI_Upscaling-DLSS_3.5_/_FSR_3-9333ea?style=for-the-badge)

A state-of-the-art, cyberpunk-inspired **Gaming Performance Monitor, Real-Time Hardware Telemetry Suite, and System Turbo Booster**. Built with React 19, Tailwind CSS v4, Vite, Web Audio API, Canvas Rendering, and WebGL telemetry detection.

---

## 🎮 Core Features & Architecture

### 1. 📊 Real-Time Hardware Telemetry & Dashboard
- **Ultra-High-Precision FPS Meter**: Real-time FPS, 1% Lows, 0.1% Lows, microsecond frame time delivery (`ms`), jitter variance, and dropped frame tracker.
- **Radial Arc Telemetry Gauges**: CPU load, GPU load, RAM allocation, and VRAM memory footprint.
- **16-Thread Multi-Core CPU Heatmap**: Visualizes per-thread load distribution and core thermal states.
- **Multi-Metric Canvas Telemetry Chart**: Real-time 60Hz smooth bezier line charts with configurable time windows (`15s`, `30s`, `60s`) and toggleable series (FPS, Frame Time, CPU, GPU, RAM, CPU/GPU Temp).
- **Deep Hardware Inspectors**: GPU core & memory clocks, TDP power draw (W), fan speeds (RPM), hotspot temps, CPU voltage, NVMe disk I/O, and gaming network ping & jitter.

### 2. 🚀 Turbo Booster & Overclocking Station
- **1-Click Super Boost Engine**: Executes a 5-stage extreme optimization protocol:
  1. Terminates background bloatware tasks.
  2. Purges standby memory cache and flushes shader cache.
  3. Locks CPU Ultimate Performance power plan and unparks all cores.
  4. Bypasses Nagle TCP delay and routes gaming packets to esports QoS nodes.
  5. Synchronizes NVIDIA Reflex / AMD Anti-Lag input pipeline (drops latency by up to 68%).
- **8 Actionable Optimization Modules**: Individual toggles for Reflex Low-Latency, Smart RAM Purge, CPU Turbo Lock, GPU Boost Target, Network QoS, Windows Telemetry Suppressor, Adaptive G-Sync Lock, and DLSS/FSR Frame Gen.
- **GPU Overclocking & Voltage Control**: Interactive sliders for Core Clock Offset (+MHz), Memory Clock Offset (+MHz), Power Limit (%), and Temperature Target (°C).
- **Overclock Stress & Stability Validator**: Runs instant stress validation tests.
- **Acoustic Fan Curve Profiles**: Auto Intelligent, Silent Stealth, Turbo Hurricane 100%, and Custom user curve.
- **Interactive AI Super Resolution Comparator**: Live split-screen before/after slider demonstrating native vs DLSS/FSR neural upscaling.

### 3. 🕹️ Game Library & Optimization Profiles
- Preloaded with 10 AAA & Esports titles (*Cyberpunk 2077, Valorant, CS2, Warzone, Black Myth: Wukong, Apex Legends, Elden Ring, Forza Horizon 5*, etc.).
- Categorized by Genre (*All, FPS / Esports, Open-World / RPG, Battle Royale, Racing*).
- Per-game optimization presets (*Esports Maximum FPS, Ray-Tracing Cinematic, Balanced 144Hz, Battery Saver*).
- **Game Session Launcher & HUD**: Animated pre-launch system checklist, active playtime tracking, and live session stats.
- **Custom Game Manager**: Add custom game executables with custom profiles.

### 4. 🔥 3D Particle & Shader Stress Lab (Benchmark)
- Interactive real-time WebGL/Canvas 3D Particle Vortex stress test with up to **25,000 active particles**.
- Realistic GPU draw calls, physics turbulence, and simulated thermal buildup.
- Configurable test durations (15s Quick Run, 30s Extended Run) and particle densities.
- **AeroBench Certification**: Calculates total AeroScore, Average FPS, 1% Lows, frame consistency index, rating grade (S+ Godlike, S-Tier, A-Tier), and celebration confetti.

### 5. 📑 Gaming Task & Process Manager
- Real-time active task monitor tracking CPU %, RAM (MB), GPU %, and Priority for background applications (browsers, Discord, Steam, launchers, antivirus).
- **1-Click Bloatware Purge**: Cleans all high-impact background tasks in one click.
- Process Search and dynamic filtering.
- Assign **Realtime CPU Priority** or **End Task** directly.

### 6. 🪟 Detachable Floating In-Game Mini HUD Overlay
- Draggable and dockable floating HUD widget.
- Real-time glowing FPS badge (*Smooth / Good / Lag*), frametime progress bar, and mini hardware gauges.
- Expandable multi-tab popup tray (*Overview Gauges, Live Graphs, Quick Boost Switches, Hardware Specs*).

### 7. 🎨 RGB Chroma Themes & Procedural Web Audio
- **6 RGB Accent Themes**: Cyber Matrix (#00ff88), Neon Cyberpunk (#06b6d4), Plasma Violet (#c084fc), Solar Amber (#fbbf24), Rage Blood (#ff4655), and Obsidian Stealth (#38bdf8).
- **Zero-Dependency Procedural Web Audio Engine**: Synthesizes futuristic UI clicks, turbo boost power-up hum, overclock fan whines, and success chords using standard Web Audio API oscillators.
- **Diagnostics & Log Exporter**: Analyzes CPU vs GPU load bottlenecks and downloads JSON diagnostic snapshots.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 19, JavaScript (ESM)
- **Styling**: Tailwind CSS v4, Custom Cyberpunk CSS Design System
- **Icons**: Lucide React
- **Graphics**: HTML5 2D Canvas & WebGL Particle Simulation
- **Audio**: Native Web Audio API Procedural Synthesizer
- **Bundlers**: Vite 6 (Primary Dev/Build) & Webpack 5 (CI/CD compatible)

---

## 🚀 Quick Start & Development

```bash
# Install dependencies
npm install

# Start Vite dev server (binds to 0.0.0.0:3000)
npm run dev

# Build production bundle with Vite
npm run build

# Build production bundle with Webpack
npm run webpack
```

---

## 📄 License
MIT License. Created with ❤️ for high-performance gaming enthusiasts.
