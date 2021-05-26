const express = require("express");
const db = require("./../db");
const router = express.Router();
const getData = db.getConnection();


router.post("/register", (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).render("register", {
      message: "please provide all details",
    });
  }

  getData.query("SELECT email FROM allow WHERE email=VALUES($1)RETURNING *",[email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render("register", {
          message: "This email is already in use",
        });
      }
      if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password do not Match",
        });
      }

      
      getData.query("INSERT INTO allow(name,email,password)VALUES($1, $2, $3) RETURNING *",[name,email,password],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log('this is the '+results);
            return res.render("register", {
              message: "User Registered",
            });
          }
        }
      );
    }
  );
});
router.post("/userlogin", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "please provide an email and password",
      });
    }
    getData.query("SELECT email FROM allow WHERE email=VALUES($1)RETURNING *",[email], (error, results) => {
      console.log(results);
      if (!results || !(password == results[0].password)) {
        return res.status(400).render("userlogin", {
          message: "Email or password is incorrect",
        });
      } else {
        return res.status(200).render("complaint");
      }
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/adminlogin", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "please provide an email and password",
      });
    }
    if (email == "vasanth7085@gmail.com" && password == "Vasanth@25#$") {
      getData.query(
        "SELECT name,phoneno,place,complaint FROM complaint",
        (error, results) => {
          res.send(results);
        }
      );
    } else {
      return res.status(400).render("adminlogin", {
        message: "incorrect email and password",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/complaint", (req, res) => {
  console.log(req.body);

  const { name, number, place, complaint } = req.body;

  if (!name || !number || !place || !complaint) {
    return res.status(400).render("complaint", {
      message: "please provide all details",
    });
  }

  getData.query("INSERT INTO complaint(name,phoneno,place,complaint)VALUES($1, $2, $3, $4) RETURNING *",[name,number,place,complaint],(error, results) => {
      if (error) {
        console.log(error);
      } else {
        //console.log(results)
        return res.render("end", {
          message: "Your camplaint cleared with in few days",
        });
      }
    })
});

module.exports = router;
