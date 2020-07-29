const parse = require("csv-parse/lib/sync");

class Member {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class Group {
  constructor(members, numTotalRooms, numMaxMembers, numMaxRooms, numMinMembers, numMinRooms, numSessions, introTime) {
    this.members = members.sort(function(a, b) {
      return a.id - b.id;
    });
    this.numTotalRooms = numTotalRooms;
    this.numMaxMembers = numMaxMembers;
    this.numMaxRooms = numMaxRooms;
    this.numMinMembers = numMinMembers;
    this.numMinRooms = numMinRooms;
    this.numSessions = numSessions;
    this.introTime = introTime;
  }
  session(n) {
    let rooms = [];
    for (let i = 0; i < this.numTotalRooms; i++) {
      rooms.push([]);
    }
    for (let i = 0; i < this.members.length; i++) {
      let member = this.members[i];
      let firstSession = (i + 1) % this.numSessions;
      let nSession = (firstSession * (n + 1)) % this.numSessions;
      rooms[nSession].push(member);
    }
    return rooms;
  }
  allSessions() {
    let rooms = [];
    for (let i = 0; i < this.numSessions; i++) {
      rooms.push(this.session(i));
    }
    return rooms;
  }
}

function parseTsv(text) {
  let members = [];
  let records = parse(text, {
    delimiter: "\t"
  });
  
  for (let record of records) {
    if (record.length !== 2) {
      throw new Error("csv parse error");
    }
    let id = parseInt(record[0]);
    if (isNaN(id)) {
      throw new Error("csv parse error");
    }
    let name = record[1];
    members.push(new Member(id, name));
  }
  return members;
}

function isPrimeNumber(n) {
  if (n === 2) return true;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
function makePrimeNumbers() {
  let n = 1;
  let result = [];
  while (n <= 100) {
    if (isPrimeNumber(n)) {
      result.push(n);
    }
    n++;
  }
  return result;
}

let primeNumbers = makePrimeNumbers();
console.log(primeNumbers);
let NUM_MAX_ROOMS = 16;

function makeGroups(members, sessionTime, talkTime, minIntroTime, minMembers) {
  let allRooms = 0;
  let groups = [];

  for (let n of primeNumbers) {
    if (n <= NUM_MAX_ROOMS) {
      let introTime = Math.floor((sessionTime - talkTime) / (Math.floor(members.length / n) + 1) * 60);
      let numMinMembers = Math.floor(members.length / n);
      let numMaxMembers = numMinMembers + 1;
      let numMaxRooms = members.length % n;
      let numMinRooms = n - numMaxRooms;
      let numSessions = n;
      if (introTime >= minIntroTime * 60) {
        let group = new Group(members, n, numMaxMembers, numMaxRooms, numMinMembers, numMinRooms, numSessions, introTime);
        groups.push(group);
      }
    }
  }
  return groups;
}

let members = [];
for (let i = 1; i <= 50; i++) {
  members.push(new Member(i, "member" + i));
}
let group = makeGroups(members, 10, 5, 1, 3)[0];
console.log(group.allSessions());

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/", function(req, res) {
  let tsv = req.body.tsv;
  let members = parseTsv(tsv);
  let groups = makeGroups(members, 10, 5, 1, 3);
  console.log(groups[0].allSessions());
  res.json({sessions: groups[0].allSessions()});
});

app.listen(3000);
