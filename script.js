// Elements -------------------------------------------------
const timeEl   = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn   = document.getElementById("lap");
const lapList  = document.getElementById("lapList");

// State ----------------------------------------------------
let startTime = 0;       // timestamp when timer started
let elapsed   = 0;       // running total in ms
let rafId     = null;    // requestAnimationFrame handle

// Helpers --------------------------------------------------
const format = ms => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis  = ms % 1000;

  return `${String(minutes).padStart(2,"0")}:` +
         `${String(seconds).padStart(2,"0")}.` +
         `${String(millis).padStart(3,"0")}`;
};

const render = () => {
  timeEl.textContent = format(elapsed);
};

// Loop -----------------------------------------------------
function tick(now) {
  elapsed = now - startTime;
  render();
  rafId = requestAnimationFrame(tick);
}

// Controls -------------------------------------------------
startBtn.onclick = () => {
  startTime = performance.now() - elapsed;     // resume support
  rafId = requestAnimationFrame(tick);

  // toggle button states
  startBtn.disabled = true;
  pauseBtn.disabled = lapBtn.disabled = false;
  resetBtn.disabled = elapsed === 0;
};

pauseBtn.onclick = () => {
  cancelAnimationFrame(rafId);
  render();

  startBtn.textContent = "Resume";
  startBtn.disabled = false;
  pauseBtn.disabled = lapBtn.disabled = true;
  resetBtn.disabled = false;
};

resetBtn.onclick = () => {
  cancelAnimationFrame(rafId);
  elapsed = 0;
  render();
  lapList.innerHTML = "";
  startBtn.textContent = "Start";

  pauseBtn.disabled = lapBtn.disabled = resetBtn.disabled = true;
  startBtn.disabled = false;
};

lapBtn.onclick = () => {
  const li = document.createElement("li");
  li.textContent = format(elapsed);
  lapList.appendChild(li);
};

// Initial view
render();
