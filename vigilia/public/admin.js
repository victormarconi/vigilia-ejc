const apiPrefix = getApiPrefix();
let teams = [];

const loginPanel = document.querySelector("[data-login-panel]");
const dashboard = document.querySelector("[data-admin-dashboard]");
const loginForm = document.querySelector("[data-admin-login]");
const adminStatus = document.querySelector("[data-admin-status]");
const requestsList = document.querySelector("[data-requests-list]");
const clearButton = document.querySelector("[data-clear-requests]");
const logoutButton = document.querySelector("[data-logout]");
const tabButtons = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll("[data-panel]");
const teamForm = document.querySelector("[data-team-form]");
const teamStatus = document.querySelector("[data-team-status]");
const teamsList = document.querySelector("[data-teams-list]");
const newTeamButton = document.querySelector("[data-new-team]");
const confirmModal = document.querySelector("[data-confirm-modal]");
const confirmText = document.querySelector("[data-confirm-text]");
const confirmDeleteButton = document.querySelector("[data-confirm-delete]");
const cancelDeleteButton = document.querySelector("[data-cancel-delete]");
let pendingRequestDeleteId = null;
let confirmTimerId = null;

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

function showDashboard() {
  loginPanel.classList.remove("is-active");
  dashboard.classList.add("is-active");
  Promise.all([renderRequests(), renderTeams()]).catch((error) => {
    requestsList.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  });
}

function showLogin() {
  dashboard.classList.remove("is-active");
  loginPanel.classList.add("is-active");
}

async function renderRequests() {
  requestsList.innerHTML = '<p class="empty-state">Carregando pedidos...</p>';
  const { requests } = await requestJson("/api/admin/prayer-requests");

  if (!requests.length) {
    requestsList.innerHTML = '<p class="empty-state">Ainda não há pedidos de oração cadastrados.</p>';
    return;
  }

  requestsList.innerHTML = requests
    .map(
      (request) => `
        <article class="request-item">
          <div class="request-main">
            <header>
              <strong>${escapeHtml(request.name)}</strong>
              <time>${escapeHtml(request.createdAt)}</time>
            </header>
            <p class="request-meta">${escapeHtml(request.age)} anos | Equipe ${escapeHtml(request.team)}</p>
            <p class="request-text">${escapeHtml(request.requestText)}</p>
          </div>
          <button type="button" class="danger-action" data-delete-request="${request.id}">Apagar</button>
        </article>
      `
    )
    .join("");
}

async function renderTeams() {
  const payload = await requestJson("/api/admin/teams");
  teams = payload.teams;

  if (!teams.length) {
    teamsList.innerHTML = '<p class="empty-state">Nenhuma equipe cadastrada.</p>';
    return;
  }

  teamsList.innerHTML = teams
    .map(
      (team) => `
        <article class="team-admin-item">
          <div class="team-thumb ${team.imageUrl ? "has-image" : "is-placeholder"}" style="${team.imageUrl ? `background-image:url('${escapeAttr(team.imageUrl)}')` : `--thumb-a:${escapeAttr(team.primaryColor)};--thumb-b:${escapeAttr(team.secondaryColor)}`}">
            ${team.imageUrl ? "" : "<span>Sem foto</span>"}
          </div>
          <div>
            <strong>${escapeHtml(team.name)}</strong>
            <span>${escapeHtml(team.saint)} | ${team.isActive ? "Visível" : "Oculta"} | Ordem ${escapeHtml(team.sortOrder)}</span>
          </div>
          <div class="item-actions">
            <button type="button" class="secondary-action" data-edit-team="${team.id}">Editar</button>
            <button type="button" class="danger-action" data-delete-team="${team.id}">Apagar</button>
          </div>
        </article>
      `
    )
    .join("");
}

function fillTeamForm(team) {
  teamForm.elements.id.value = team?.id || "";
  teamForm.elements.name.value = team?.name || "";
  teamForm.elements.saint.value = team?.saint || "";
  teamForm.elements.virtue.value = team?.virtue || "";
  teamForm.elements.motto.value = team?.motto || "";
  teamForm.elements.imageUrl.value = team?.imageUrl || "";
  teamForm.elements.sortOrder.value = team?.sortOrder || 0;
  teamForm.elements.primaryColor.value = team?.primaryColor || "#3f7c69";
  teamForm.elements.secondaryColor.value = team?.secondaryColor || "#c99633";
  teamForm.elements.isActive.checked = team ? Boolean(team.isActive) : true;
  teamForm.elements.description.value = team?.description || "";
  teamStatus.textContent = team ? `Editando ${team.name}.` : "";
}

