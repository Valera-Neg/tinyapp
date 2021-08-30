const { ServiceError } = require('./ServiceError');

class Service {
  constructor(model) {
    this.model = model;
  }

  registerNewUser(email, password) {
    if (!email || !password) {
      throw new ServiceError('email or password are not provided', 400)
    }
    try {
      return this.model.createUser(email, password);
    } catch (error) {
      throw new ServiceError('invalid credentials, email should be unique', 409)
    }
  };

  authorizeUser(email, password) {
    let user = this.model.readUserByEmail(email);
    if (!user) {
      return null;
    } else if (user.password === password) {
      return user;
    } else {
      return null;
    }
  };

  findUserByID(userID) {
    return readUserByID(userID);
  };

  createNewURL(longURL, userID) {
    if (!longURL || !userID) {
      throw new ServiceError ('URL or user ID are not providet', 400)
    } else if (!this.model.readUserByID(userID)) {
      throw new ServiceError ('The client does not have access rights to the content', 403)
    } else {
      return this.model.createURL(longURL, userID);
    }
  };

fetchURLByID(userID) {
  return this.model.readURLOfUser(userID);
};

deleteURL(shortURL) {
  return this.model.deletURL(shortURL);
};

editURL(shortURL, longURL, userID) {
  return this.model.updateURL({shortURL, longURL, userID})
}

};

module.exports = { Service }