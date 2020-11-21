import React from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core";
import Header from "../components/Header";

const style = () => ({
  root: {
    height: "95vh",
    width: "95vw",
  },
});

class SprintLayout extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/destructuring-assignment
    const { owner, repo, sprintPermId } = this.props.match.params;
    this.state = {
      owner,
      repo,
      sprintPermId,
    };
  }

  componentDidMount() {
    this.fetchSprintData();
  }

  async fetchSprintData() {
    const { sprintPermId } = this.state;
    axios.get(`http://localhost:5000/sprint/${sprintPermId}`).then((res) => {
      this.setState({
        data: res.data,
      });
    });
  }

  render() {
    const { classes } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { owner, repo, sprintPermId, data } = this.state;
    return (
      <div className={classes.root}>
        <Header />
        {`${owner}/${repo}/${sprintPermId}`}
      </div>
    );
  }
}

export default withStyles(style)(SprintLayout);
