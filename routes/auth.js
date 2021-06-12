const express = require("express");
const db = require("./../db");
const router = express.Router();
const runQuery = db.getConnection();

router.post("/register", async (req, res) => {
  try {
    //console.log(req.body);
    const { name, email, password, passwordConfirm } = req.body;

    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).render("register", {
        message: "please provide all details",
      });
    }
    try {
      let registerdata = await runQuery.query(
        "SELECT * FROM allow WHERE email=$1",
        [email]
      );
      console.log(registerdata);
      if (registerdata.rows.length > 0) {
        return res.render("register", {
          message: "This email is already in use",
        });
      }
      if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password do not Match",
        });
      }
    } catch (e) {
      console.log("something went wrong");
    }
    try {
      let insertdata = await runQuery.query(
        "INSERT INTO allow(name,email,password)VALUES($1, $2, $3) RETURNING *",
        [name, email, password]
      );

      console.log(insertdata);
    } catch (error) {
      console.log("something went wrong");
    }

    return res.render("register", {
      message: "User Registered",
    });
  } catch (e) {
    console.log("something went wrong");
  }
});

router.post("/userlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("userlogin", {
        message: "please provide an email and password",
      });
    }
    try {
      let userData = await runQuery.query(
        "SELECT * FROM allow WHERE email=$1",
        [email]
      );


      console.log(userData);
      console.log(userData.rows[0].password)
      if (!userData || !(password == userData.rows[0].password)) {
        return res.status(400).render("userlogin", {
          message: "Email or password is incorrect",
        });
      } else {
        return res.status(200).render("complaint");
      }
    } catch (e) {
      console.log("error on user login");
    }
  } catch (err) {
    console.log("something went wrong");
  }
});
router.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "please provide an email and password",
      });
    }
    if (email == "vasanth7085@gmail.com" && password == "123") {
      console.log("ok");
      try {
        let result = await runQuery.query("SELECT * FROM complaint");
        console.log(result.rows);
        res.send(result.rows);
      } catch (e) {
        console.log("something went worng");
      }
    } else {
      return res.status(400).render("adminlogin", {
        message: "incorrect email and password",
      });
    }
  } catch (erro) {
    console.log("something went wrong");
  }
});
router.post("/complaint", async (req, res) => {
  console.log(req.body);

  const { name, number, place, complaint } = req.body;

  if (!name || !number || !place || !complaint) {
    return res.status(400).render("complaint", {
      message: "please provide all details",
    });
  }

  let complaintData = await runQuery.query(
      "INSERT INTO complaint(name,phoneno,place,complaint)VALUES($1, $2, $3, $4) RETURNING *",
    [name, number, place, complaint]
  );

  console.log(complaintData);
  return res.render("end", {
    message: "Your camplaint cleared with in few days",
  });
});

module.exports = router;

