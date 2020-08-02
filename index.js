
function showTables(json) {
  console.log(json);
  let sessions = json.sessions;
  for (let j = 0; j < sessions.length; j++) {
    let session = sessions[j];
    let sessionTag = "<p>セッション" + j + "</p><div class='session'>";
    for (let i = 0; i < session.length; i++) {
      let room = session[i];
      let roomTag = "<p>チーム" + i + "</p><div class='room'>";
       
      for (let member of room) {
        roomTag += "<p>" + member.id + ": " + member.name + "</p>";
      }
      roomTag += "</div>";
      sessionTag += roomTag;
    }
    sessionTag += "</div>";
    document.getElementById("result").insertAdjacentHTML("beforeend", sessionTag);
  }
}
document.getElementById("submit").onclick = function() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function() {
    showTables(JSON.parse(xhr.responseText));
  }
  xhr.open("POST", "http://localhost:3000/", true);
  xhr.setRequestHeader("Content-Type", 'application/json;charset=UTF-8');
  let tsv = document.getElementById("tsv").value;
  let sessionTime = parseInt(document.getElementById("sessionTime").value);
  let talkTime = parseInt(document.getElementById("talkTime").value);
  let minIntroTime = parseInt(document.getElementById("minIntroTime").value);
  let minMembers = parseInt(document.getElementById("minMembers").value);
  json = {
    tsv: tsv,
    sessionTime: sessionTime,
    talkTime: talkTime,
    minIntroTime: minIntroTime,
    minMembers: minMembers,
  }
  xhr.send(
    JSON.stringify(json));
}
