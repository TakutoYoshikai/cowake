
class MemberTable extends React.Component {
  constructor(props) {
    super(props);
    this.group = props.group;
    this.state = {
      memberRooms: this.group.memberRooms(),
    }
  }
  render() {
    return (
      <table>
        <tr>
          <td>
          {this.state.memberRooms.map((member) => {
            return <td>{
          })}
        </tr>
      </table>
    );
  }
}

