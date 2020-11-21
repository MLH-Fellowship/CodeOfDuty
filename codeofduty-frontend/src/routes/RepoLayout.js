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

class RepoLayout extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/destructuring-assignment
    const { owner, repo } = this.props.match.params;
    this.state = {
      owner,
      repo,
      data: {},
    };
  }

  componentDidMount() {
    this.fetchRepoData();
  }

  async fetchRepoData() {
    const { owner, repo } = this.state;
    axios.get(`http://localhost:5000/repo/${owner}/${repo}`).then((res) => {
      this.setState({
        data: res.data,
      });
    });
  }

  render() {
    const { classes } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { owner, repo, data } = this.state;
    return (
      <div className={classes.root}>
        <Header />
        {`${owner}/${repo}`}
      </div>
    );
  }
}

export default withStyles(style)(RepoLayout);
