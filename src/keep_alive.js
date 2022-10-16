const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const logger = require('morgan');
const fs = require("fs");
const ejs = require("ejs");
const MarkdownIt = require('markdown-it');


//var logFile = fs.createWriteStream('ExpressLogs.log', {flags: 'a'}); //use {flags: 'w'} to open in write mode
/*logger.token("custom", `
-------------------------------
HTTP Version: :http-version,
METHOD: :method,
URL: :url,
STATUS: :status,
TIME TAKEN: :total-time[2] ms,
REPONSE TIME: :response-time[2]
REQ IP: :remote-addr
DATE: ` + new Date() + `
-------------------------------`);*/
//app.use(logger('custom', {stream: logFile}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(logger('dev'));

// Below we are setting up EJS this is a templating system almost the exact same as html but its easier to use with express when passing data to the client
app.set("view engine", "ejs");

app.listen(port, function() {
  console.log("Server is running on " + port + " port. "); 
});

app.get("/", function(req, res) {
});

app.get("/updatelog", function(req, res) {
  const md = new MarkdownIt();
  const data = fs.readFileSync("README.md", "utf8");
  const style = `
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap');
    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 50px;
    }
    
    h3 {
      font-family: 'Montserrat', sans-serif;
    }
    
    h2 {
      font-family: 'Montserrat', sans-serif;
    }

    h1 {
      font-family: 'Montserrat', sans-serif;
    }
    
    p {
      font-family: 'Ubuntu', sans-serif;
    }
    </style>
  `;
  res.send(style + md.render(data));
  console.log("Home page sent.");
});