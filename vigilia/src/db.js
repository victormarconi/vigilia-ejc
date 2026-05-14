const mysql = require("mysql2/promise");
const config = require("./config");

const pool = mysql.createPool(config.db);

const defaultTeams = [
  {
    name: "Boa Vontade",
    saint: "Santa Teresa de Calcutá",
    description:
      "Santa Teresa dedicou a vida aos mais pobres, enxergando Jesus em cada pessoa. Sua relação com a Boa Vontade está no serviço pronto, humilde e alegre, que não espera aplausos para amar.",
    virtue: "Caridade",
    motto: "Servir Jesus nos pequenos gestos",
    primaryColor: "#2f6f8f",
    secondaryColor: "#d7b56d",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8e/MotherTeresa_090.jpg"
  },
  {
    name: "Bandinha",
    saint: "Santa Cecília",
    description:
      "Santa Cecília é lembrada como padroeira da música sacra. A Bandinha se inspira nela para transformar melodia, ritmo e voz em oração que ajuda os jovens a encontrarem Deus.",
    virtue: "Louvor",
    motto: "Cantar para conduzir à oração",
    primaryColor: "#365f8e",
    secondaryColor: "#b35458",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bb/St._Cecilia_by_Guido_Reni.jpg"
  },
  {
    name: "Formação/Círculos",
    saint: "Santa Teresinha",
    description:
      "Santa Teresinha viveu a pequena via: amar a Deus nas coisas simples. A Formação e os Círculos se relacionam com ela porque ajudam cada jovem a perceber que santidade também nasce no cotidiano.",
    virtue: "Simplicidade",
    motto: "Ensinar com ternura e profundidade",
    primaryColor: "#734f86",
    secondaryColor: "#3f7c69",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Teresa-de-Lisieux.jpg"
  },
  {
    name: "Equipe Dirigente",
    saint: "São Bento",
    description:
      "São Bento organizou comunidades a partir da oração, disciplina e trabalho. A Equipe Dirigente se inspira nele para conduzir com ordem, escuta e firmeza espiritual.",
    virtue: "Discernimento",
    motto: "Conduzir com oração e responsabilidade",
    primaryColor: "#2d463f",
    secondaryColor: "#c99633",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Frari_%28Venice%29_-_Sacristy_-_triptych_by_Giovanni_Bellini_-_Saint_Benedict_of_Nursia_and_Saint_Mark.jpg"
  },
  {
    name: "Trânsito",
    saint: "São Felipe Néri",
    description:
      "São Felipe Néri evangelizava com alegria, acolhida e bom humor. O Trânsito se relaciona com ele por receber, orientar e cuidar do caminho das pessoas com leveza e atenção.",
    virtue: "Alegria",
    motto: "Acolher e orientar com leveza",
    primaryColor: "#385f8c",
    secondaryColor: "#c99731",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Filippo_Neri.png"
  },
  {
    name: "MiniBox",
    saint: "São Miguel Arcanjo",
    description:
      "São Miguel Arcanjo é sinal de proteção e combate espiritual. O MiniBox se inspira nele para servir com prontidão, cuidado e atenção aos detalhes que sustentam o encontro.",
    virtue: "Proteção",
    motto: "Servir com prontidão e coragem",
    primaryColor: "#263a63",
    secondaryColor: "#d0a33f",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Giovan_Francesco_Barbieri_detto_il_Guercino%2C_San_Michele_Arcangelo_che_abbatte_il_diavolo%2C_chiesa_di_San_Nicol%C3%B2_%28Fabriano%29.jpg/640px-Giovan_Francesco_Barbieri_detto_il_Guercino%2C_San_Michele_Arcangelo_che_abbatte_il_diavolo%2C_chiesa_di_San_Nicol%C3%B2_%28Fabriano%29.jpg"
  },
  {
    name: "Liturgia",
    saint: "Santa Luzia",
    description:
      "Santa Luzia testemunhou a fé com coragem e é associada à luz. A Liturgia se relaciona com ela porque prepara sinais, Palavra e celebrações para que Cristo ilumine o encontro.",
    virtue: "Fidelidade",
    motto: "Celebrar a luz de Cristo",
    primaryColor: "#c99633",
    secondaryColor: "#365f8e",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Master_of_the_Legend_of_Saint_Lucy_-_Virgin_and_Child_in_a_Landscape_-_1955.942_-_Clark_Art_Institute.jpg"
  },
  {
    name: "Imprensaria",
    saint: "São Gabriel Arcanjo",
    description:
      "São Gabriel anunciou a Maria a grande notícia da salvação. A Imprensaria se inspira nele para comunicar com clareza, beleza e fidelidade aquilo que Deus realiza.",
    virtue: "Comunicação",
    motto: "Anunciar com verdade e beleza",
    primaryColor: "#4c6f91",
    secondaryColor: "#d7b56d",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Archangels.JPG/640px-Archangels.JPG"
  },
  {
    name: "Lanchinho",
    saint: "Santo Antônio de Pádua",
    description:
      "Santo Antônio foi pregador próximo do povo e sinal de cuidado concreto. O Lanchinho se relaciona com ele no gesto simples de alimentar, acolher e fortalecer quem caminha.",
    virtue: "Generosidade",
    motto: "Alimentar com carinho e presença",
    primaryColor: "#9b4d4f",
    secondaryColor: "#e3bd70",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Chapel_of_Pius_V_Santi_Giovanni_e_Paolo_%28Venice%29_-_Joseph_Heintz_der_J%C3%BCngere_-_St_Anthony_of_Padua_The_Miracle_of_the_Mule.jpg"
  },
  {
    name: "Externa",
    saint: "São Rafael Arcanjo",
    description:
      "São Rafael aparece como companheiro de viagem e sinal de cura. A Externa se inspira nele para acompanhar caminhos, proteger deslocamentos e cuidar para que todos cheguem bem.",
    virtue: "Cuidado",
    motto: "Acompanhar com proteção",
    primaryColor: "#3f7c69",
    secondaryColor: "#365f8e",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Saint_Raphael.JPG/640px-Saint_Raphael.JPG"
  },
  {
    name: "Recepção/Trafego",
    saint: "São João Batista",
    description:
      "São João Batista preparou o caminho do Senhor. A Recepção/Trafego se relaciona com ele porque acolhe, orienta e prepara o ambiente para que cada jovem encontre Jesus.",
    virtue: "Acolhida",
    motto: "Preparar o caminho do encontro",
    primaryColor: "#d4aa61",
    secondaryColor: "#365f8e",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Leonardo_da_Vinci_-_Saint_John_the_Baptist_C2RMF_retouched.jpg"
  },
  {
    name: "Vigília",
    saint: "São Carlos Acutis",
    description:
      "São Carlos Acutis viveu a fé com amor à Eucaristia e linguagem jovem. A Vigília se inspira nele para permanecer com Jesus e interceder pelos jovens com zelo e atualidade.",
    virtue: "Intercessão",
    motto: "Permanecer com Jesus pelos jovens",
    primaryColor: "#3f7c69",
    secondaryColor: "#b35458",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/db/Covent_Garden%2C_Corpus_Christi_Catholic_Church%2C_Carlo_Acutis_memorial.jpg"
  },
  {
    name: "Correios",
    saint: "São José",
    description:
      "São José serviu em silêncio, guardando Jesus e Maria com fidelidade. Os Correios se relacionam com ele no serviço discreto, confiável e essencial para que a missão aconteça.",
    virtue: "Fidelidade",
    motto: "Servir com discrição e constância",
    primaryColor: "#455f4b",
    secondaryColor: "#c99633",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Guido_Reni_-_Saint_Joseph_and_the_Christ_Child_-_Google_Art_Project.jpg"
  },
  {
    name: "Som e Iluminação",
    saint: "Santa Clara",
    description:
      "Santa Clara viveu com o olhar fixo em Cristo, irradiando luz pela oração. Som e Iluminação se inspira nela para criar um ambiente que favoreça escuta, beleza e encontro com Deus.",
    virtue: "Clareza",
    motto: "Fazer a luz servir à oração",
    primaryColor: "#365f8e",
    secondaryColor: "#d4aa61",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Barcelona_Cathedral_Interior_-_Chapel_of_Saint_Clare_of_Assisi_and_Saint_Catherine_of_Alexandria_by_Pedro_Garc%C3%ADa_de_Benavarre.jpg"
  },
  {
    name: "Apresentadores",
    saint: "São Padre Pio",
    description:
      "São Padre Pio conduzia as pessoas a Deus com firmeza, oração e profundo amor à Eucaristia. Os Apresentadores se inspiram nele para falar com verdade e conduzir com reverência.",
    virtue: "Reverência",
    motto: "Conduzir com fé e presença",
    primaryColor: "#2f463f",
    secondaryColor: "#8d5d1c",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Puerto_de_la_Cruz_%E2%80%93_Padre_Pio%2C_Iglesia_N._S._de_la_Paz.jpg"
  },
  {
    name: "Ordem e Limpeza",
    saint: "São Francisco de Assis",
    description:
      "São Francisco viveu a pobreza, a simplicidade e o cuidado com a criação. Ordem e Limpeza se relaciona com ele porque prepara espaços simples, belos e acolhedores para Deus agir.",
    virtue: "Simplicidade",
    motto: "Cuidar da casa comum",
    primaryColor: "#6c7d44",
    secondaryColor: "#c99633",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/60/Cimabue_-_Madonna_Enthroned_with_the_Child%2C_St_Francis_and_Four_Angels_-_WGA04920.jpg"
  },
  {
    name: "Cozinha",
    saint: "Santa Martha",
    description:
      "Santa Martha acolheu Jesus em sua casa e serviu com dedicação. A Cozinha se inspira nela para transformar trabalho, alimento e cuidado em hospitalidade concreta.",
    virtue: "Serviço",
    motto: "Acolher Jesus servindo",
    primaryColor: "#9b4d4f",
    secondaryColor: "#3f7c69",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Diego_Vel%C3%A1zquez_Christ_in_the_House_of_Martha_and_Mary.jpg"
  }
];

