function showRooms(json) {
  let rooms = json.rooms;
  let members = json.members;
  let tableTag = "<table>";
  for (let i = 0; i < rooms.length; i++) {
    tableTag += "<tr>";
    tableTag += "<td>" + members[i].name + "</td>";
    let member = rooms[i];
    for (let roomId of member) {
      tableTag += "<td>" + roomId + "</td>";
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
        tableTag += "<td>" + member.name + "</td>";
      }
      tableTag += "</tr>";
    }
    tableTag += "</table><br><br>";
    document.getElementById("result").insertAdjacentHTML("beforeend", tableTag);
  }
}
document.getElementById("submit").onclick = function() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function() {
    showRooms(JSON.parse(xhr.responseText));
  }
  xhr.open("POST", "http://localhost:8081", true);
  xhr.setRequestHeader("Content-Type", 'application/json;charset=UTF-8');
  let tsv = document.getElementById("tsv").value;
  let sessionTime = parseInt(document.getElementById("sessionTime").value);
  let talkTime = parseInt(document.getElementById("talkTime").value);
  let minIntroTime = parseInt(document.getElementById("minIntroTime").value);
  let minMembers = parseInt(document.getElementById("minMembers").value);
  json = {
    tsv: tsv,
    session_time: sessionTime,
    talk_time: talkTime,
    min_intro_time: minIntroTime,
    min_members: minMembers,
  }
  xhr.send(
    JSON.stringify(json));
}
