import {
  Typography,
  withStyles,
  AppBar,
  Toolbar,
  Button,
} from "@material-ui/core";
import React from "react";
import GitHubIcon from "@material-ui/icons/GitHub";
import Logo from "../assets/codeofduty-logo.png";

const style = () => ({
  header: {
    marginTop: 20,
    marginRight: 10,
    display: "inline-block",
  },
  sub: {
    marginBottom: 10,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "15%",
  },
  items: {
    display: "inline-block",
    marginRight: "20px",
  },
  rightAlign: {
    position: "absolute",
    right: "0px",
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, loggedInUser, logOut } = this.props;

    return (
      <div className={classes.paper}>
        <AppBar position="fixed" style={{ background: "#2E3B55" }}>
          <Toolbar>
            <a href="http://localhost:3000/">
              <img src={Logo} alt="logo" width="300" aria-label="logo" />
            </a>
            <div className={classes.rightAlign}>
              <Typography className={classes.items} variant="h5" align="center">
                {`Welcome, ${loggedInUser}!`}
              </Typography>
              {logOut ? (
                <Button
                  className={classes.items}
                  variant="contained"
                  onClick={logOut}
                >
                  Log Out
                </Button>
              ) : (
                <Button
                  className={classes.items}
                  variant="contained"
                  startIcon={<GitHubIcon />}
                  href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&scope=${process.env.REACT_APP_OAUTH_SCOPES}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`}
                >
                  Login with GitHub
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(style)(Header);
