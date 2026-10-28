const projects = [
  {
    name: "LOAN DEFAULT RISK DASHBOARD",
    category: "DATA ANALYTICS PROJECT",
    tools: "Loan data · Exploratory data analysis · Risk visualization · Dashboard",
    title: "Loan Default Risk Dashboard",
    description:
      "Processed and explored loan-related data to examine borrower characteristics, loan distributions, and patterns associated with default risk. Developed a dashboard with key indicators, summary metrics, and visual comparisons to make risk patterns easier to interpret.",
    theme: "theme-orange",
  },
  {
    name: "MENTAL HEALTH SCORE PREDICTION",
    category: "MACHINE LEARNING PROJECT",
    tools: "Python · Pandas · NumPy · Scikit-learn · Matplotlib",
    title: "Mental Health Score Prediction",
    description:
      "Cleaned and preprocessed a mental health dataset, handled missing values, and used exploratory data analysis to understand feature distributions. Examined relationships with the target score and developed a machine learning pipeline for prediction, evaluated with regression metrics.",
    theme: "theme-lilac",
    image: "public/Mental-health.png",
  },
];

const windowElement = document.querySelector("#portfolio-window");
const windowTitle = document.querySelector("#window-title");
const windowContent = document.querySelector("#window-content");
const footerMessage = document.querySelector("#footer-message");
const menuButton = document.querySelector("#menu-button");
const menuPopover = document.querySelector("#menu-popover");
const toast = document.querySelector("#toast");
const introScreen = document.querySelector("#intro-screen");
let toastTimeout;

const viewTitles = {
  work: "SHREYA GUPTA — SELECTED WORK",
  about: "SHREYA GUPTA — ABOUT ME",
  archive: "SHREYA GUPTA — BEYOND THE CODE",
  resume: "SHREYA GUPTA — RESUME",
  contact: "SHREYA GUPTA — CONTACT",
  project: "SHREYA GUPTA — PROJECT FILE",
};

function showView(name) {
  const view = document.querySelector(`[data-panel="${name}"]`);
  if (!view) return;

  document.querySelectorAll(".view").forEach((panel) => {
    panel.hidden = panel !== view;
    panel.classList.toggle("active", panel === view);
  });
  windowTitle.textContent = viewTitles[name] || viewTitles.work;
  footerMessage.textContent =
    name === "contact"
      ? "OPEN TO INTERNSHIP OPPORTUNITIES."
      : "AI, DATA & SOFTWARE FOR REAL-WORLD PROBLEMS.";
  windowElement.classList.remove("is-minimized", "is-closed");
  windowContent.scrollTop = 0;
  menuPopover.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[Number(button.dataset.project)];
    if (!project) return;
    document.querySelector("#project-kicker").textContent = project.category;
    document.querySelector("#project-heading").textContent = project.title;
    document.querySelector("#project-description").textContent =
      project.description;
    document.querySelector("#project-tools").textContent =
      `TOOLS & FOCUS: ${project.tools}`;
    const artwork = document.querySelector("#project-detail-art");
    artwork.className = `project-detail-art ${project.theme}`;
    artwork.innerHTML = project.image
      ? `<img src="${project.image}" alt="${project.name} project screenshot" /><span>${project.name}</span>`
      : "";
    artwork.setAttribute("aria-label", `${project.name} project artwork`);
    artwork.dataset.projectName = project.name;
    showView("project");
  });
});

document.querySelector("#back-to-work").addEventListener("click", () => {
  showView("work");
});

document.querySelector("#explore-button").addEventListener("click", () => {
  showView("work");
  windowContent.scrollTo({ top: 0, behavior: "smooth" });
});

menuButton.addEventListener("click", () => {
  menuPopover.hidden = !menuPopover.hidden;
  menuButton.setAttribute("aria-expanded", String(!menuPopover.hidden));
});

document.querySelector("#close-window").addEventListener("click", () => {
  windowElement.classList.add("is-closed");
  showToast("Window closed — choose a file or press Explore to reopen.");
});

document.querySelector("#minimize-window").addEventListener("click", () => {
  windowElement.classList.toggle("is-minimized");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menuPopover.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    windowElement.classList.remove("is-minimized");
  }
});

