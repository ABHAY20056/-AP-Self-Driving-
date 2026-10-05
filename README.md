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

## 🎮 How to Train

1. Watch 100 cars drive — most will crash quickly at first
2. When one car navigates traffic well → click **💾 Save**
3. Refresh the page → next generation starts from that brain (with mutations)
4. Repeat 10–20 times → car drives smoothly through traffic
5. Click **🗑️ Discard** to reset and start from scratch

---

## 🧪 Tests

The neural network, mutation, geometry (ray-segment intersection, polygon
collision) and road-lane math are pure functions with no DOM or canvas
dependency, so they're unit-tested directly in Node:

```bash
npm test
```

**23 tests** across `utils.js`, `network.js` and `road.js`, covering:
- `lerp`/`getIntersection`/`polysIntersect`/`getRGBA`: the exact math the
  sensors and weight-visualizer rely on, including edge cases (parallel
  segments, endpoint touches, non-overlapping boxes).
- `NeuralNetwork.feedForward`: confirms the output layer size matches the
  network shape and every output is a binary 0/1 (step-activation, no
  partial-firing outputs).
- `NeuralNetwork.mutate`: confirms `amount=0` changes nothing, `amount=1`
  replaces nearly every weight, and every weight/bias stays within `[-1, 1]`
  regardless of mutation amount.
- `Road.getLaneCenter`: lane spacing, symmetry around the centerline, and a
  non-default lane count.

`car.js` and `sensor.js` aren't unit-tested here since they're built around
`Image`/`Canvas`, which would need a browser or a heavier DOM shim (jsdom) to
simulate meaningfully — they're exercised instead by actually running the sim.
CI (`.github/workflows/ci.yml`) runs the suite on Node 20 and 22.

## 🔧 What was fixed in this pass

- **Corrupt/blocked `localStorage` could crash the whole page on load** (e.g.
  a hand-edited saved brain, or Safari private browsing throwing on access).
  All reads/writes now go through a safe wrapper that falls back to a fresh
  random brain instead of throwing.
- **The car canvas was resized every single animation frame**, even when its
  size hadn't changed — this resets the canvas backing store and is wasted
  work 60 times a second while already drawing 100 cars + a live network
  graph. It now only resizes when the dimensions actually change.
- **Caching headers could serve a stale build for up to an hour** (`index.html`)
  or a day (`.js`/`.css`) after a deploy, since none of the asset filenames
  are hashed. Both `netlify.toml` and `vercel.json` now set `no-cache` on
  HTML and `must-revalidate` on JS/CSS.
- **`user-scalable=no` in the viewport meta tag disabled pinch-zoom**, which
  is an accessibility issue — removed.
- `bestCar` selection changed from two separate array passes
  (`Math.min(...cars.map(...))` then `.find`) to a single `reduce`.

## ⚠️ Limitations

- Training is manual: there's no automatic multi-generation loop while the
  tab is open — you save the best car's brain, refresh, and the next
  generation starts slightly mutated from it. That's by design (matches the
  README above), not a bug, but don't describe it as "fully autonomous
  continuous training" on a resume.
- The binary step activation (strict threshold, no sigmoid/ReLU) means
  outputs are always exactly 0 or 1 — there's no notion of "how confident"
  a decision was, which is a real simplification versus a production NN.

---

## 📜 License
MIT — © 2025 AP-Self Driving Car
