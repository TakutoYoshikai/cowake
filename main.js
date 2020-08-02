const parse = require("csv-parse/lib/sync");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cowake = require("./cowake");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/", function(req, res) {
  let tsv = req.body.tsv;
  let members = cowake.parseTsv(tsv);
  let groups = cowake.makeGroups(members, 10, 5, 1, 3);
  console.log(groups[0].allSessions());
  res.json({sessions: groups[0].allSessions()});
});

app.listen(3000);
