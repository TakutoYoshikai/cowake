"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GroupInfoTable = function (_React$Component) {
  _inherits(GroupInfoTable, _React$Component);

  function GroupInfoTable(props) {
    _classCallCheck(this, GroupInfoTable);

    var _this = _possibleConstructorReturn(this, (GroupInfoTable.__proto__ || Object.getPrototypeOf(GroupInfoTable)).call(this, props));

    _this.state = {
      groups: props.groups,
      selectable: props.selectable
    };
    return _this;
  }

  _createClass(GroupInfoTable, [{
    key: "render",
    value: function render() {
      if (this.state.selectable) {
        return React.createElement(
          "table",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              null,
              "\u9078\u629E"
            ),
            React.createElement(
              "th",
              null,
              "\u7DCF\u90E8\u5C4B\u6570"
            ),
            React.createElement(
              "th",
              null,
              "\u5185\u8A33"
            ),
            React.createElement("th", null)
          ),
          this.state.groups.map(function (group, index) {
            return React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                React.createElement("input", { type: "radio", name: "radio-session", value: index.toString(), onChange: changeRadio })
              ),
              React.createElement(
                "td",
                null,
                group.numTotalRooms
              ),
              React.createElement(
                "td",
                null,
                group.numMaxMembers + "人部屋x" + group.numMaxRooms
              ),
              React.createElement(
                "td",
                null,
                group.numMinMembers + "人部屋x" + group.numMinRooms
              )
            );
          })
        );
      } else {
        return React.createElement(
          "table",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              null,
              "\u7DCF\u90E8\u5C4B\u6570"
            ),
            React.createElement(
              "th",
              null,
              "\u5185\u8A33"
            ),
            React.createElement("th", null)
          ),
          this.state.groups.map(function (group, index) {
            return React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                group.numTotalRooms
              ),
              React.createElement(
                "td",
                null,
                group.numMaxMembers + "人部屋x" + group.numMaxRooms
              ),
              React.createElement(
                "td",
                null,
                group.numMinMembers + "人部屋x" + group.numMinRooms
              )
            );
          })
        );
      }
    }
  }]);

  return GroupInfoTable;
}(React.Component);

var MemberTable = function (_React$Component2) {
  _inherits(MemberTable, _React$Component2);

  function MemberTable(props) {
    _classCallCheck(this, MemberTable);

    var _this2 = _possibleConstructorReturn(this, (MemberTable.__proto__ || Object.getPrototypeOf(MemberTable)).call(this, props));

    _this2.state = {
      group: props.group,
      memberRooms: props.group.memberRooms()
    };
    return _this2;
  }

  _createClass(MemberTable, [{
    key: "render",
    value: function render() {
      var sessionHeaders = [];
      for (var i = 0; i < this.state.memberRooms[0].rooms.length; i++) {
        sessionHeaders.push(React.createElement(
          "th",
          null,
          i + 1 + "回目"
        ));
      }
      var roomNo = 0;
      return React.createElement(
        "table",
        { id: "group" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { "class": "no-sort", "data-sort-method": "none" },
              "Room No."
            ),
            React.createElement(
              "th",
              { id: "id1" },
              "ID1"
            ),
            React.createElement(
              "th",
              null,
              "ID2"
            ),
            React.createElement(
              "th",
              null,
              "ID3"
            ),
            sessionHeaders
          )
        ),
        React.createElement(
          "tbody",
          null,
          this.state.memberRooms.map(function (memberRoom, index) {
            var member = memberRoom.member;
            var rooms = memberRoom.rooms;
            return React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                rooms[0]
              ),
              React.createElement(
                "td",
                null,
                member.data[0]
              ),
              React.createElement(
                "td",
                null,
                member.data.length >= 2 ? member.data[1] : ""
              ),
              React.createElement(
                "td",
                null,
                member.data.length >= 3 ? member.data[2] : ""
              ),
              rooms.map(function (room) {
                return React.createElement(
                  "td",
                  null,
                  room
                );
              })
            );
          })
        )
      );
    }
  }]);

  return MemberTable;
}(React.Component);

var currentGroups = null;
var memberTable = null;
var groupInfo = null;
var groupInfoForConfirm = null;

function changeRadio() {
  var radio = document.getElementsByName("radio-session");
  for (var i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      showRooms(currentGroups, i);
      return;
    }
  }
}

function confirmParams() {
  var minMembers = parseInt(document.getElementById("minMembers").value);
  var memberCount = parseInt(document.getElementById("member-count").value);
  var groups = makeGroupsByMemberCount(memberCount, minMembers);
  if (groupInfoForConfirm === null) {
    ReactDOM.render(React.createElement(GroupInfoTable, { ref: function ref(c) {
        return groupInfoForConfirm = c;
      }, groups: groups, selectable: false }), document.getElementById("params-result"));
  } else {
    groupInfoForConfirm.setState({
      groups: groups
    });
  }
}

function showRooms(groups, groupIndex) {
  if (groupIndex >= groups.length) {
    return;
  }

  ReactDOM.render(React.createElement(GroupInfoTable, { ref: function ref(c) {
      return groupInfo = c;
    }, groups: groups, selectable: true }), document.getElementById("group-info"));

  if (memberTable !== null) {
    groupInfo.setState({
      groups: groups
    });
    var elem = document.getElementById("result");
    elem.parentNode.removeChild(elem);
    elem = document.createElement("div");
    elem.id = "result";
    document.getElementById("result-wrapper").appendChild(elem);
  }
  ReactDOM.render(React.createElement(MemberTable, { ref: function ref(c) {
      return memberTable = c;
    }, group: groups[groupIndex] }), document.getElementById("result"));
  var sort = new Tablesort(document.getElementById("group"));
  var sortFlag = false;
  document.getElementById("group").addEventListener("beforeSort", function () {
    console.log("before sort");
    if (!sortFlag) {
      sortFlag = true;
      sort.refresh();
      document.getElementById("id1").click();
      document.getElementById("id1").click();
      sortFlag = false;
    }
  });
  document.getElementById("download").style.display = "block";
}

