import { Typography, withStyles } from "@material-ui/core";
import { green, red, yellow } from "@material-ui/core/colors";
import React from "react";

const style = () => ({
  healthBar: {
    width: "80%",
    height: "50%",
    border: "2 px #ccc solid",
    marginLeft: "auto",
    marginRight: "auto",
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
    height: "30vh",
    width: "auto",
  },
});

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
            Sprint Progress 📈 (BOSS Health)
            {claimedPercent > 60 ? `❤️` : `💔`}
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
      </div>
    );
  }
}

export default withStyles(style)(HealthBar);
