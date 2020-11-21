import React from "react";
import axios from "axios";
import { withStyles, Typography, Grid, Button } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Header from "../components/Header";
import SprintsTable from "../components/SprintsTable";

const STATUS = {
  INITIAL: "initial",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
};

const style = (theme) => ({
  root: {
    height: "95vh",
    width: "95vw",
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    marginRight: 10,
    display: "inline-block",
  },
  sub: {
    marginBottom: 10,
  },
  centerLeft: {
    marginLeft: "20%",
  },
  floatButton: {
    marginRight: 0,
    marginLeft: "auto",
    textTransform: "none",
  },
  paper: {
    margin: theme.spacing(2, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
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
  flexbox: {
    display: "flex",
    flexDirection: "row",
  },
  buttonLogin: {
    marginTop: 20,
    textTransform: "none",
  },
  permalink: {
    cursor: "pointer",
    paddingRight: "5%",
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: "warrior",
      status: STATUS.INITIAL,
      // eslint-disable-next-line react/no-unused-state
      token: null,
    };
  }

  componentDidMount() {
    const url = window.location.href;
    if (url.includes("?code=")) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);
      const code = newUrl[1];
      this.setState({ status: STATUS.LOADING });
      axios
        .get(`http://127.0.0.1:5000/authenticate?code=${code}`)
        .then((res) => {
          if (res.status === 200) {
            const { token, user } = res.data;
            this.setState({
              // eslint-disable-next-line react/no-unused-state
              token,
              loggedInUser: user.login,
              status: STATUS.AUTHENTICATED,
            });
            this.fetchUserSprints(user.login);
          }
        });
    }
    this.fetchGlobalSprints();
  }

  async fetchGlobalSprints() {
    await axios.get("http://localhost:5000/fetchGlobalSprints").then((res) => {
      this.setState({
        globalSprints: res.data,
      });
    });
  }

  async fetchUserSprints(loggedInUser) {
    await axios
      .get(`http://localhost:5000/fetchUserSprints?user=${loggedInUser}`)
      .then((res) => {
        this.setState({
          userSprints: res.data,
        });
      });
  }

  render() {
    const { classes } = this.props;

    // eslint-disable-next-line no-unused-vars
    const { loggedInUser, status, globalSprints, userSprints } = this.state;
    return (
      <div className={classes.root}>
        <Header />
        <Grid container component="main" className={classes.menu}>
          <Grid item xs={6} sm={6} md={6} className={classes.menuItem}>
            <Typography className={classes.sub} variant="h4" align="center">
              Top Global Active Sprints
            </Typography>
            <SprintsTable sprintData={globalSprints} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} className={classes.menuItem}>
            <Typography className={classes.sub} variant="h4" align="center">
              {`Welcome, ${loggedInUser}!`}
            </Typography>
            {status !== STATUS.AUTHENTICATED && (
              <Button
                className={classes.buttonLogin}
                variant="contained"
                color="primary"
                startIcon={<GitHubIcon />}
                href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&scope=${process.env.REACT_APP_OAUTH_SCOPES}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`}
              >
                Login with GitHub
              </Button>
            )}
            {status === STATUS.AUTHENTICATED && (
              <div>
                <div className={classes.flexbox}>
                  <Typography
                    className={classes.centerLeft}
                    variant="h5"
                    align="center"
                  >
                    Your Active Sprints
                  </Typography>
                  <Button
                    className={classes.floatButton}
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    href="/createSprint"
                  >
                    Create New Sprint
                  </Button>
                </div>
                <SprintsTable sprintData={userSprints} />
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(style)(Home);
