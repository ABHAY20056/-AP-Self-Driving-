/* ─────────────────────────────────────────
   AP-Self Driving Car — main.js
   Responsive + Branded
   ───────────────────────────────────────── */

const carCanvas     = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");
const carCtx        = carCanvas.getContext("2d");
const networkCtx    = networkCanvas.getContext("2d");

let road, cars, bestCar, traffic;

/* ── Layout helpers ── */
function isMobile() {
    return window.innerWidth <= 768;
}

function getCanvasSizes() {
    const HEADER = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue("--header-h")) || 54;
    const FOOTER = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue("--footer-h")) || 36;
    const availH = window.innerHeight - HEADER - FOOTER;
    const w = window.innerWidth;

    if (isMobile()) {
        const carH = Math.floor(availH * 0.58);
        const netH = availH - carH;
        return { carW: w, carH, netW: w, netH };
    } else {
        const carW = Math.min(220, Math.floor(w * 0.3));
        const netW = w - carW;
        return { carW, carH: availH, netW, netH: availH };
    }
}

/* ── Init simulation ── */
function initSim() {
    const { carW } = getCanvasSizes();
    road = new Road(carW / 2, carW * 0.9);
    cars = generateCars(100);
    bestCar = cars[0];

    if (localStorage.getItem("AP_bestBrain")) {
        for (let i = 0; i < cars.length; i++) {
            cars[i].brain = JSON.parse(localStorage.getItem("AP_bestBrain"));
            if (i !== 0) NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }

    traffic = [
        new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
        new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    ];
}

/* ── Controls ── */
function save() {
    localStorage.setItem("AP_bestBrain", JSON.stringify(bestCar.brain));
    // bump generation counter
    const gen = parseInt(localStorage.getItem("AP_generation") || "1");
    localStorage.setItem("AP_generation", gen + 1);
    showToast("✅ Best brain saved! Refresh to train Gen " + (gen + 1));
}

function discard() {
    localStorage.removeItem("AP_bestBrain");
    localStorage.setItem("AP_generation", "1");
    showToast("🗑️ Brain discarded — restarting...");
    setTimeout(() => location.reload(), 900);
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 2500);
}

/* ── Responsive resize ── */
window.addEventListener("resize", () => {
    const { carW } = getCanvasSizes();
    road = new Road(carW / 2, carW * 0.9);
    // reposition cars to new lane centers
    if (cars) {
        const savedBrain = bestCar ? JSON.stringify(bestCar.brain) : null;
        cars.forEach((c, i) => {
            c.x = road.getLaneCenter(1);
            if (savedBrain) {
                c.brain = JSON.parse(savedBrain);
                if (i !== 0) NeuralNetwork.mutate(c.brain, 0.1);
            }
        });
    }
    if (traffic) {
        const lc = [1, 0, 2, 0, 1, 1, 2];
        traffic.forEach((c, i) => c.x = road.getLaneCenter(lc[i]));
    }
});

/* ── Generation display ── */
const genDisplay = parseInt(localStorage.getItem("AP_generation") || "1");
document.getElementById("genCount").textContent = genDisplay;

/* ── Animation loop ── */
function animate(time) {
    const { carW, carH, netW, netH } = getCanvasSizes();

    // Set canvas dimensions each frame (handles resize)
    carCanvas.width     = carW;
    carCanvas.height    = carH;
    networkCanvas.width  = netW;
    networkCanvas.height = netH;

    // Update
    traffic.forEach(c => c.update(road.borders, []));
    cars.forEach(c => c.update(road.borders, traffic));

    bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));

    // Draw car canvas
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carH * 0.7);
    road.draw(carCtx);
    traffic.forEach(c => c.draw(carCtx));
    carCtx.globalAlpha = 0.2;
    cars.forEach(c => c.draw(carCtx));
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);
    carCtx.restore();

    // Draw network canvas
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    // Live score
    document.getElementById("scoreVal").textContent =
        Math.abs(Math.round(bestCar.y));

    requestAnimationFrame(animate);
}

/* ── Boot ── */
initSim();
animate();