async function initializeDatabase() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS prayer_requests (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(80) NOT NULL,
      age TINYINT UNSIGNED NOT NULL,
      team VARCHAR(80) NOT NULL,
      request_text TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_prayer_requests_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS teams (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(80) NOT NULL,
      saint VARCHAR(120) NOT NULL,
      description TEXT NOT NULL,
      virtue VARCHAR(80) NOT NULL,
      motto VARCHAR(120) NOT NULL,
      image_url VARCHAR(600) NULL,
      primary_color CHAR(7) NOT NULL DEFAULT '#3f7c69',
      secondary_color CHAR(7) NOT NULL DEFAULT '#c99633',
      sort_order INT UNSIGNED NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_teams_active_order (is_active, sort_order, id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await seedTeams();
}

async function seedTeams() {
  const [[row]] = await pool.execute("SELECT COUNT(*) AS count FROM teams");

  if (row.count > 0) {
    return;
  }

  for (const [index, team] of defaultTeams.entries()) {
    await createTeam({ ...team, sortOrder: index + 1, isActive: true });
  }
}

async function createPrayerRequest({ name, age, team, requestText }) {
  const [result] = await pool.execute(
    "INSERT INTO prayer_requests (name, age, team, request_text) VALUES (?, ?, ?, ?)",
    [name, age, team, requestText]
  );

  return result.insertId;
}

async function listPrayerRequests() {
  const [rows] = await pool.execute(
    `SELECT
      id,
      name,
      age,
      team,
      request_text AS requestText,
      DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS createdAt
    FROM prayer_requests
    ORDER BY created_at DESC, id DESC
    LIMIT 500`
  );

  return rows;
}

async function deletePrayerRequests() {
  await pool.execute("DELETE FROM prayer_requests");
}

async function deletePrayerRequest(id) {
  const [result] = await pool.execute("DELETE FROM prayer_requests WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

async function listPublicTeams() {
  const [rows] = await pool.execute(
    `SELECT
      id,
      name,
      saint,
      description,
      virtue,
      motto,
      image_url AS imageUrl,
      primary_color AS primaryColor,
      secondary_color AS secondaryColor,
      sort_order AS sortOrder,
      is_active AS isActive
    FROM teams
    WHERE is_active = 1
    ORDER BY sort_order ASC, id ASC`
  );

  return rows;
}

async function listAdminTeams() {
  const [rows] = await pool.execute(
    `SELECT
      id,
      name,
      saint,
      description,
      virtue,
      motto,
      image_url AS imageUrl,
      primary_color AS primaryColor,
      secondary_color AS secondaryColor,
      sort_order AS sortOrder,
      is_active AS isActive
    FROM teams
    ORDER BY sort_order ASC, id ASC`
  );

  return rows;
}

async function createTeam(team) {
  const [result] = await pool.execute(
    `INSERT INTO teams
      (name, saint, description, virtue, motto, image_url, primary_color, secondary_color, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      team.name,
      team.saint,
      team.description,
      team.virtue,
      team.motto,
      team.imageUrl || null,
      team.primaryColor,
      team.secondaryColor,
      team.sortOrder,
      team.isActive ? 1 : 0
    ]
  );

  return result.insertId;
}

async function updateTeam(id, team) {
  const [result] = await pool.execute(
    `UPDATE teams
    SET name = ?,
      saint = ?,
      description = ?,
      virtue = ?,
      motto = ?,
      image_url = ?,
      primary_color = ?,
      secondary_color = ?,
      sort_order = ?,
      is_active = ?
    WHERE id = ?`,
    [
      team.name,
      team.saint,
      team.description,
      team.virtue,
      team.motto,
      team.imageUrl || null,
      team.primaryColor,
      team.secondaryColor,
      team.sortOrder,
      team.isActive ? 1 : 0,
      id
    ]
  );

  return result.affectedRows > 0;
}

async function deleteTeam(id) {
  const [result] = await pool.execute("DELETE FROM teams WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  pool,
  initializeDatabase,
  createPrayerRequest,
  listPrayerRequests,
  deletePrayerRequests,
  deletePrayerRequest,
  listPublicTeams,
  listAdminTeams,
  createTeam,
  updateTeam,
  deleteTeam
};
