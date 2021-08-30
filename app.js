const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const app = express();
const PORT = 8080; //default port 8080

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});