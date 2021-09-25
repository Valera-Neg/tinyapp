const bcrypt = require('bcrypt');

const { ServiceError } = require('./ServiceError');

class Service {
  constructor(model) {
    this.model = model;
  }

  registerNewUser(email, password) {
    if (!email || !password) {
      throw new ServiceError('email or password are not provided', 400, 1)
    }
    try {
      const hashedPassword = this.hashPass(password); 
      return this.model.createUser(email, hashedPassword);
    } catch (error) {
      throw new ServiceError('invalid credentials, email should be unique', 409, 1)
    }
  };

  loginUser(email, password) {
    let user = this.model.readUserByEmail(email); //return object { userID, email, password }
    if (!user) {
      throw new ServiceError('User with this email is not registered', 403, 2);
    } else if (this.compareHashed(password, user.password)) {
      return user;
    } else {
      throw new ServiceError('Incorrect credentils', 409, 2);
    }
  };

  findUserByID(userID) {
    return this.model.readUserByID(userID);
  };

  createNewURL(longURL, userID) {
    if (!longURL) {
      throw new ServiceError ('URL is not provided', 400, 3)
    } else if (!userID || !this.model.readUserByID(userID)) { // return { userID, email, password }
      throw new ServiceError ('The client does not have access rights to the content', 403, 0);
    } else {
      return this.model.createURL(longURL, userID); //return { sortURL, longURL, userID }
    }
  };

  fetchURLByID(userID) {
    return this.model.readURLOfUser(userID);
  };

  getURL(shortURL) {
    return this.model.readURL(shortURL);
  };

  getURLRestricted(shortURL, userID) {
    if(!this.getURL(shortURL)){
      throw new ServiceError('URL does not exist', 404, 5)
    }
    if (!userID || !this.isURLOwner(shortURL, userID)) {
      throw new ServiceError('No access rights', 403, 5)
    }
    return this.getURL(shortURL);
  };

  deleteURL(shortURL, userID) {
    if (!this.isURLOwner(shortURL, userID)) {
      throw new ServiceError('No access rights', 403, 5)
    }
    return this.model.deletURL(shortURL); //return delited object { shortURL, longURL, userID }
  };

  editURL(shortURL, longURL, userID) {
    if (!this.isURLOwner(shortURL, userID)) {
      throw new ServiceError('No access rights', 403, 5)
    }
    try {
      return this.model.updateURL({shortURL, longURL, userID})
    } catch (error) {
      throw new ServiceError('URL is not provided', 400, 4)
    }
  };

  isURLOwner(shortURL, userID) {
    if (this.getURL(shortURL) && this.getURL(shortURL).userID === userID) {
      return true;
    } else {
      return false;
    }
  };

  hashPass(password) {
    return bcrypt.hashSync(password, 10);
  };

  compareHashed(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
};

module.exports = { Service }