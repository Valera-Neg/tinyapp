const bcrypt = require('bcrypt');

const auth = (req, res, next) => {
  if (!req.session/*cookies*/.user_id) {
    res.redirect('/login');
  } else {
    next()
  }
}

const notAuth = (req, res, next) => {
  if (req.session/*cookies*/.user_id) {
    res.redirect('/urls');
  } else {
    next()
  }
}

const hashPass = (req, res, next)=> {
  req.body.hashedPass = bcrypt.hashSync(req.body.password, 10);
  next();
}

/***ERROR HANDLER****/

const errorHandler = function(err, req, res, next) {
  if (!err.source) {
    console.log(err);
    res.status(500).send('500: There was an error on the server')
  } else if (err.source === 1) {
    res.status(err.statusCode).render('register', {user: null, error: err.message});
  } else if (err.source === 2) {
    res.status(err.statusCode).render('login', { user: null, error: err.message });
  } else if (err.source === 3) {
    res.status(err.statusCode).render('urls_new', { user: req.cookies.user_id, error: err.message });
  } else if (err.source === 4) {
    res.status(err.statusCode).render('urls_show', { user: req.cookies.user_id, url: req.body.url, error: err.message });
  } else if (err.source === 5) {
    res.status(err.statusCode).send(`${err.statusCode}: ${err.message}`)
  } else {
    next();
  }
}

module.exports = { auth, errorHandler, notAuth, hashPass}