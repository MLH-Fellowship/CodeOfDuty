import { Typography, withStyles } from "@material-ui/core";
import { green, red, yellow } from "@material-ui/core/colors";
import React from "react";
import Genie from "../assets/genie.gif";
import Dragon from "../assets/dragon.gif";
import Monster from "../assets/monster.gif";
import Elf from "../assets/elf.gif";
import Cactus from "../assets/cactus.gif";

const style = () => ({
  healthBar: {
    width: "100%",
    height: "50%",
    border: "2 px #ccc solid",
  },
  healthSection: {
    display: "inline-block",
    height: "50px",
    fontSize: "15pt",
    verticalAlign: "top",
    textAlign: "center",
    p: {
      margin: 0,
      padding: "3px",
    },
  },
  left: {
    backgroundColor: red.A400,
    transition: "width 1s ease-in-out",
  },
  stake: {
    backgroundColor: yellow.A700,
    transition: "width 1s ease-in-out",
  },
  claimed: {
    backgroundColor: green.A700,
    transition: "width 1s ease-in-out",
  },
  title: {
    marginBottom: "10px",
  },
  boss: {
    marginTop: "10px",
    height: "auto",
  },
});

const sprintBOSS = [Genie, Dragon, Elf, Monster, Cactus];

const getSprintBOSS = () => {
  return sprintBOSS[Math.floor(Math.random() * sprintBOSS.length)];
};

class HealthBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const { maxHp, staked, currHp } = this.props;
    const safe = currHp - staked;
    const claimedPercent = ((maxHp - currHp) / maxHp) * 100;
    const stakedPercent = (staked / maxHp) * 100;
    const safePercent = 100 - claimedPercent - stakedPercent;

    return (
      <div>
        <div className={classes.healthBar}>
          <Typography className={classes.title} variant="h5" align="center">
            Sprint Progress Bar (BOSS Health)
          </Typography>
          <div
            className={`${classes.healthSection} ${classes.claimed}`}
            style={{ width: `${claimedPercent}%` }}
          >
            <p>{maxHp - currHp}</p>
          </div>
          <div
            className={`${classes.healthSection} ${classes.stake}`}
            style={{ width: `${stakedPercent}%` }}
          >
            <p>{staked}</p>
          </div>
          <div
            id="left"
            className={`${classes.healthSection} ${classes.left}`}
            style={{ width: `${safePercent}%` }}
          >
            <p>{safe}</p>
          </div>
        </div>
        <img
          className={classes.boss}
          style={{
            width: `${0.8 * (100 - claimedPercent)}%`,
            opacity: `${(100 - claimedPercent) / 60}`,
          }}
          src={getSprintBOSS()}
          alt="Sprint Boss Graphic"
        />
      </div>
    );
  }
}

export default withStyles(style)(HealthBar);
