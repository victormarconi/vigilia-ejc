const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const basePath = normalizeBasePath(process.env.BASE_PATH || "/vigilia");

function normalizeBasePath(value) {
  if (!value || value === "/") {
    return "";
  }

  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

module.exports = {
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT || 3000),
  basePath,
  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT || 3306),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    database: required("DB_NAME"),
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    charset: "utf8mb4"
  },
  sessionSecret: required("SESSION_SECRET"),
  adminUsername: required("ADMIN_USERNAME"),
  adminPasswordHash: required("ADMIN_PASSWORD_HASH")
};
