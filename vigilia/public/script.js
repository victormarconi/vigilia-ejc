let teams = [];
let activeIndex = 0;
let timerId;
let slideToken = 0;

const carousel = document.querySelector("[data-carousel]");
const slide = document.querySelector("[data-slide]");
const portrait = document.querySelector("[data-portrait]");
const portraitImg = document.querySelector("[data-portrait-img]");
const portraitFallback = document.querySelector("[data-portrait-fallback]");
const teamEl = document.querySelector("[data-team]");
const saintEl = document.querySelector("[data-saint]");
const descriptionEl = document.querySelector("[data-description]");
const virtueEl = document.querySelector("[data-virtue]");
const mottoEl = document.querySelector("[data-motto]");
const dotsEl = document.querySelector("[data-dots]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const prayerForm = document.querySelector("[data-prayer-form]");
const formStatus = document.querySelector("[data-form-status]");
const teamSelect = document.querySelector("[data-team-select]");
const apiPrefix = getApiPrefix();

function getApiPrefix() {
  const pathname = window.location.pathname;
  return pathname === "/vigilia" || pathname.startsWith("/vigilia/") ? "/vigilia" : "";
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${apiPrefix}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
    ...options
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Não foi possível concluir a ação.");
  }

  return payload;
}

async function loadTeams() {
  const payload = await requestJson("/api/teams");
  teams = payload.teams;
  renderTeamOptions();
  createDots();
  renderSlide(0);
  resetTimer();
}

function renderTeamOptions() {
  teamSelect.innerHTML = '<option value="">Selecione</option>';
  teams.forEach((team) => {
    const option = document.createElement("option");
    option.value = team.name;
    option.textContent = team.name;
    teamSelect.append(option);
  });
}

async function renderSlide(index) {
  if (!teams.length) {
    saintEl.textContent = "Nenhuma equipe cadastrada";
    descriptionEl.textContent = "Entre no admin para cadastrar as equipes da Vigília.";
    return;
  }

  const item = teams[index];
  const currentToken = ++slideToken;
  const loadedImage = item.imageUrl ? await preloadImage(item.imageUrl).catch(() => null) : null;

  if (currentToken !== slideToken) {
    return;
  }

  const primary = item.primaryColor || "#3f7c69";
  const secondary = item.secondaryColor || "#c99633";
  slide.classList.remove("is-changing");
  void slide.offsetWidth;
  slide.classList.add("is-changing");

  teamEl.textContent = `Equipe ${item.name}`;
  saintEl.textContent = item.saint;
  descriptionEl.textContent = item.description;
  virtueEl.textContent = item.virtue;
  mottoEl.textContent = item.motto;
  portrait.style.setProperty("--robe-a", primary);
  portrait.style.setProperty("--robe-b", secondary);
  portrait.style.setProperty(
    "--portrait-bg",
    `radial-gradient(circle at 50% 18%, rgba(255,255,255,.28), transparent 24%), linear-gradient(135deg, ${primary}, #17201f 60%, ${secondary})`
  );
  portrait.classList.remove("has-photo", "image-failed");
  if (item.imageUrl) {
    portrait.classList.add("has-photo");
  }
  portraitImg.hidden = !loadedImage;
  portraitFallback.hidden = Boolean(loadedImage);
  portraitImg.alt = loadedImage ? `${item.saint}, santo da equipe ${item.name}` : "";
  portraitImg.src = loadedImage || "";

  dotsEl.querySelectorAll(".dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
    dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
  });
}

function resetTimer() {
  window.clearInterval(timerId);
  timerId = window.setInterval(() => goToSlide(activeIndex + 1), 5500);
}

function goToSlide(index) {
  if (!teams.length) {
    return;
  }

  activeIndex = (index + teams.length) % teams.length;
  renderSlide(activeIndex);
  resetTimer();
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(src);
    image.onerror = reject;
    image.src = src;
  });
}

function createDots() {
  dotsEl.innerHTML = "";
  teams.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "dot";
    button.type = "button";
    button.setAttribute("aria-label", `Ver equipe ${item.name}`);
    button.addEventListener("click", () => goToSlide(index));
    dotsEl.append(button);
  });
}

async function submitPrayerRequest() {
  const data = new FormData(prayerForm);
  await requestJson("/api/prayer-requests", {
    method: "POST",
    body: JSON.stringify({
      nome: data.get("nome").trim(),
      idade: data.get("idade"),
      equipe: data.get("equipe"),
      pedido: data.get("pedido").trim()
    })
  });

  prayerForm.reset();
  formStatus.textContent = "Pedido enviado. A equipe da Vigília vai rezar por você.";
  window.setTimeout(() => {
    formStatus.textContent = "";
  }, 4500);
}

prevButton.addEventListener("click", () => goToSlide(activeIndex - 1));
nextButton.addEventListener("click", () => goToSlide(activeIndex + 1));

carousel.addEventListener("mouseenter", () => window.clearInterval(timerId));
carousel.addEventListener("mouseleave", resetTimer);

prayerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Enviando pedido...";
  submitPrayerRequest().catch((error) => {
    formStatus.textContent = error.message;
  });
});

loadTeams().catch((error) => {
  saintEl.textContent = "Erro ao carregar equipes";
  descriptionEl.textContent = error.message;
  teamSelect.innerHTML = '<option value="">Não foi possível carregar</option>';
});

portraitImg.addEventListener("error", () => {
  portrait.classList.add("image-failed");
  portraitImg.hidden = true;
  portraitFallback.hidden = false;
});
