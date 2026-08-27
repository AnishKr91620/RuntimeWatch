const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

const path = require("path");

const caCertPath = path.resolve(__dirname, "../../certs/ca.pem");

const poll = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: fs.existsSync(caCertPath)
    ? {
        ca: fs.readFileSync(caCertPath, "utf8"),
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10,
});

async function assertDbConnection() {
  try {
    await poll.query("SELECT 1");
    console.log(
      `MySQL connected (${process.env.DB_HOST}:${process.env.DB_PORT || 3306})`,
    );
  } catch (err) {
    console.error(
      `MySQL connection failed (${err.code}): cannot reach ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}.`,
    );
  }
}

module.exports = poll;
module.exports.assertDbConnection = assertDbConnection;
