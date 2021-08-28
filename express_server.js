const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser')


app.use(cookieParser())
app.set("view engine", "ejs");

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/register', (req, res) => {
  res.render('register', {username: req.cookies.username})
})


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  console.log(req.cookies)
  const templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
  
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new",{username: req.cookies.username });
});

app.post('/register', (req, res) => {
  let randomID = generateRandomString();
  users[randomID]= {id:randomID, email:req.body.email, password:req.body.password}
  res.cookie('user_id', randomID).redirect('/urls');
})


app.post("/logout", (req, res) => {
  res.clearCookie('username').redirect('/urls');
});


// app.get("/urls/:shortURL", (req, res) => {
//   const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
//   res.render("urls_show", templateVars);
// });

app.post("/urls", (req, res) => {
  let short = generateRandomString();
  urlDatabase[short] = req.body.longURL;
  res.redirect(`/urls/${short}`); 
});

app.post("/login", (req,res) => {
  res.cookie('username', req.body.username).redirect('/urls')
});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls')
})


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});




app.post('/url/:shortURL/delete', (req, res) => {
  console.log(urlDatabase[req.params.shortURL], req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
})

app.post('/url/:shortURL', (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
})


const generateRandomString = function () {
  const chars = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  let random_string = "";
  for (let i = 0; i < 6; i++) {
    random_string += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return random_string;
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});