function updateClock() {
  const now = new Date();
  document.querySelector("#copyright-year").textContent = now.getFullYear();
  document.querySelector("#clock").textContent = new Intl.DateTimeFormat(
    undefined,
    { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" },
  ).format(now);
}

updateClock();
window.setInterval(updateClock, 30_000);

const desktop = document.querySelector(".desktop");
const liquidCanvas = document.querySelector("#liquid-sculpture");
const liquidContext = liquidCanvas.getContext("2d");
const liquidBounds = liquidCanvas.parentElement;
const liquidReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const liquid = {
  active: false,
  strength: 0,
  pointerX: 0,
  pointerY: 0,
  targetX: 0,
  targetY: 0,
  phase: 0,
  frame: 0,
};

function angularDistance(a, b) {
  const delta = Math.atan2(Math.sin(a - b), Math.cos(a - b));
  return Math.abs(delta);
}

function drawLiquidSculpture(time = 0) {
  const rect = liquidBounds.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = liquidCanvas.width = Math.round(rect.width * ratio);
  const height = liquidCanvas.height = Math.round(rect.height * ratio);
  const ctx = liquidContext;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const cx = rect.width * 0.5;
  const cy = rect.height * 0.51;
  const rx = rect.width * 0.455;
  const ry = rect.height * 0.455;
  const idle = liquidReduceMotion.matches ? 0 : Math.sin(time * 0.00072) * 0.009;
  const pointCount = 96;
  const points = [];

  liquid.phase += (liquid.targetX - liquid.pointerX) * 0.035;
  liquid.pointerX += (liquid.targetX - liquid.pointerX) * 0.11;
  liquid.pointerY += (liquid.targetY - liquid.pointerY) * 0.11;
  liquid.strength += ((liquid.active ? 1 : 0) - liquid.strength) * 0.075;

  const pointerAngle = Math.atan2(liquid.pointerY - cy, liquid.pointerX - cx);
  const pointerDistance = Math.hypot(liquid.pointerX - cx, liquid.pointerY - cy);

  for (let i = 0; i <= pointCount; i += 1) {
    const angle = (i / pointCount) * Math.PI * 2;
    const contour =
      1 +
      0.045 * Math.sin(angle * 2.05 - 0.55) +
      0.028 * Math.sin(angle * 3.15 + 1.1) +
      0.012 * Math.sin(angle * 5.12 - 0.2) +
      idle;

    const distanceFromPointer = angularDistance(angle, pointerAngle);
    const primary = Math.exp(-Math.pow(distanceFromPointer / 0.31, 2));
    const shoulder = Math.exp(-Math.pow(distanceFromPointer / 0.58, 2));
    const farRipple = Math.sin(distanceFromPointer * 8.4 - liquid.phase * 2.2) *
      Math.exp(-distanceFromPointer * 1.35);
    const pointerBias = pointerDistance > 3 ? pointerDistance / Math.max(rx, ry) : 0;
    const deformation = liquid.strength * (
      0.085 * primary * (pointerBias > 0.9 ? 0.25 : 1) +
      0.038 * shoulder * farRipple -
      0.027 * shoulder
    );

    const radiusX = rx * (contour + deformation);
    const radiusY = ry * (contour + deformation);
    points.push({
      x: cx + Math.cos(angle) * radiusX,
      y: cy + Math.sin(angle) * radiusY,
    });
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length - 1; i += 1) {
    const midX = (points[i].x + points[i + 1].x) * 0.5;
    const midY = (points[i].y + points[i + 1].y) * 0.5;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  ctx.closePath();

  const gradient = ctx.createLinearGradient(rect.width * 0.08, rect.height * 0.08, rect.width * 0.92, rect.height * 0.88);
  gradient.addColorStop(0, "#9a62ed");
  gradient.addColorStop(0.28, "#8750e9");
  gradient.addColorStop(0.58, "#6448e5");
  gradient.addColorStop(0.84, "#3c78ef");
  gradient.addColorStop(1, "#8a62eb");
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.save();
  ctx.clip();
  const upperLight = ctx.createRadialGradient(rect.width * 0.30, rect.height * 0.20, 0, rect.width * 0.30, rect.height * 0.20, rect.width * 0.46);
  upperLight.addColorStop(0, `rgba(239,229,255,${0.34 + liquid.strength * 0.08})`);
  upperLight.addColorStop(0.18, "rgba(213,198,255,.18)");
  upperLight.addColorStop(0.62, "rgba(163,130,255,0)");
  ctx.fillStyle = upperLight;
  ctx.fillRect(0, 0, rect.width, rect.height);

  const blueDepth = ctx.createRadialGradient(rect.width * 0.78, rect.height * 0.75, 0, rect.width * 0.78, rect.height * 0.75, rect.width * 0.42);
  blueDepth.addColorStop(0, "rgba(77,151,250,.48)");
  blueDepth.addColorStop(0.42, "rgba(76,103,238,.18)");
  blueDepth.addColorStop(1, "rgba(70,43,178,0)");
  ctx.fillStyle = blueDepth;
  ctx.fillRect(0, 0, rect.width, rect.height);

  const edgeShade = ctx.createLinearGradient(0, rect.height * 0.25, rect.width, rect.height * 0.82);
  edgeShade.addColorStop(0, "rgba(255,255,255,.04)");
  edgeShade.addColorStop(0.72, "rgba(37,27,142,.03)");
  edgeShade.addColorStop(1, "rgba(35,30,128,.16)");
  ctx.fillStyle = edgeShade;
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.restore();

  desktop.style.setProperty("--liquid-strength", liquid.strength.toFixed(3));
  if (!liquidReduceMotion.matches) {
    liquid.frame = window.requestAnimationFrame(drawLiquidSculpture);
  }
}

function setLiquidPointer(event) {
  const rect = liquidBounds.getBoundingClientRect();
  liquid.targetX = event.clientX - rect.left;
  liquid.targetY = event.clientY - rect.top;
}

if (!liquidReduceMotion.matches) {
  liquidCanvas.addEventListener("pointerenter", (event) => {
    liquid.active = true;
    setLiquidPointer(event);
    desktop.classList.add("is-liquid-active");
  });
  liquidCanvas.addEventListener("pointermove", setLiquidPointer);
  liquidCanvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    liquid.active = true;
    liquidCanvas.setPointerCapture(event.pointerId);
    setLiquidPointer(event);
  });
  const settleTouch = (event) => {
    if (event.pointerType !== "touch") return;
    liquid.active = false;
  };
  liquidCanvas.addEventListener("pointerup", settleTouch);
  liquidCanvas.addEventListener("pointercancel", settleTouch);
  liquidCanvas.addEventListener("pointerleave", () => {
    liquid.active = false;
    liquid.targetX = liquidBounds.clientWidth * 0.5;
    liquid.targetY = liquidBounds.clientHeight * 0.5;
    desktop.classList.remove("is-liquid-active");
  });
  desktop.addEventListener("pointermove", (event) => {
    const bounds = desktop.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    desktop.style.setProperty("--shift-x", `${normalizedX * 8}px`);
    desktop.style.setProperty("--shift-y", `${normalizedY * 6}px`);
    desktop.style.setProperty("--liquid-rotate", `${normalizedX * 0.7}deg`);
    desktop.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    desktop.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  });
  desktop.addEventListener("pointerenter", () => {
    desktop.classList.add("is-hovering");
  });
  desktop.addEventListener("pointerleave", () => {
    desktop.classList.remove("is-hovering");
    desktop.style.setProperty("--shift-x", "0px");
    desktop.style.setProperty("--shift-y", "0px");
    desktop.style.setProperty("--liquid-rotate", "0deg");
    window.cancelAnimationFrame(liquid.frame);
    liquid.frame = window.requestAnimationFrame(drawLiquidSculpture);
  });

  liquid.targetX = liquidBounds.clientWidth * 0.5;
  liquid.targetY = liquidBounds.clientHeight * 0.5;
  liquid.pointerX = liquid.targetX;
  liquid.pointerY = liquid.targetY;
  liquid.frame = window.requestAnimationFrame(drawLiquidSculpture);
}

