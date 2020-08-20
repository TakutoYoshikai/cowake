
class GroupInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: props.groups,
    }
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
        { this.state.groups.map((group, index) => {
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
let groupInfo = null;

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

  ReactDOM.render(<GroupInfoTable ref={(c) => groupInfo = c} groups={groups} />, document.getElementById("group-info"));
  if (memberTable === null) {
    ReactDOM.render(<MemberTable ref={(c) => memberTable = c} group={groups[groupIndex]} />, document.getElementById("result"));
  } else {
    groupInfo.setState({
      groups: groups,
    });
    memberTable.setState({
      group: groups[groupIndex],
      memberRooms: groups[groupIndex].memberRooms(),
    });
  }
}


document.getElementById("submit").onclick = function() {
  let tsv = document.getElementById("tsv").value;
  let minMembers = parseInt(document.getElementById("minMembers").value);
  let members = parseTsvFront(tsv);
  let groups = makeGroups(members, minMembers);
  currentGroups = groups;
  showRooms(groups, 0);

}

let minMembers = document.getElementById("minMembers");

let mMinMembers = document.getElementById("m-min-members");
let pMinMembers = document.getElementById("p-min-members");

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
