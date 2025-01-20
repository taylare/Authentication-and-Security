import express from "express";
import bodyParser from "body-parser";
import pg from "pg"; //import database

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "123456",
  port: 5432,

});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");



});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]); 

    if(checkResult.rows.length > 0) {
        res.send("Email already exists. Try logging in.");
    }else { const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, password]
    );
    console.log(result);
    res.render("secrets.ejs");
  }
}catch {
  console.log(err);
}
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
 
  try{
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email, ]);
    
    if(result.rows.length > 0) { //If email exists
      const user = result.rows[0]; //accessing the first email that matches
      const storedPassword = user.password; //accesses the password column for the user

      if (password === storedPassword){
        res.render("secrets.ejs");
      }else{
      res.send("email or password is incorrect, please try again.")
      }
    } else {
      res.send("user not found");
    }
  }catch {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
