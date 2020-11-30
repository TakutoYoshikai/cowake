
class GroupInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: props.groups,
      selectable: props.selectable,
    }
  }
  render() {
    if (this.state.selectable) {
      return (
        <table>
          <tr>
            <th>選択</th>
            <th>総部屋数</th>
            <th>内訳</th>
            <th></th>
          </tr>
          { this.state.groups.map((group, index) => {
            return (<tr>
              <td><input type="radio" name="radio-session" value={ index.toString() } onChange={ changeRadio } /></td>
              <td>{ group.numTotalRooms }</td>
              <td>{ group.numMaxMembers + "人部屋x" + group.numMaxRooms }</td>
              <td>{ group.numMinMembers + "人部屋x" + group.numMinRooms }</td>
            </tr>);
          })}
        </table>
      );
    } else {
      return (
        <table>
          <tr>
            <th>総部屋数</th>
            <th>内訳</th>
            <th></th>
          </tr>
          { this.state.groups.map((group, index) => {
            return (<tr>
              <td>{ group.numTotalRooms }</td>
              <td>{ group.numMaxMembers + "人部屋x" + group.numMaxRooms }</td>
              <td>{ group.numMinMembers + "人部屋x" + group.numMinRooms }</td>
            </tr>);
          })}
        </table>
      );

    }
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
      <table id="group">
        <thead>
          <tr>
            <th class="no-sort" data-sort-method="none">Room No.</th>
            <th>ID1</th>
            <th>ID2</th>
            <th>ID3</th>
            { sessionHeaders }
          </tr>
        </thead>
        <tbody>
        { this.state.memberRooms.map((memberRoom, index) => {
          let member = memberRoom.member;
          let rooms = memberRoom.rooms;
          return (
            <tr>
              <td>{ rooms[0] }</td>
              <td>{ member.data[0] }</td>
              <td>{ member.data.length >= 2 ? member.data[1] : "" }</td>
              <td>{ member.data.length >= 3 ? member.data[2] : "" }</td>
              {
                rooms.map((room) => {
                  return <td>{room}</td>
                })
              }
            </tr>
          );
        }) }
        </tbody>
      </table>
    );
  }
}

let currentGroups = null;
let memberTable = null;
let groupInfo = null;
let groupInfoForConfirm = null;

function changeRadio() {
  var radio = document.getElementsByName("radio-session");
  for(let i = 0; i < radio.length; i++){
    if (radio[i].checked) {
      showRooms(currentGroups, i); 
      return;
    }
  }
}

function confirmParams() {
  let minMembers = parseInt(document.getElementById("minMembers").value);
  let memberCount = parseInt(document.getElementById("member-count").value);
  let groups = makeGroupsByMemberCount(memberCount, minMembers);
  if (groupInfoForConfirm === null) {
    ReactDOM.render(<GroupInfoTable ref={(c) => groupInfoForConfirm = c} groups={groups} selectable={false} />, document.getElementById("params-result"));
  } else {
    groupInfoForConfirm.setState({
      groups: groups,
    });
  }
}

function showRooms(groups, groupIndex) {
  if (groupIndex >= groups.length) {
    return;
  }

  ReactDOM.render(<GroupInfoTable ref={(c) => groupInfo = c} groups={groups} selectable={true} />, document.getElementById("group-info"));
  var radios = document.getElementsByName("radio-session");
  if (radios.length > 0) {
    radios[0].checked = true;
  }

  if (memberTable === null) {
    ReactDOM.render(<MemberTable ref={(c) => memberTable = c} group={groups[groupIndex]} />, document.getElementById("result"));
    new Tablesort(document.getElementById("group"));
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
  if (groups.length == 0) {
    alert("そのグループ最小人数と参加者数では組分けを作れません");
    return;
  }
  currentGroups = groups;
  showRooms(groups, 0);

}

let minMembers = document.getElementById("minMembers");
let memberCount = document.getElementById("member-count");

let mMinMembers = document.getElementById("m-min-members");
let pMinMembers = document.getElementById("p-min-members");
let mMemberCount = document.getElementById("m-member-count");
let pMemberCount = document.getElementById("p-member-count");
let confirmButton = document.getElementById("confirm");

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

mMemberCount.onclick = function() {
  let value = parseInt(memberCount.value);
  if (value <= 1) {
    memberCount.value = 1;
    return;
  }
  memberCount.value = (value - 1).toString();
}
pMemberCount.onclick = function() {
  let value = parseInt(memberCount.value);
  if (value >= 240) {
    memberCount.value = 240;
    return;
  }
  memberCount.value = (value + 1).toString();

}
confirmButton.onclick = function() {
  confirmParams();
}

function enterExample() {
  document.getElementById("tsv").value = `1	吉開拓人	たくと
2	吉開一花	いちか
3	吉開二乃	にの
4	吉開三玖	みく
5	吉開四葉	よつば
6	吉開五月	いつき
7	佐々木京子	きょうこ
8	佐々木あかり	あっかりーん
9	佐々木結衣	ゆい
10	佐々木千夏	ちなつ
11	棋士あんな	あんな
12	棋士あかり	あかり
13	川岸エレン	えれん`
  minMembers.value = 2;
  memberCount.value = 13
}

document.getElementById("enter-example").onclick = enterExample;
