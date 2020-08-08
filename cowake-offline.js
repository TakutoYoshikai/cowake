
let currentGroups = null;
function changeSession(event) {
  let index = parseInt(document.getElementById("select-session").value);
  showRooms(currentGroups, index);
}

function changeRadio() {
  var radio = document.getElementsByName("radio-session");
  for(let i = 0; i < radio.length; i++){
    if (radio[i].checked) {
      showRooms(currentGroups, i); 
      return;
    }
  }
}
function showRooms(groups, groupIndex) {
  let rooms = groups[groupIndex].memberRooms();
  let members = groups[groupIndex].members;
  /*
  let selectTag = "<div class='center'><select id='select-session' onchange='changeSession();'>";
  for (let i = 0; i < groups.length; i++) {
    if (i == groupIndex) {
      selectTag += "<option value = '" + i + "' selected>" + groups[i].numTotalRooms + "セッション</option></div>";
    } else {
      selectTag += "<option value = '" + i + "'>" + groups[i].numTotalRooms + "セッション</option></div>";
    }
  }
  document.getElementById("result").innerHTML = selectTag;
  */
  let radioTableTag = "<table><tr><th>選択</th><th>総部屋数</th><th>部屋Aの人数</th><th>部屋Aの部屋数</th><th>部屋Bの人数</th><th>部屋Bの部屋数</th><th>最大可能セッション数</th><th>自己紹介時間</th></tr>";
  for (let i = 0; i < groups.length; i++) {
    let group = groups[i];
    let checked = "";
    if (groupIndex == i) {
      checked = "checked";
    }
    radioTableTag += `<tr><td><input type="radio" name="radio-session" value="${i}" onchange="changeRadio();" ${checked}></td><td>${group.numTotalRooms}</td><td>${group.numMaxMembers}</td><td>${group.numMaxRooms}</td><td>${group.numMinMembers}</td><td>${group.numMinRooms}</td><td></td><td>${group.introTime}分</td></tr>`
  }
  radioTableTag += "</table>";
  document.getElementById("result").innerHTML = radioTableTag;
  let tableTag = "<table>";
  tableTag += "<tr>";
  tableTag += "<th>名前</th>";
  for (let i = 0; i < rooms[0].length; i++) {
    tableTag += "<th>" + (i + 1) + "回目</th>";
  }
  for (let i = 0; i < rooms.length; i++) {
    tableTag += "<tr>";
    tableTag += "<td>" + members[i].data[1] + "</td>";
    let member = rooms[i];
    for (let roomId of member) {
      tableTag += "<td class='center'>" + roomId + "</td>";
    }
    tableTag += "</tr>";
  }
  tableTag += "</table>";
  document.getElementById("result").insertAdjacentHTML("beforeend", tableTag);
}

function showTables(json) {
  console.log(json);
  let sessions = json.sessions;
  for (let j = 0; j < sessions.length; j++) {
    let session = sessions[j];
    let tableTag = "セッション" + (j + 1);
    tableTag += "<table>";
    for (let i = 0; i < session.length; i++) {
      let room = session[i];
      tableTag += "<tr>";
      tableTag += "<td>ルーム" + (i + 1) + "</td>";
      for (let member of room) {
        tableTag += "<td>" + member.data[1] + "</td>";
      }
      tableTag += "</tr>";
    }
    tableTag += "</table><br><br>";
    document.getElementById("result").insertAdjacentHTML("beforeend", tableTag);
  }
}

document.getElementById("submit").onclick = function() {
  let tsv = document.getElementById("tsv").value;
  let sessionTime = parseInt(document.getElementById("sessionTime").value);
  let talkTime = parseInt(document.getElementById("talkTime").value);
  let minIntroTime = parseInt(document.getElementById("minIntroTime").value);
  let minMembers = parseInt(document.getElementById("minMembers").value);
  let members = parseTsvFront(tsv);
  let groups = makeGroups(members, sessionTime, talkTime, minIntroTime, minMembers);
  let json = {
    groups: groups
  }
  currentGroups = groups;
  showRooms(groups, 0);

}

let sessionTime = document.getElementById("sessionTime");
let talkTime = document.getElementById("talkTime");
let minIntroTime = document.getElementById("minIntroTime");
let minMembers = document.getElementById("minMembers");

let mSessionTime = document.getElementById("m-session-time");
let pSessionTime = document.getElementById("p-session-time");
let mTalkTime = document.getElementById("m-talk-time");
let pTalkTime = document.getElementById("p-talk-time");
let mMinIntroTime = document.getElementById("m-min-intro-time");
let pMinIntroTime = document.getElementById("p-min-intro-time");
let mMinMembers = document.getElementById("m-min-members");
let pMinMembers = document.getElementById("p-min-members");

mSessionTime.onclick = function() {
  let value = parseInt(sessionTime.value);
  if (value <= 1) {
    sessionTime.value = 1;
    return;
  }
  sessionTime.value = (value - 1).toString();
}
pSessionTime.onclick = function() {
  let value = parseInt(sessionTime.value);
  if (value >= 240) {
    sessionTime.value = 240;
    return;
  }
  sessionTime.value = (value + 1).toString();
}
mTalkTime.onclick = function() {
  let value = parseInt(talkTime.value);
  if (value <= 1) {
    talkTime.value = 1;
    return;
  }
  talkTime.value = (value - 1).toString();
}
pTalkTime.onclick = function() {
  let value = parseInt(talkTime.value);
  if (value >= 240) {
    talkTime.value = 240;
    return;
  }
  talkTime.value = (value + 1).toString();
}
mMinIntroTime.onclick = function() {
  let value = parseInt(minIntroTime.value);
  if (value <= 1) {
    minIntroTime.value = 1;
    return;
  }
  minIntroTime.value = (value - 1).toString();
}
pMinIntroTime.onclick = function() {
  let value = parseInt(minIntroTime.value);
  if (value >= 240) {
    minIntroTime.value = 240;
    return;
  }
  minIntroTime.value = (value + 1).toString();
}
mMinMembers.onclick = function() {
  let value = parseInt(minMembers.value);
  if (value <= 1) {
    minMembers.value = 1;
    return;
  }
  minMembers.value = (value - 1).toString();
}
pMinMembers.onclick = function() {
  let value = parseInt(minMembers.value);
  if (value >= 240) {
    minMembers.value = 240;
    return;
  }
  minMembers.value = (value + 1).toString();
}
