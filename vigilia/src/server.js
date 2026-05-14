const path = require("path");
const bcrypt = require("bcryptjs");
const compression = require("compression");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const session = require("express-session");
const config = require("./config");
const {
  createPrayerRequest,
  createTeam,
  deletePrayerRequest,
  deletePrayerRequests,
  deleteTeam,
  initializeDatabase,
  listAdminTeams,
  listPrayerRequests,
  listPublicTeams,
  updateTeam
} = require("./db");

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.set("trust proxy", 1);
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "https://images.unsplash.com", "https://upload.wikimedia.org", "data:"],
        connectSrc: ["'self'"]
      }
    }
  })
);
app.use(express.json({ limit: "32kb" }));
app.use(
  session({
    name: "vigilia.sid",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 4
    }
  })
);

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." }
});

const router = express.Router();

router.use(express.static(publicDir, { extensions: ["html"] }));

router.get("/health", (req, res) => {
  res.json({ ok: true });
});

router.get("/admin", (req, res) => {
  res.sendFile(path.join(publicDir, "admin.html"));
});

router.get("/api/teams", apiLimiter, async (req, res, next) => {
  try {
    const teams = await listPublicTeams();
    res.json({ teams });
  } catch (error) {
    next(error);
  }
});

router.post("/api/prayer-requests", apiLimiter, async (req, res, next) => {
  try {
    const payload = await validatePrayerRequest(req.body);
    const id = await createPrayerRequest(payload);
    res.status(201).json({ id, message: "Pedido de oração enviado com sucesso." });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    next(error);
  }
});

router.post("/api/admin/login", loginLimiter, async (req, res, next) => {
  try {
    const username = String(req.body.username || "").trim();
    const password = String(req.body.password || "");
    const usernameMatches = username === config.adminUsername;
    const passwordMatches = await bcrypt.compare(password, config.adminPasswordHash);

    if (!usernameMatches || !passwordMatches) {
      res.status(401).json({ error: "Usuário ou senha inválidos." });
      return;
    }

    req.session.isAdmin = true;
    res.json({ message: "Login realizado com sucesso." });
  } catch (error) {
    next(error);
  }
});

router.post("/api/admin/logout", requireAdmin, (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }

    res.clearCookie("vigilia.sid");
    res.json({ message: "Sessão encerrada." });
  });
});

router.get("/api/admin/session", (req, res) => {
  res.json({ isAdmin: Boolean(req.session.isAdmin) });
});

router.get("/api/admin/prayer-requests", requireAdmin, async (req, res, next) => {
  try {
    const requests = await listPrayerRequests();
    res.json({ requests });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/admin/prayer-requests", requireAdmin, async (req, res, next) => {
  try {
    await deletePrayerRequests();
    res.json({ message: "Pedidos removidos." });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/admin/prayer-requests/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await deletePrayerRequest(Number(req.params.id));

    if (!deleted) {
      res.status(404).json({ error: "Pedido não encontrado." });
      return;
    }

    res.json({ message: "Pedido removido com sucesso." });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/teams", requireAdmin, async (req, res, next) => {
  try {
    const teams = await listAdminTeams();
    res.json({ teams });
  } catch (error) {
    next(error);
  }
});

router.post("/api/admin/teams", requireAdmin, async (req, res, next) => {
  try {
    const team = validateTeam(req.body);
    const id = await createTeam(team);
    res.status(201).json({ id, message: "Equipe criada com sucesso." });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    next(error);
  }
});

router.put("/api/admin/teams/:id", requireAdmin, async (req, res, next) => {
  try {
    const team = validateTeam(req.body);
    const updated = await updateTeam(Number(req.params.id), team);

    if (!updated) {
      res.status(404).json({ error: "Equipe não encontrada." });
      return;
    }

    res.json({ message: "Equipe atualizada com sucesso." });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    next(error);
  }
});

router.delete("/api/admin/teams/:id", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await deleteTeam(Number(req.params.id));

    if (!deleted) {
      res.status(404).json({ error: "Equipe não encontrada." });
      return;
    }

    res.json({ message: "Equipe removida com sucesso." });
  } catch (error) {
    next(error);
  }
});

router.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

if (config.basePath) {
  app.use(config.basePath, router);
}

app.use("/", router);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Erro interno. Tente novamente em instantes." });
});

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
    return;
  }

  res.status(401).json({ error: "Acesso administrativo necessário." });
}

async function validatePrayerRequest(body) {
  const name = cleanText(body.nome || body.name, 80);
  const age = Number(body.idade || body.age);
  const team = cleanText(body.equipe || body.team, 80);
  const requestText = cleanText(body.pedido || body.requestText, 800);
  const teams = await listPublicTeams();
  const allowedTeams = new Set(teams.map((item) => item.name));

  if (!name || name.length < 2) {
    throw badRequest("Informe um nome válido.");
  }

  if (!Number.isInteger(age) || age < 10 || age > 120) {
    throw badRequest("Informe uma idade válida.");
  }

  if (!allowedTeams.has(team)) {
    throw badRequest("Selecione uma equipe válida.");
  }

  if (!requestText || requestText.length < 5) {
    throw badRequest("Escreva seu pedido de oração.");
  }

  return { name, age, team, requestText };
}

function validateTeam(body) {
  const team = {
    name: cleanText(body.name || body.nome, 80),
    saint: cleanText(body.saint || body.santo, 120),
    description: cleanText(body.description || body.descricao, 1200),
    virtue: cleanText(body.virtue || body.virtude, 80),
    motto: cleanText(body.motto || body.lema, 120),
    imageUrl: cleanText(body.imageUrl || body.foto || "", 600),
    primaryColor: cleanText(body.primaryColor || "#3f7c69", 7),
    secondaryColor: cleanText(body.secondaryColor || "#c99633", 7),
    sortOrder: Number(body.sortOrder || body.ordem || 0),
    isActive: Boolean(body.isActive ?? body.ativa ?? true)
  };

  if (!team.name || !team.saint || !team.description || !team.virtue || !team.motto) {
    throw badRequest("Preencha nome, santo, descrição, virtude e lema.");
  }

  if (!isHexColor(team.primaryColor) || !isHexColor(team.secondaryColor)) {
    throw badRequest("Use cores no formato hexadecimal, como #3f7c69.");
  }

  if (!Number.isInteger(team.sortOrder) || team.sortOrder < 0 || team.sortOrder > 999) {
    throw badRequest("Informe uma ordem válida entre 0 e 999.");
  }

  if (team.imageUrl && !isSafeImageUrl(team.imageUrl)) {
    throw badRequest("Informe uma URL de imagem válida.");
  }

  return team;
}

function isHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function isSafeImageUrl(value) {
  return /^https?:\/\/.+/i.test(value) || /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(value);
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

initializeDatabase()
  .then(() => {
    if (process.env.IISNODE_VERSION) {
      app.listen(process.env.PORT);
      return;
    }

    app.listen(config.port, () => {
      console.log(`Vigília EJC listening on port ${config.port}${config.basePath}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
