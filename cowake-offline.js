
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
  let tsv = document.getElementById("tsv").value;
  let sessionTime = parseInt(document.getElementById("sessionTime").value);
  let talkTime = parseInt(document.getElementById("talkTime").value);
  let minIntroTime = parseInt(document.getElementById("minIntroTime").value);
  let minMembers = parseInt(document.getElementById("minMembers").value);
  let members = parseTsvFront(tsv);
  let groups = makeGroups(members, sessionTime, talkTime, minIntroTime, minMembers);
  let group = groups[0];
  let json = {
    members: members,
    rooms: group.memberRooms(),
  }
  showRooms(json);

}
