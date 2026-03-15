# 🚗 AP-Self Driving Car

**AP-Self Driving Car** is a neural network simulation built **100% from scratch in vanilla JavaScript** — no TensorFlow, no PyTorch, no libraries of any kind.

The car learns to navigate multi-lane traffic through **neuroevolution** — spawning 100 agents per generation, selecting the best, mutating its brain, and repeating.

---

## ✨ Features

- 🧠 Neural network built from scratch (feedforward + mutation)
- 🟡 5-ray raycast sensor system for road & traffic detection
- 📊 Real-time animated neural network visualizer
- 💾 Brain persistence via `localStorage` across sessions
- 🔁 Neuroevolution training loop (100 cars/generation)
- 📱 Fully responsive — works on mobile & desktop
- 🎨 Dark UI with **AP-Self Driving Car** branding throughout

---

## 🚀 Deploy

### Netlify (Drag & Drop — 30 seconds)
1. Go to [netlify.com](https://netlify.com)
2. Drag this folder onto the dashboard
3. Live URL instantly ✅

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages (Auto-deploy on push)
Push to a GitHub repo → Settings → Pages → Source: GitHub Actions  
The included `.github/workflows/deploy.yml` handles the rest.

### Local
```bash
python3 -m http.server 8080
# open http://localhost:8080
```
> A local server is needed (not just file:// open) for the car sprite to load.

---

## 🎮 How to Train

1. Watch 100 cars drive — most will crash quickly at first
2. When one car navigates traffic well → click **💾 Save**
3. Refresh the page → next generation starts from that brain (with mutations)
4. Repeat 10–20 times → car drives smoothly through traffic
5. Click **🗑️ Discard** to reset and start from scratch

---

## 📁 Files

| File | Purpose |
|------|---------|
| `index.html` | Entry point with AP branding + responsive layout |
| `style.css` | Dark themed, mobile-first responsive styles |
| `main.js` | App entry — canvas sizing, animation loop, gen counter |
| `car.js` | Physics, polygon hitbox, AI brain integration |
| `network.js` | Neural network — feedforward + neuroevolution mutation |
| `sensor.js` | 5 raycasts detecting road edges and traffic |
| `road.js` | Road geometry and lane center calculation |
| `controls.js` | Keyboard + AI signal handling |
| `utils.js` | Math helpers: lerp, line intersection, polygon check |
| `visualizer.js` | Animated neural network canvas renderer |
| `car.png` | Car sprite |
| `netlify.toml` | Netlify deploy config |
| `vercel.json` | Vercel deploy config |
| `.github/workflows/deploy.yml` | GitHub Pages CI/CD |

---

## 📜 License
MIT — © 2025 AP-Self Driving Car
