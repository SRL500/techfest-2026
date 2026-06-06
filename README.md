# 🚀 Techfest 2026 — 3D Interactive Website
### IITB Campus Ambassador Task — Web Development (3D Design)

---

## ✅ WHAT THIS WEBSITE DOES

- 🌐 **3D Particle Globe** — 6,000 particles in a sphere using Three.js
- 🌀 **Scroll Animations** — Camera zooms through the globe as you scroll (GSAP ScrollTrigger)
- 💥 **Particle Explosion** — Globe explodes & re-forms when you hit the Events section
- 🪐 **Floating Orbs + Rings** — 3D rings and orbs orbit around the globe
- 🖱️ **Custom Cursor** — Smooth cursor with hover effects
- 📊 **Counter Animation** — Numbers count up in the hero section
- 🎨 **Mouse Parallax** — Globe reacts to mouse movement
- 📱 **Responsive** — Works on all screen sizes
- 📝 **Register Form** — Working form with validation and toast notification

---

## 🛠️ HOW TO RUN LOCALLY (Step-by-Step from Zero)

### STEP 1 — Install VS Code
Download from: https://code.visualstudio.com/
Open it after installing.

### STEP 2 — Install the "Live Server" extension in VS Code
- Open VS Code
- Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
- Search: **Live Server**
- Click Install (by Ritwick Dey)

### STEP 3 — Download this project
Put the entire `techfest3d` folder on your Desktop or Documents.

Your folder structure should look like:
```
techfest3d/
├── index.html
├── package.json
├── README.md
└── src/
    ├── main.js
    └── style.css
```

### STEP 4 — Open in VS Code
- Open VS Code
- File → Open Folder → Select `techfest3d`

### STEP 5 — Run with Live Server
- Right-click on `index.html` in the VS Code file explorer
- Click **"Open with Live Server"**
- Your browser opens at `http://127.0.0.1:5500`
- 🎉 The website is running!

---

## 🌍 HOW TO DEPLOY ON GITHUB PAGES (Free Hosting)

### STEP 1 — Create a GitHub account
Go to https://github.com → Sign Up (free)

### STEP 2 — Install Git
Download from https://git-scm.com/downloads
Run installer with default settings.
Verify: open Terminal/Command Prompt → type `git --version`

### STEP 3 — Create a new GitHub repository
- Go to https://github.com
- Click the **+** (top right) → **New repository**
- Name it: `techfest-2026`
- Set to **Public**
- Do NOT initialize with README (we already have one)
- Click **Create repository**

### STEP 4 — Push your code to GitHub
Open Terminal inside VS Code (`Ctrl+`` ` ```) and run these commands ONE BY ONE:

```bash
git init
git add .
git commit -m "Initial commit: Techfest 2026 3D website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/techfest-2026.git
git push -u origin main
```
(Replace `YOUR_USERNAME` with your actual GitHub username)

### STEP 5 — Enable GitHub Pages
- Go to your GitHub repo
- Click **Settings** (top tab)
- Scroll to **Pages** (left sidebar)
- Under "Source": select **main** branch, folder **/ (root)**
- Click **Save**
- Wait 2-3 minutes
- Your site is live at: `https://YOUR_USERNAME.github.io/techfest-2026`

---

## 🎬 HOW TO RECORD YOUR SCREEN

### Option A — OBS Studio (Best Quality, Free)
1. Download: https://obsproject.com
2. Open OBS → Sources → Add → **Display Capture**
3. Click **Start Recording**
4. Open your website, scroll through everything, show hover effects
5. Click **Stop Recording**
6. File saved to Videos folder as `.mkv` or `.mp4`

### Option B — Loom (Easiest, Free)
1. Go to https://loom.com
2. Sign up free → Install extension
3. Click Loom icon → Screen + Camera
4. Record your website demo
5. Gets a shareable link automatically ✅

---

## 📤 HOW TO SUBMIT

You need to submit **either**:
1. **GitHub link**: `https://github.com/YOUR_USERNAME/techfest-2026` (make repo public)
2. **Screen recording Drive link**: Upload `.mp4` to Google Drive → Right-click → Share → "Anyone with link" → copy link

---

## 🎨 HOW TO CUSTOMIZE (Make It Yours)

### Change Colors
In `src/style.css`, edit the `:root` variables at the top:
```css
:root {
  --purple: #7c6fff;   /* main accent color */
  --cyan:   #00e5ff;   /* secondary accent */
  --pink:   #ff4d9e;   /* tertiary accent */
}
```

### Change Particle Count
In `src/main.js`, line ~70:
```js
const PARTICLE_COUNT = 6000; // increase for more particles (may slow down)
```

### Change Events
In `index.html`, find the `events-grid` div and edit the event cards.

### Change Globe Size
In `src/main.js`, find `const r = 2 + ...` and change `2` to make the globe bigger/smaller.

---

## 🏆 TIPS TO IMPRESS THE JUDGES

1. **Add your own 3D model** — Download a free `.glb` from https://sketchfab.com and load it with GLTFLoader
2. **Add a timeline section** — Show the Techfest schedule with scroll-triggered reveals
3. **Add audio** — Subtle ambient music with a toggle button
4. **Add post-processing** — Bloom/glow effect (Three.js EffectComposer)
5. **Performance** — Keep FPS above 60 by reducing particle count if needed

---

Built with ❤️ for IITB Techfest 2026 Campus Ambassador
