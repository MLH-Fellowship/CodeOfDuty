import { Typography, withStyles } from "@material-ui/core";
import React from "react";

const style = (theme) => ({
  header: {
    marginTop: 20,
    marginBottom: 20,
    marginRight: 10,
    display: "inline-block",
  },
  sub: {
    marginBottom: 10,
  },
  paper: {
    margin: theme.spacing(2, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.setState({});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.paper}>
        <span>
          <Typography className={classes.header} variant="h2" center="center">
            Code Of Duty
          </Typography>
        </span>
        <Typography className={classes.sub} variant="h5" align="center">
          Gamifying Agile Sprints | Making Open Source Contributions Fun!
        </Typography>
      </div>
    );
  }
}

export default withStyles(style)(Header);