if (liquidReduceMotion.matches) {
  drawLiquidSculpture();
}

window.addEventListener("resize", () => {
  window.cancelAnimationFrame(liquid.frame);
  drawLiquidSculpture(performance.now());
});

const introEntry = document.querySelector("#intro-entry");
const introCinema = document.querySelector("#intro-cinema");
const introVideo = document.querySelector("#intro-video");
const introAudio = document.querySelector("#intro-audio");
const introEnter = document.querySelector("#intro-enter");
const introSkip = document.querySelector("#intro-skip");
const introSound = document.querySelector("#intro-sound");
const introSoundLabel = document.querySelector("#intro-sound-label");
const replayIntro = document.querySelector("#replay-intro");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let introRunId = 0;
let introTimeout;
let introRevealTimeout;
let introAudioCheck;
let introAudioFade;
let introTransitionTimeout;
let audioAvailable = false;

function clearIntroTimers() {
  window.clearTimeout(introTimeout);
  window.clearTimeout(introRevealTimeout);
  window.clearTimeout(introTransitionTimeout);
  window.clearTimeout(introAudioCheck);
  window.clearInterval(introAudioFade);
}

function setSoundState(enabled) {
  introSound.setAttribute("aria-pressed", String(enabled));
  introSound.setAttribute("aria-label", enabled ? "Mute background music" : "Enable background music");
  introSoundLabel.textContent = enabled ? "MUTE" : "SOUND";
}