document.getElementById("submit").onclick = function () {
  var tsv = document.getElementById("tsv").value;
  var minMembers = parseInt(document.getElementById("minMembers").value);
  var members = parseTsvFront(tsv);
  var groups = makeGroups(members, minMembers);
  if (groups.length == 0) {
    alert("そのグループ最小人数と参加者数では組分けを作れません");
    return;
  }
  currentGroups = groups;
  showRooms(groups, 0);
  var radios = document.getElementsByName("radio-session");
  if (radios.length > 0) {
    radios[0].checked = true;
  }
};

var minMembers = document.getElementById("minMembers");
var memberCount = document.getElementById("member-count");

var mMinMembers = document.getElementById("m-min-members");
var pMinMembers = document.getElementById("p-min-members");
var mMemberCount = document.getElementById("m-member-count");
var pMemberCount = document.getElementById("p-member-count");
var confirmButton = document.getElementById("confirm");

mMinMembers.onclick = function () {
  var value = parseInt(minMembers.value);
  if (value <= 1) {
    minMembers.value = 1;
    return;
  }
  minMembers.value = (value - 1).toString();
};
pMinMembers.onclick = function () {
  var value = parseInt(minMembers.value);
  if (value >= 240) {
    minMembers.value = 240;
    return;
  }
  minMembers.value = (value + 1).toString();
};

mMemberCount.onclick = function () {
  var value = parseInt(memberCount.value);
  if (value <= 1) {
    memberCount.value = 1;
    return;
  }
  memberCount.value = (value - 1).toString();
};
pMemberCount.onclick = function () {
  var value = parseInt(memberCount.value);
  if (value >= 240) {
    memberCount.value = 240;
    return;
  }
  memberCount.value = (value + 1).toString();
};
confirmButton.onclick = function () {
  confirmParams();
};

function enterExample() {
  document.getElementById("tsv").value = "N101\t\u4F50\u85E4\u3044\u3061\u3054\t\u3055\u3068\u3046\u3044\u3061\u3054\nN102\t\u9234\u6728\u3082\u3082\t\u3059\u305A\u304D\u3082\u3082\nN103\t\u9AD8\u6A4B\u30DE\u30B9\u30AB\u30C3\u30C8\t\u305F\u304B\u306F\u3057\u30DE\u30B9\u30AB\u30C3\u30C8\nN104\t\u7530\u4E2D\u306A\u3057\t\u305F\u306A\u304B\u306A\u3057\nN105\t\u4F0A\u85E4\u3076\u3069\u3046\t\u3044\u3068\u3046\u3076\u3069\u3046\nN106\t\u6E21\u8FBA\u30DE\u30F3\u30B4\u30FC\t\u308F\u305F\u306A\u3079\u30DE\u30F3\u30B4\u30FC\nN107\t\u5C71\u672C\u30E1\u30ED\u30F3\t\u3084\u307E\u3082\u3068\u30E1\u30ED\u30F3\nN108\t\u4E2D\u6751\u307F\u304B\u3093\t\u306A\u304B\u3080\u3089\u307F\u304B\u3093\nN109\t\u5C0F\u6797\u308A\u3093\u3054\t\u3053\u3070\u3084\u3057\u308A\u3093\u3054\nN110\t\u52A0\u85E4\u3059\u3044\u304B\t\u304B\u3068\u3046\u3059\u3044\u304B\nN111\t\u5409\u7530\u30D1\u30A4\u30CA\u30C3\u30D7\u30EB\t\u3088\u3057\u3060\u30D1\u30A4\u30CA\u30C3\u30D7\u30EB\nN112\t\u5C71\u7530\u30AD\u30A6\u30A4\t\u3084\u307E\u3060\u30AD\u30A6\u30A4\nN113\t\u4F50\u3005\u6728\u30D0\u30CA\u30CA\t\u3055\u3055\u304D\u30D0\u30CA\u30CA\nN114\t\u5C71\u53E3\u3055\u304F\u3089\u3093\u307C\t\u3084\u307E\u3050\u3061\u3055\u304F\u3089\u3093\u307C\nN115\t\u677E\u672C\u304B\u304D\t\u307E\u3064\u3082\u3068\u304B\u304D\nN116\t\u4E95\u4E0A\u30E9\u30A4\u30C1\t\u3044\u306E\u3046\u3048\u30E9\u30A4\u30C1\nN117\t\u6728\u6751\u30D1\u30D1\u30A4\u30E4\t\u304D\u3080\u3089\u30D1\u30D1\u30A4\u30E4\nN118\t\u6797\u3056\u304F\u308D\t\u306F\u3084\u3057\u3056\u304F\u308D\nN119\t\u658E\u85E4\u3059\u3082\u3082\t\u3055\u3044\u3068\u3046\u3059\u3082\u3082\nN120\t\u6E05\u6C34\u30C7\u30B3\u30DD\u30F3\t\u3057\u307F\u305A\u30C7\u30B3\u30DD\u30F3\nN121\t\u5C71\u5D0E\u30EC\u30E2\u30F3\t\u3084\u307E\u3056\u304D\u30EC\u30E2\u30F3\nN122\t\u68EE\u30AA\u30EC\u30F3\u30B8\t\u3082\u308A\u30AA\u30EC\u30F3\u30B8";
  minMembers.value = 3;
  memberCount.value = 22;
}

document.getElementById("enter-example").onclick = enterExample;