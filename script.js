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
let introTimeout;
let introSequence;
let introFinaleTimeout;

const viewTitles = {
  work: "SHREYA GUPTA — SELECTED WORK",
  about: "SHREYA GUPTA — ABOUT ME",
  archive: "SHREYA GUPTA — BEYOND THE CODE",
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

function finishIntro() {
  window.clearTimeout(introTimeout);
  window.clearTimeout(introFinaleTimeout);
  window.clearInterval(introSequence);
  introScreen.classList.add("is-leaving");
  document.querySelector("#home").inert = false;
  window.setTimeout(() => {
    introScreen.hidden = true;
    introScreen.classList.remove("is-leaving", "is-finale");
  }, 850);
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  introScreen.hidden = true;
} else {
  document.querySelector("#home").inert = true;
  introScreen.hidden = false;
  const introWords = [...introScreen.querySelectorAll(".intro-word")];
  let activeWord = 0;
  introWords[activeWord].classList.add("is-active");
  introSequence = window.setInterval(() => {
    introWords[activeWord].classList.remove("is-active");
    activeWord += 1;
    if (activeWord < introWords.length) {
      introWords[activeWord].classList.add("is-active");
    } else {
      window.clearInterval(introSequence);
    }
  }, 800);
  introFinaleTimeout = window.setTimeout(() => {
    introWords[activeWord].classList.remove("is-active");
    introScreen.classList.add("is-finale");
  }, 3050);
  introTimeout = window.setTimeout(finishIntro, 5400);
  document.querySelector("#intro-skip").focus({ preventScroll: true });
  document.querySelector("#intro-explore").addEventListener("click", finishIntro);
  document.querySelector("#intro-skip").addEventListener("click", finishIntro);
}
