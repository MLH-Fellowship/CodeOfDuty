import React from "react";
import axios from "axios";
import { Grid, Typography, withStyles } from "@material-ui/core";
import Header from "../components/Header";
import HealthBar from "../components/HealthBar";
import ParticipantLeaderboard from "../components/ParticipantLeaderboard";

const style = () => ({
  root: {
    height: "95vh",
    width: "95vw",
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  menuItem: {
    padding: "0 2.5% 0 2.5%",
  },
  sub: {
    marginBottom: 10,
  },
});

const getStakePoints = (contributors) => {
  let sum = 0;
  contributors.forEach((contributor) => {
    sum += contributor.points_at_stake;
  });
  return sum;
};

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
    this.fetchRepoData();
  }

  async fetchSprintData() {
    const { sprintPermId } = this.state;
    axios.get(`http://localhost:5000/sprint/${sprintPermId}`).then((res) => {
      this.setState({
        data: res.data,
      });
    });
  }

  async fetchRepoData() {
    const { owner, repo } = this.state;
    axios.get(`http://localhost:5000/repo/${owner}/${repo}`).then((res) => {
      this.setState({
        repoData: res.data,
      });
    });
  }

  render() {
    const { classes } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { owner, repo, sprintPermId, data, repoData } = this.state;
    console.log(data);
    return (
      <div className={classes.root}>
        <Header />
        {data && repoData && (
          <Grid container component="main" className={classes.menu}>
            <Grid item xs={6} sm={6} md={6} className={classes.menuItem}>
              <Typography className={classes.sub} variant="h5" align="center">
                {`${data.name} (${owner}/${repo})`}
              </Typography>
              <Typography className={classes.sub} variant="h6" align="left">
                {`Repository Link: `}
                <a href={repoData.repo_url}>{repoData.repo_url}</a>
              </Typography>
              <Typography className={classes.sub} variant="h6" align="left">
                {`Milestone Link: `}
                <a href={data.milestone_url}>{data.milestone_url}</a>
              </Typography>
              <Typography className={classes.sub} variant="h5" align="center">
                {`Sprint Leaderboard `}
                <ParticipantLeaderboard
                  participantData={data.contributors.sort(
                    (a, b) => b.points_at_stake - a.points_at_stake
                  )}
                />
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} md={6} className={classes.menuItem}>
              {/* <SprintsTable sprintData={globalSprints} /> */}
              <HealthBar
                maxHp={data.boss_hp_max}
                currHp={data.boss_hp}
                staked={getStakePoints(data.contributors)}
              />
              Sprint Graphic
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(style)(SprintLayout);
