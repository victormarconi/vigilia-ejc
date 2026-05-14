require("dotenv").config();

const { initializeDatabase, pool } = require("../src/db");

initializeDatabase()
  .then(async () => {
    console.log("Banco inicializado com sucesso.");
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Falha ao inicializar o banco:", error.message);
    await pool.end();
    process.exit(1);
  });
