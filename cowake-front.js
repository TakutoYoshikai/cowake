//const parse = require("csv-parse/lib/sync");
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
      let firstSession = i % this.numTotalRooms;
      let diff = (Math.floor(i / this.numTotalRooms) * n);
      let nSession = (firstSession + diff) % this.numTotalRooms;
      rooms[nSession].push(member);
    }
    return rooms;
  }
  allSessions() {
    let sessions = [];
    for (let i = 0; i < this.numTotalRooms; i++) {
      sessions.push(this.session(i));
    }
    return sessions;
  }
  memberRooms() {
    let result = [];
    for (let i = 0; i < this.members.length; i++) {
      let memberRoom = [];
      for (let n = 0; n < this.numSessions; n++) {
        let firstSession = i % this.numTotalRooms;
        let diff = (Math.floor(i / this.numTotalRooms) * n);
        let nSession = (firstSession + diff) % this.numTotalRooms;
        memberRoom.push(nSession + 1);
      }
      result.push(memberRoom);
    }
    return result;
  }
  show() {
    let sessions = this.allSessions();
    let session_i = 0;
    for (let session of sessions) {
      console.log("session " + session_i);
      let group_i = 0;
      for (let group of session) {
        console.log("group " + group_i);
        let s = "";
        for (let member of group) {
          s += member.id + ",";
        }
        console.log(s);
        group_i++;
      }
      session_i++;
    }
  }
}

function parseTsv(text) {
  let members = [];
  let records = Papa.parse(text, {
    delimiter: "\t",
    header: false,
  }).data;
  
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

function showSession(session) {
  for (let group of session) {
    let s = "";
    for (let member of group) {
      s += member.id + ",";
    }
    console.log(s);
  }
}

let primeNumbers = makePrimeNumbers();
let NUM_MAX_ROOMS = 16;

function makeGroups(members, sessionTime, talkTime, minIntroTime, minMembers) {
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

function uniq(array) {
  const uniquedArray = [];
  for (const elem of array) {
    if (uniquedArray.indexOf(elem) < 0)
      uniquedArray.push(elem);
  }
  return uniquedArray;
}
function test() {
  let members = [];
  for (let i = 1; i <= 50; i++) {
    members.push(new Member(i, "member" + i));
  }
  let group = makeGroups(members, 10, 5, 1, 3)[1];
  let max = group.numMaxMembers;
  let min = group.numMinMembers;
  let dic = {};
  for (let i = 1; i <= 50; i++) {
    dic[i.toString()] = [];
  }
  for (let session of group.allSessions()) {
    for (let group of session) {
      if (group.length !== max && group.length !== min) {
        console.log("failed test");
        return;
      }
      for (let memberA of group) {
        for (let memberB of group) {
          if (memberA.id != memberB.id) {
            dic[memberA.id.toString()].push(memberB.id);
          }
        }
      }
    }

    for (let i = 1; i <= 50; i++) {
      dic[i.toString()].sort(function(a, b) {
        return a - b;
      });
      if (dic[i.toString()].length != uniq(dic[i.toString()]).length) {
        console.log("failed test");
        return;
      }
    }
  }
  console.log("success");
}

module.exports = {
  Member: Member,
  Group: Group,
  makeGroups: makeGroups,
  parseTsv: parseTsv,
}
