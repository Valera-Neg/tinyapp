const {Model} = require('../../Model');
const assert = require('chai').assert;
const expect = require('chai').expect

const userDb = {
  "FgWRjO": {
    userID: "FgWRjO", 
    email: "darrin_torphy@yahoo.com", 
    password: "pass0"
  },
  "qnyo09": {
    userID: "qnyo09", 
    email: "sophia_heaney@hotmail.com", 
    password: "pass1"
  },
  "ZyyNPa": {
    userID: "ZyyNPa", 
    email: "daryl88@hotmail.com", 
    password: "pass0"
  },
  "rTdakL": {
    userID: "rTdakL", 
    email: "caden.white@yahoo.com", 
    password: "pass3"
  },
  "ZGPQm3": {
    userID: "ZGPQm3", 
    email: "clarissa15@yahoo.com", 
    password: "pass5"
  },
};

const urlDb = {
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca", userID: "FgWRjO"},
  "9sm5xK": {longURL:"http://www.google.com", userID: "qnyo09"},
  "YKrSsX": {longURL:"https://alwaysjudgeabookbyitscover.com/", userID: "rTdakL"},
  "rg4YMw": {longURL:"https://longdogechallenge.com/", userID: "ZGPQm3"},
  "O3YiPY": {longURL:"https://www.flightradar24.com/", userID: "ZGPQm3"},
  "09NSYs": {longURL:"https://oshpark.com/", userID: "FgWRjO"},
  "f2qu0C": {longURL:"http://www.yahoo.com", userID: "FgWRjO"},
}

let mockModel = new Model(userDb, urlDb)

describe('#readURLOfUser()', () => {
  it ("readURLOfUser() should return array of URL object belonging to use", () =>{
    assert.deepEqual(mockModel.readURLOfUser("FgWRjO"), [
      {shortURL: "b2xVn2", longURL:"http://www.lighthouselabs.ca", userID: "FgWRjO"},
      {shortURL: "09NSYs", longURL:"https://oshpark.com/", userID: "FgWRjO"},
      {shortURL: "f2qu0C", longURL:"http://www.yahoo.com", userID: "FgWRjO"},
    ])
  })
  it ("readURLOfUser() should return array of URL object belonging to use, but user have no URLs", () =>{
    assert.deepEqual(mockModel.readURLOfUser("ppppppp"), [])
  })
});