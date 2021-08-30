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
  // "b2xVn2":"http://www.lighthouselabs.ca",
  // "9sm5xK":"http://www.google.com"
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca", userID: "aJ48lW"},
  "9sm5xK": {longURL:"http://www.google.com", userID: "aJ48lW"}
};



app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
  console.log(urlDatabase)
});


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/register', (req, res) => {
  res.render('register',   {user: req.cookies.user_id})
});


app.get('/login', (req, res) => {
  res.render('login',  { user: req.cookies.user_id });
});


app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect('login')
   } else { 
      const templateVars = { urls: urlDatabase,  user: req.cookies.user_id};
      res.render("urls_index", templateVars);
  } 
});


app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect('/login')
   }else{ res.render("urls_new",  { user: req.cookies.user_id} );
   }
});

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400)
  }
  for (let userId in users) {
    if (users[userId].email === req.body.email) {
      res.status(400)
    }
  }
  if (400 <= res.statusCode) {
    res.send('Invalid form')
  } else {
    let randomID = generateRandomString();
    users[randomID] = {id:randomID, email:req.body.email, password:req.body.password}
    res.cookie('user_id', users[randomID]).redirect('/urls');
  console.log(users)
  }
 });


app.post("/logout", (req, res) => {
  res.clearCookie('user_id').redirect('/urls');
});


// app.get("/urls/:shortURL", (req, res) => {
//   const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
//   res.render("urls_show", templateVars);
// });


app.post("/urls", (req, res) => {
  let short = generateRandomString();
  urlDatabase[short] = {longURL: req.body.longURL, userID : users.userRandomID.id}
  console.log(urlDatabase)
  res.redirect(`/urls/${short}`); 
});



app.post("/login", (req,res) => {

  if (!req.body.email || !req.body.password) {
    res.status(400)
  } else {
    for (let userId in users) {
      if (users[userId].email === req.body.email && users[userId].password === req.body.password) {
        res.status(200).cookie('user_id', users[userId]).redirect('/urls');
        return;
      }
    }
    res.status(403);
  }
  if (res.statusCode === 400) {
    res.send('Invalid form')
  } else if (res.statusCode === 403) {
    res.redirect('/register');//only registred users can access App
  }
 });

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls')
});


app.get("/urls/:shortURL", (req, res) => {
 const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: req.cookies.user_id };
  res.render("urls_show", templateVars);
  
});


app.get("/u/:shortURL", (req, res) => { //shortURL redirector to longURL
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL)
});




app.post('/url/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

app.post('/url/:shortURL', (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});