async function saveTeam() {
  const data = new FormData(teamForm);
  const id = data.get("id");
  const body = {
    name: data.get("name").trim(),
    saint: data.get("saint").trim(),
    virtue: data.get("virtue").trim(),
    motto: data.get("motto").trim(),
    imageUrl: data.get("imageUrl").trim(),
    sortOrder: Number(data.get("sortOrder") || 0),
    primaryColor: data.get("primaryColor"),
    secondaryColor: data.get("secondaryColor"),
    isActive: data.get("isActive") === "on",
    description: data.get("description").trim()
  };

  await requestJson(id ? `/api/admin/teams/${id}` : "/api/admin/teams", {
    method: id ? "PUT" : "POST",
    body: JSON.stringify(body)
  });
  teamStatus.textContent = "Equipe salva com sucesso.";
  fillTeamForm(null);
  await renderTeams();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  adminStatus.textContent = "Entrando...";
  requestJson("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({
      username: data.get("username"),
      password: data.get("password")
    })
  })
    .then(() => {
      loginForm.reset();
      adminStatus.textContent = "";
      showDashboard();
    })
    .catch((error) => {
      adminStatus.textContent = error.message;
    });
});

logoutButton.addEventListener("click", () => {
  requestJson("/api/admin/logout", { method: "POST" })
    .catch(() => {})
    .finally(showLogin);
});

if (clearButton) {
  clearButton.addEventListener("click", () => {
    requestJson("/api/admin/prayer-requests", { method: "DELETE" })
      .then(renderRequests)
      .catch((error) => {
        requestsList.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
      });
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === button.dataset.tab);
    });
  });
});

teamForm.addEventListener("submit", (event) => {
  event.preventDefault();
  teamStatus.textContent = "Salvando equipe...";
  saveTeam().catch((error) => {
    teamStatus.textContent = error.message;
  });
});

newTeamButton.addEventListener("click", () => fillTeamForm(null));

teamsList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-team]");
  const deleteButton = event.target.closest("[data-delete-team]");

  if (editButton) {
    const team = teams.find((item) => String(item.id) === editButton.dataset.editTeam);
    fillTeamForm(team);
    teamForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (deleteButton) {
    const id = deleteButton.dataset.deleteTeam;
    requestJson(`/api/admin/teams/${id}`, { method: "DELETE" })
      .then(renderTeams)
      .catch((error) => {
        teamStatus.textContent = error.message;
      });
  }
});

requestsList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-request]");

  if (!deleteButton) {
    return;
  }

  const item = deleteButton.closest(".request-item");
  const name = item?.querySelector("strong")?.textContent || "este pedido";
  openDeleteConfirm(deleteButton.dataset.deleteRequest, name);
});

confirmDeleteButton.addEventListener("click", () => {
  if (!pendingRequestDeleteId || confirmDeleteButton.disabled) {
    return;
  }

  requestJson(`/api/admin/prayer-requests/${pendingRequestDeleteId}`, { method: "DELETE" })
    .then(renderRequests)
    .catch((error) => {
      requestsList.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
    })
    .finally(closeDeleteConfirm);
});

cancelDeleteButton.addEventListener("click", closeDeleteConfirm);

confirmModal.addEventListener("click", (event) => {
  if (event.target === confirmModal) {
    closeDeleteConfirm();
  }
});

function openDeleteConfirm(id, name) {
  pendingRequestDeleteId = id;
  confirmText.textContent = `Você está prestes a apagar o pedido de ${name}. Essa ação não poderá ser desfeita.`;
  confirmDeleteButton.disabled = true;
  confirmDeleteButton.textContent = "Apagar em 1,5s";
  confirmModal.classList.add("is-active");
  confirmModal.setAttribute("aria-hidden", "false");
  window.clearTimeout(confirmTimerId);
  confirmTimerId = window.setTimeout(() => {
    confirmDeleteButton.disabled = false;
    confirmDeleteButton.textContent = "Apagar pedido";
  }, 1500);
}

function closeDeleteConfirm() {
  pendingRequestDeleteId = null;
  window.clearTimeout(confirmTimerId);
  confirmDeleteButton.disabled = true;
  confirmDeleteButton.textContent = "Apagar em 1,5s";
  confirmModal.classList.remove("is-active");
  confirmModal.setAttribute("aria-hidden", "true");
}

requestJson("/api/admin/session")
  .then(({ isAdmin }) => {
    if (isAdmin) {
      showDashboard();
    } else {
      showLogin();
    }
  })
  .catch(() => {
    adminStatus.textContent = "Faça login para continuar.";
    showLogin();
  });
