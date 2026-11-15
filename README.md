# ⚡ Blink, Know, Repeat — Official Channel Website

> **"Why does your toaster need Wi-Fi? How did phone chips become a national security issue? And why does a CEO need 47 slides to explain a 'simpler strategy'?"**  
> *Shorts and deep dives on AI, tech, business, and world affairs. What happened, who benefits, and why it matters.*  
> **Daily @ 7 PM** • **Founding 1,000 Subscribers**

---

## 🚀 Live Demo & Development

### 1. Run on Localhost
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build Static Site for GitHub Pages
```bash
npm run build
```
This generates the zero-dependency production bundle inside `dist/`.

---

## 🌐 Deploy to GitHub Pages (Static Hosting)

### Method A: Automated GitHub Actions (Recommended)
This repository includes `.github/workflows/deploy.yml`.
1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Every push to `main` will build and publish automatically.

### Method B: Deploy `dist` folder directly
You can also deploy via `gh-pages`:
```bash
npx gh-pages -d dist
```

---

## 🎨 Design System & Visual Identity
- **Background Obsidian:** `#070d18` / `#0a1426`
- **Electric Volt Accent:** `#d9fa22` (The lightning bolt brand color)
- **Cream / White Crisp Text:** `#f5f1e8` (The eye outline & text)
- **Slate Subtitle Tone:** `#889bb8`
- **Typography:** *Syne* (Impact Headlines), *Plus Jakarta Sans* (Editorial Body), *JetBrains Mono* (Radar & Timestamps)

---

## ⚡ Features
- **Cinematic Video Player:** Built-in interactive player showcasing the 30-second premiere trailer (`assets/premiere.mp4`) with custom chapter marks and speed controls.
- **The 3 Lenses Framework Simulator:** Interactive exploration of *What Happened?*, *Who Benefits?*, and *Why It Matters?*.
- **Live 7 PM Countdown:** Synced countdown timer to today's 7:00 PM drop with 1-click `.ics` calendar sync.
- **Holographic Founding Member Pass Generator:** Interactive pass minter that creates a personalized day-one card with serial number and confetti celebration.
- **Sound FX Engine:** Synthesized Web Audio API sound effects for interactive clicks, lightning zaps, and subscriber milestones.
- **Intel Radar Archive:** Filterable cards across Tech Paradoxes, AI Realities, Business, and World Affairs.
- **Patreon & Official Dispatch Integration:** Direct spotlight for Patreon tiers and hello dispatch to `blinkknowrepeat@gmail.com`.
