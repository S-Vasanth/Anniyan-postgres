const express = require("express");
const db = require("./db");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const port = 3300;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//static folder
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
const client = db.getConnection();
// client.connect(err => {
//   if (err) {
//     console.error('connection error vasanth', err.stack)
//   } else {
//     console.log('connected')
//   }
// });
app.use("/", require("./routes/page"));
app.use("/auth", require("./routes/auth"));
app.listen(port, () => {
  console.log(`server listen at ${port}`);
});