function fadeAudioOut(onComplete) {
  window.clearInterval(introAudioFade);
  const startingVolume = introAudio.volume;
  introAudioFade = window.setInterval(() => {
    introAudio.volume = Math.max(0, introAudio.volume - 0.06);
    if (introAudio.volume <= 0) {
      window.clearInterval(introAudioFade);
      introAudio.pause();
      introAudio.currentTime = 0;
      introAudio.volume = startingVolume;
      setSoundState(false);
      onComplete?.();
    }
  }, 40);
}

async function checkAndPlayMusic(runId) {
  try {
    const response = await fetch(introAudio.src, { method: "HEAD" });
    if (!response.ok) throw new Error("Audio unavailable");
    audioAvailable = true;
    introSound.classList.add("is-ready");
    introAudio.volume = 0.18;
    await introAudio.play();
    setSoundState(true);
  } catch (error) {
    if (runId !== introRunId) return;
    audioAvailable = false;
    introSound.classList.remove("is-ready");
  }
}

function finishIntro() {
  const runId = introRunId;
  clearIntroTimers();
  introVideo.pause();
  introCinema.classList.remove("is-reveal", "is-fallback");
  introScreen.classList.add("is-leaving");
  document.querySelector("#home").inert = false;

  if (!introAudio.paused && audioAvailable) {
    fadeAudioOut(() => {
      if (runId !== introRunId) return;
      introTransitionTimeout = window.setTimeout(hideIntro, 650);
    });
  } else {
    introTransitionTimeout = window.setTimeout(hideIntro, 650);
  }
}

function hideIntro() {
  introScreen.hidden = true;
  introScreen.classList.remove("is-leaving");
  document.querySelector("#explore-button").focus({ preventScroll: true });
}

function showFinalReveal(runId) {
  if (runId !== introRunId) return;
  introCinema.classList.add("is-reveal");
  introRevealTimeout = window.setTimeout(finishIntro, 1450);
}

function startFallbackSequence(runId) {
  if (runId !== introRunId) return;
  introCinema.classList.add("is-fallback");
  introTimeout = window.setTimeout(() => showFinalReveal(runId), 6100);
}

function playCinematicIntro() {
  const runId = ++introRunId;
  clearIntroTimers();
  introEntry.hidden = true;
  introCinema.hidden = false;
  introCinema.classList.remove("is-fallback", "is-reveal");
  introVideo.currentTime = 0;
  introScreen.hidden = false;
  document.querySelector("#home").inert = true;
  setSoundState(false);
  introSound.classList.remove("is-ready");
  introSkip.focus({ preventScroll: true });

  introAudioCheck = window.setTimeout(() => checkAndPlayMusic(runId), 0);

  if (reduceMotion.matches) {
    startFallbackSequence(runId);
    return;
  }

  const beginVideo = () => {
    introVideo.play()
      .then(() => {
        const revealDelay = Math.max(900, (introVideo.duration || 7) * 1000 - 1600);
        introRevealTimeout = window.setTimeout(() => showFinalReveal(runId), revealDelay);
      })
      .catch(() => startFallbackSequence(runId));
  };

  if (introVideo.readyState >= 2) beginVideo();
  else {
    introVideo.load();
    introVideo.addEventListener("loadeddata", beginVideo, { once: true });
    introTimeout = window.setTimeout(() => startFallbackSequence(runId), 2400);
  }
}

function openIntroReplay() {
  introRunId += 1;
  clearIntroTimers();
  introVideo.pause();
  introScreen.hidden = false;
  introScreen.classList.remove("is-leaving");
  introCinema.hidden = true;
  introCinema.classList.remove("is-fallback", "is-reveal");
  introEntry.hidden = false;
  introSound.classList.remove("is-ready");
  setSoundState(false);
  document.querySelector("#home").inert = true;
  menuPopover.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  introEnter.focus({ preventScroll: true });
}

introEnter.addEventListener("click", playCinematicIntro);
introSkip.addEventListener("click", finishIntro);
replayIntro.addEventListener("click", openIntroReplay);
introVideo.addEventListener("ended", () => {
  if (!introCinema.classList.contains("is-fallback")) finishIntro();
});
introVideo.addEventListener("error", () => {
  if (!introCinema.hidden) startFallbackSequence(introRunId);
});
introSound.addEventListener("click", async () => {
  if (!audioAvailable) return;
  if (introAudio.paused) {
    try {
      await introAudio.play();
      setSoundState(true);
    } catch {
      setSoundState(false);
    }
  } else {
    introAudio.pause();
    setSoundState(false);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !introScreen.hidden) finishIntro();
});

document.querySelector("#home").inert = true;
introScreen.hidden = false;
introEnter.focus({ preventScroll: true });
