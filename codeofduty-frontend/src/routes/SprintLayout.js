import React from "react";
import axios from "axios";
import { Grid, Typography, withStyles } from "@material-ui/core";
import Header from "../components/Header";
import HealthBar from "../components/HealthBar";
import ParticipantLeaderboard from "../components/ParticipantLeaderboard";
import TaskBoard from "../components/TaskBoard";
import RepoLayout from "./RepoLayout";
import Genie from "../assets/genie.gif";
import Dragon from "../assets/dragon.gif";
import Monster from "../assets/monster.gif";
import Elf from "../assets/elf.gif";
import Cactus from "../assets/cactus.gif";

const style = () => ({
  root: {
    height: "95vh",
    width: "100vw",
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  menuItem: {
    padding: "0 2.5% 0 2.5%",
    height: "85vh",
    overflowY: "scroll",
    borderStyle: "none solid none solid",
    borderWidth: "thin",
  },
  sub: {
    marginTop: 10,
    marginBottom: 10,
  },
  inline: {
    margin: "10px 50px auto 50px",
    display: "inline-block",
  },
  boss: {
    height: "30vh",
    width: "auto",
  },
});

const sprintBOSS = [Genie, Dragon, Elf, Monster, Cactus];

const getSprintBOSS = () => {
  return sprintBOSS[Math.floor(Math.random() * sprintBOSS.length)];
};

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
  }

  redirect(target) {
    const { history } = this.props;
    history.push(`/${target}`);
  }

  async fetchLatestSprintId() {
    const { owner, repo } = this.state;
    axios.get(`http://localhost:5000/repo/${owner}/${repo}`).then((res) => {
      let sprintPermId = "";
      if (res.data.active_sprints) {
        sprintPermId = res.data.active_sprints[0].sprint_perm_id;
      } else {
        sprintPermId = res.data.past_sprints[0].sprint_perm_id;
      }
      this.setState({
        sprintPermId,
      });
      this.fetchSprintData();
    });
  }

  async fetchSprintData() {
    const { sprintPermId } = this.state;
    if (!sprintPermId) {
      this.fetchLatestSprintId();
      return;
    }
    axios.get(`http://localhost:5000/sprint/${sprintPermId}`).then((res) => {
      this.setState({
        data: res.data,
      });
    });
  }

  render() {
    const { classes } = this.props;
    const { owner, repo, data, sprintPermId } = this.state;
    return (
      <div className={classes.root}>
        <Header />
        {data && (
          <Grid container component="main" className={classes.menu}>
            <Grid item xs={4} sm={4} md={4} className={classes.menuItem}>
              <RepoLayout
                owner={owner}
                repo={repo}
                sprintId={sprintPermId}
                redirect={(target) => this.redirect(target)}
              />
            </Grid>
            <Grid item xs={8} sm={8} md={8} className={classes.menuItem}>
              <Typography className={classes.sub} variant="h5" align="center">
                <a href={data.milestone_url}>{data.name}</a>
                {` 🗡️`}
              </Typography>
              <HealthBar
                maxHp={data.boss_hp_max}
                currHp={data.boss_hp}
                staked={getStakePoints(data.contributors)}
              />
              <Typography
                className={`${classes.sub} ${classes.inline}`}
                variant="h5"
                align="center"
              >
                🛡️ Sprint Leaderboard 🛡️
                <ParticipantLeaderboard
                  participantData={data.contributors.sort(
                    (a, b) => b.points_at_stake - a.points_at_stake
                  )}
                />
              </Typography>
              <img
                className={`${classes.boss} ${classes.inline}`}
                style={{
                  opacity: `${data.boss_hp / data.boss_hp_max}`,
                }}
                src={getSprintBOSS()}
                alt="Sprint Boss Graphic"
              />
              <Typography className={classes.sub} variant="h5" align="center">
                ⚔️ Sprint Task Board ⚔️
                <TaskBoard taskData={data.tasks} />
              </Typography>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(style)(SprintLayout);
