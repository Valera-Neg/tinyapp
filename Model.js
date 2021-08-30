class Model {
  constructor(usersDb, urlDb) {
    this.usersDb = usersDb;
    this.urlDb = urlDb;
  }

  /**
   * 
   * @param shortURL is a string
   * @returns object { shortURL, longURL, userID }
   */
  readURL(shortURL) {
   if(this.urlDb[shortURL] === undefined) {
     return null;
   } else {
      return {shortURL: shortURL,  longURL: this.urlDb[shortURL].longURL, userID: this.urlDb[shortURL].userID};
   }
  };

  readURLOfUser(userID) {
    let urls = Object.keys(this.urlDb);
    let urlsOfUser = [];
    urls.forEach(url => {
      if(this.urlDb[url].userID === userID) {
        urlsOfUser.push({shortURL: url, longURL: this.urlDb[url].longURL, userID: userID})
      }
    })
    return urlsOfUser;
  }

  readAllURLs() {
    return this.urlDb;
  };

  readAllUsers() {
    return this.usersDb;
  }
  
  /**
   * 
   * @param {string} longURL 
   * @param {string} userID 
   * @returns {longURL, userID}
   */
  createURL(longURL, userID) {
    if (longURL && userID) {
      let short = this.generateRandomString();
      this.urlDb[short] = {longURL, userID};
      return {shortURL: short, longURL: this.urlDb[short].longURL, userID: this.urlDb[short].userID};
    } else {
      throw new Error('invalid URL object');
    }
  };
    /**
     * 
     * @param {string} email 
     * @returns {userID: string, email: string, password: string}
     */
  readUserByEmail(email) {
    for (let key of Object.keys(this.usersDb)) {
      if (this.usersDb[key].email === email) {
        return {userID: this.usersDb[key].userID, email: this.usersDb[key].email, password: this.usersDb[key].password};
      }
    }
    return null;
  };

  readUserByPassword(password) {
    for( let key of Object.keys(this.usersDb)) {
      if (this.usersDb[key].password === password) {
        return {userID: this.usersDb[key].userID, email: this.usersDb[key].email, password: this.usersDb[key].password};
      }
    }
    return null;
  }

  /**
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns {userID: string, email: string, password: string}
   */
  createUser(email, password) {
    if (this.readUserByEmail(email)) {
      throw new Error('this email alredy exist');
    } else if (!email || !password) {
      throw new Error('inavlid parameters')
    } else {
      let randomID = this.generateRandomString();
      this.usersDb[randomID] = {userID: randomID, email: email, password: password};
      return this.usersDb[randomID]
    }
  }
    /**
     * 
     * @param {string} userID 
     * @returns {userID: randomID, email: email, password: password}
     */
  readUserByID(userID) {
    if (this.usersDb[userID]) {
      return this.usersDb[userID];
    }
    return null;
  };

  /**
   * 
   * @param {string} shortURL 
   * @returns {string}
   */
  deletURL(shortURL) {
    if (this.readURL(shortURL)) {
      let deletedURL = Object.assign({}, {shortURL: shortURL, longURL: this.urlDb[shortURL].longURL, userID: this.urlDb[shortURL].userID});
      delete this.urlDb[shortURL]
      return deletedURL;
    } else {
      return null;
    }
  };

  /**
   * 
   * @param {longURL: string, userID: string} URL 
   * @returns {longURL: string, userID: string} old url object
   */
  updateURL(URL) {
    if (this.readURL(URL.shortURL) && this.readURL(URL.shortURL).userID === URL.userID && URL.longURL) {
      let oldURL = {shortURL: URL.shortURL, longURL: this.urlDb[URL.shortURL].longURL, userID: this.urlDb[URL.shortURL].userID}
      this.urlDb[URL.shortURL] = {longURL: URL.longURL, userID: URL.userID}
      return oldURL;
    } else {
      throw new Error('invalid update URL')
    }

  }

  /**
   * 
   * @returns generated random string, assumed unique
   */
  generateRandomString() {
    const chars = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    let random_string = "";
    for (let i = 0; i < 6; i++) {
      random_string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return random_string;
  }
}

module.exports = {Model}