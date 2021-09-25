/***IMPORTS***/
const express = require('express');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')
const {users: userDb, urlDatabase: urlDb} = require('./db')
const { Model } = require('./Model');
const { Service } = require('./Service');
const { EnvironmentWrapper } = require('./middleware');
const bcrypt = require('bcrypt');
const { ServiceError } = require('./ServiceError');


/***INITIALIZING DATABASE AND SERVICE CLASSES***/
const model = new Model(userDb, urlDb);
const service = new Service(model);
const middlewares = new EnvironmentWrapper(service);

/***EXPRESS APP INITIALIZATION***/
const app = express();
const PORT = 8080; //default port 8080

/***SETTING UP SOME MIDDLEWARES AND VIEW ENGINE***/
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 2 * 60 * 60 * 1000 // 2 hours
}));

app.set("view engine", "ejs");

/***ROUTE HANDLERS***/
// redirecting from route to /urls
app.get("/", (req, res) => {
  res.redirect('./urls');
});

/***URL ROUTES***/
app.get("/urls", middlewares.auth, (req, res) => {
  res.render("urls_index", {urls: service.fetchURLByID(req.session.user_id.id),  user: req.session.user_id, error: null});
  });

app.post("/urls", middlewares.auth, (req, res) => {
  let userId;
  req.session.user_id && service.findUserByID(req.session.user_id.id) ? userId = req.session.user_id.id : userId = null;
  let newURL = service.createNewURL(req.body.longURL, userId); //newURL is object: { shortURL, longURL, userID }
  res.redirect(`/urls/${newURL.shortURL}`); 
});

/***LOGIN ROUTES***/
app.get('/login', middlewares.notAuth, (req, res) => {
    res.render('login',  { user: null, error: null });
});
app.post("/login", middlewares.notAuth, (req,res) => {
    let user = service.loginUser(req.body.email, req.body.password);
    req.session.user_id = {id: user.userID, email:user.email};
    res.redirect('/urls');
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
    req.session.user_id = {id: user.userID, email:user.email};
  res.redirect('/urls')
});

/***URL CREATION***/
app.get("/urls/new", middlewares.auth, (req, res) => {
  res.render("urls_new",  { user: req.session.user_id, error: null} );
});
app.post("/urls/:shortURL", middlewares.auth, (req, res) => {
  service.createNewURL(req.body.longURL, req.session.user_id.id)
  res.redirect('/urls')
});

/***URL EDIT***/
app.get("/urls/:shortURL", (req, res, next) => {
  let userId;
  req.session.user_id && service.findUserByID(req.session.user_id.id) ? userId = req.session.user_id.id : userId = null;
  let url = service.getURLRestricted(req.params.shortURL, userId);
  res.render("urls_show", {url, user: req.session.user_id, error: null});
});
app.post("/url/:shortURL", middlewares.auth, (req, res) => {
  req.body.url = { shortURL: req.params.shortURL, longURL: service.getURL(req.params.shortURL).longURL }
  service.editURL(req.params.shortURL, req.body.longURL, req.session.user_id.id);
  res.redirect('/urls')
});

/***DELETE URL***/
app.post('/url/:shortURL/delete', middlewares.auth, (req, res) => {
  service.deleteURL(req.params.shortURL, req.session.user_id.id)
  res.redirect('/urls');
});

/***PUBLIC ACCESS REDIRECT***/
app.get("/u/:shortURL", (req, res, next) => { //shortURL redirector to longURL
  let url = service.getURL(req.params.shortURL);
  if (!url) {
    next();
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