const { Client } = require('pg')
// const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });




function getConnection() {
  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  })
  return client;
}

module.exports.getConnection = getConnection;
