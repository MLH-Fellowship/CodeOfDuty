import React from "react";
import axios from "axios";
import {
  FormControl,
  ListSubheader,
  MenuItem,
  Select,
  Typography,
  withStyles,
} from "@material-ui/core";
import RepoLeaderBoard from "../components/RepoLeaderBoard";

const style = () => ({
  root: {
    height: "95%",
    width: "100%",
  },
  sub: {
    display: "inline-block",
    margin: "20px auto auto auto",
  },
  formControl: {
    display: "inline-block",
    margin: "20px auto auto auto",
    width: "50%",
  },
  select: {
    width: "80%",
    textAlign: "right",
  },
});

class RepoLayout extends React.Component {
  constructor(props) {
    super(props);
    const { owner, repo } = this.props;
    this.state = {
      owner,
      repo,
      data: null,
    };
  }

  componentDidMount() {
    this.fetchRepoData();
  }

  handleSelectChanged = (event) => {
    const { owner, repo, redirect } = this.props;
    redirect(`repo/${owner}/${repo}/${event.target.value}`);
  };

  async fetchRepoData() {
    const { owner, repo } = this.state;
    axios.get(`http://localhost:5000/repo/${owner}/${repo}`).then((res) => {
      this.setState({
        data: res.data,
      });
    });
  }

  render() {
    const { classes, sprintId } = this.props;
    const { owner, repo, data } = this.state;
    return (
      <div className={classes.root}>
        <Typography variant="h5" align="center">
          <a href={`https://github.com/${owner}/${repo}`}>
            {`${owner}/${repo}`}
          </a>
        </Typography>
        {data && (
          <div>
            <Typography className={classes.sub} variant="h6" align="center">
              Sprint 🗡️
            </Typography>
            <FormControl className={classes.formControl}>
              <Select
                className={classes.select}
                defaultValue={sprintId || data.active_sprints[0].sprint_perm_id}
                id="grouped-select"
                onChange={this.handleSelectChanged}
              >
                <ListSubheader>Active Sprints</ListSubheader>
                {data.active_sprints.map((sprint) => (
                  // eslint-disable-next-line no-underscore-dangle
                  <MenuItem key={sprint._id} value={sprint.sprint_perm_id}>
                    {sprint.name}
                  </MenuItem>
                ))}
                <ListSubheader>Past Sprints</ListSubheader>
                {data.past_sprints.map((sprint) => (
                  // eslint-disable-next-line no-underscore-dangle
                  <MenuItem key={sprint._id} value={sprint.sprint_perm_id}>
                    {sprint.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography className={classes.sub} variant="h6" align="center">
              🛡️ Repo Leaderboard 🛡️
            </Typography>
            <RepoLeaderBoard participantData={data.contributors} />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(style)(RepoLayout);
