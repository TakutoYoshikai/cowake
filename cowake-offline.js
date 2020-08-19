
class GroupInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.groups = props.groups;
  }
  render() {
    return (
      <table>
        <tr>
          <th>選択</th>
          <th>総部屋数</th>
          <th>部屋Aの人数</th>
          <th>部屋Aの部屋数</th>
          <th>部屋Bの人数</th>
          <th>部屋Bの部屋数</th>
        </tr>
        { this.groups.map((group, index) => {
          return (<tr>
            <td><input type="radio" name="radio-session" value={ index.toString() } onChange={ changeRadio } /></td>
            <td>{ group.numTotalRooms }</td>
            <td>{ group.numMaxMembers }</td>
            <td>{ group.numMaxRooms }</td>
            <td>{ group.numMinMembers }</td>
            <td>{ group.numMinRooms }</td>
          </tr>);
        })}
      </table>
    );
  }
}

class MemberTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      memberRooms: props.group.memberRooms(),
    }
  }
  render() {
    const sessionHeaders = [];
    for (let i = 0; i < this.state.memberRooms[0].rooms.length; i++) {
      sessionHeaders.push(
        <th>{(i + 1) + "回目"}</th>
      )
    }
    let roomNo = 0;
    return (
      <table>
        <tr>
          <th>Room No.</th>
          <th>ID1</th>
          <th>ID2</th>
          { sessionHeaders }
        </tr>
        { this.state.memberRooms.map((memberRoom, index) => {
          let member = memberRoom.member;
          let rooms = memberRoom.rooms;
          return (
            <tr>
              <td>{ rooms[0] > roomNo ? ++roomNo : "" }</td>
              <td>{ member.data[0] }</td>
              <td>{ member.data.length >= 2 ? member.data[1] : "" }</td>
              {
                rooms.map((room) => {
                  return <td>{room}</td>
                })
              }
            </tr>
          );
        }) }
      </table>
    );
  }
}

let currentGroups = null;
let memberTable = null;

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

  ReactDOM.render(<GroupInfoTable groups={groups} />, document.getElementById("group-info"));
  if (memberTable === null) {
    ReactDOM.render(<MemberTable ref={(c) => memberTable = c} group={groups[groupIndex]} />, document.getElementById("result"));
  } else {
    memberTable.setState({
      group: groups[groupIndex],
      memberRooms: groups[groupIndex].memberRooms(),
    });
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
