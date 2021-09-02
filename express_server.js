/***IMPORTS***/
const express = require('express');
const bodyParser = require("body-parser");
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const {users: userDb, urlDatabase: urlDb} = require('./db')
const { Model } = require('./Model');
const { Service } = require('./Service');
const middlewares = require('./middleware');
const bcrypt = require('bcrypt');


/***INITIALIZING DATABASE AND SERVICE CLASSES***/
const model = new Model(userDb, urlDb);
const service = new Service(model);

/***EXPRESS APP INITIALIZATION***/
const app = express();
const PORT = 8080; //default port 8080

/***SETTING UP SOME MIDDLEWARES AND VIEW ENGINE***/
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser())
//var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'/* secret keys */],

  // Cookie Options
  maxAge: 2 * 60 * 60 * 1000 // 2 hours
}))

app.set("view engine", "ejs");

/***ROUTE HANDLERS***/
// redirecting from route to /urls
app.get("/", (req, res) => {
  res.redirect('./urls');
});

/***URL ROUTES***/
app.get("/urls", middlewares.auth, (req, res) => {
  res.render("urls_index", {urls: service.fetchURLByID(req.session/*cookies*/.user_id.id),  user: req.session/*cookies*/.user_id, error: null});
});

app.post("/urls", middlewares.auth, (req, res) => {
  let newURL = service.createNewURL(req.body.longURL, req.session/*cookies*/.user_id.id)
  res.redirect(`/urls/${newURL.shortURL}`); 
});

/***LOGIN ROUTES***/
app.get('/login', middlewares.notAuth, (req, res) => {
    res.render('login',  { user: null, error: null });
});
app.post("/login", middlewares.notAuth, (req,res) => {
    let user = service.loginUser(req.body.email, req.body.password);
    //res.cookie('user_id', {id: user.userID, email:user.email}).redirect('/urls');
    req.session.user_id = {id: user.userID, email:user.email};
    res.redirect('/urls')
});

/***LOGOUT****/
app.post("/logout", middlewares.auth, (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

/***REGISTRATION***/
app.get('/register', middlewares.notAuth, (req, res) => {
  res.render('register', {user: null, error: null});
});
app.post('/register', middlewares.notAuth, (req, res) => {
  let user = service.registerNewUser(req.body.email, req.body.password);
  //res.cookie('user_id', {id: user.userID, email: user.email}).redirect('/urls')
  req.session.user_id = {id: user.userID, email:user.email};
  res.redirect('/urls')
});

/***URL CREATION***/
app.get("/urls/new", middlewares.auth, (req, res) => {
  res.render("urls_new",  { user: req.session/*cookies*/.user_id, error: null} );
});
app.post("/urls/:shortURL", middlewares.auth, (req, res) => {
  service.createNewURL(req.body.longURL, req.session/*cookies*/.user_id.id)
  res.redirect('/urls')
});

/***URL EDIT***/
app.get("/urls/:shortURL", middlewares.auth, (req, res, next) => {
  let url = service.getURLRestricted(req.params.shortURL, req.session/*cookies*/.user_id.id);
  if (url === null) {
    next();
  } else {
    res.render("urls_show", {url, user: req.session/*cookies*/.user_id, error: null});
  }
});
app.post("/url/:shortURL", middlewares.auth, (req, res) => {
  req.body.url = { shortURL: req.params.shortURL, longURL: service.getURL(req.params.shortURL).longURL }
  service.editURL(req.params.shortURL, req.body.longURL, req.session/*cookies*/.user_id.id);
  res.redirect('/urls')
});

/***DELETE URL***/
app.post('/url/:shortURL/delete', middlewares.auth, (req, res) => {
  service.deleteURL(req.params.shortURL, req.session/*cookies*/.user_id.id)
  res.redirect('/urls');
})

/***PUBLIC ACCESS REDIRECT***/
app.get("/u/:shortURL", (req, res, next) => { //shortURL redirector to longURL
  let url = service.getURL(req.params.shortURL);
  if (!url) {
    next()
  } else {
    res.redirect(url.longURL);
  }
});

/***ERROR HANDLER***/
app.get('*', (req, res) => {
  res.status(404).send('404 Page Not Found')
});
app.use(middlewares.errorHandler);

/***EXPRESS APP LISTENS ON PORT***/
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});