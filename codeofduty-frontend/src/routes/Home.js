import React from "react";
import axios from "axios";
import { withCookies } from "react-cookie";
import {
  withStyles,
  Typography,
  Grid,
  Button,
  Dialog,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Header from "../components/Header";
import SprintsTable from "../components/SprintsTable";
import CreateSprint from "../components/CreateSprint";

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
    marginRight: 10,
    display: "inline-block",
  },
  sub: {
    marginBottom: 10,
  },
  centerLeft: {
    marginLeft: "10%",
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
  permalink: {
    cursor: "pointer",
    paddingRight: "5%",
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      loggedInUser: cookies.get("user") || "warrior",
      status: STATUS.INITIAL,
      accessToken: cookies.get("token") || null,
      createSprintModalOpen: false,
    };
  }

  componentDidMount() {
    const { cookies } = this.props;
    const { accessToken, loggedInUser } = this.state;
    if (accessToken) {
      if (loggedInUser !== "warrior") {
        this.fetchUserSprints(loggedInUser);
      }
      this.setState({
        status: STATUS.AUTHENTICATED,
      });
    } else {
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
              cookies.set("token", token, { path: "/" });
              cookies.set("user", user.login, { path: "/" });
              this.setState({
                accessToken: token,
                loggedInUser: user.login,
                status: STATUS.AUTHENTICATED,
              });
              this.fetchUserSprints(user.login);
            }
          });
      }
    }
    this.fetchGlobalSprints();
  }

  handleModalOpen = () => {
    this.setState({ createSprintModalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ createSprintModalOpen: false });
  };

  logOut = () => {
    const { cookies } = this.props;
    cookies.remove("token");
    cookies.remove("user");
    this.setState({
      loggedInUser: cookies.get("user") || "warrior",
      status: STATUS.INITIAL,
      accessToken: cookies.get("token") || null,
    });
  };

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
    const {
      loggedInUser,
      status,
      globalSprints,
      userSprints,
      createSprintModalOpen,
      accessToken,
    } = this.state;
    return (
      <div className={classes.root}>
        <Header
          loggedInUser={loggedInUser}
          logOut={accessToken ? this.logOut : null}
        />
        <Grid container component="main" className={classes.menu}>
          <Grid item xs={6} sm={6} md={6} className={classes.menuItem}>
            <Typography className={classes.sub} variant="h5" align="center">
              🌎 Top Global Active Sprints 🌏
            </Typography>
            <SprintsTable sprintData={globalSprints} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} className={classes.menuItem}>
            {status === STATUS.AUTHENTICATED && (
              <div>
                <div className={classes.flexbox}>
                  <Typography
                    className={classes.centerLeft}
                    variant="h5"
                    align="center"
                  >
                    🛡️ Your Active Sprints 🛡️
                  </Typography>
                  <Button
                    className={classes.floatButton}
                    variant="contained"
                    style={{ background: "#2E3B55", color: "white" }}
                    startIcon={<AddCircleIcon />}
                    onClick={this.handleModalOpen}
                  >
                    Create Sprint
                  </Button>
                </div>
                <SprintsTable sprintData={userSprints} />
                <Dialog
                  open={createSprintModalOpen}
                  onClose={this.handleModalClose}
                  fullWidth
                >
                  <CreateSprint token={accessToken} user={loggedInUser} />
                </Dialog>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(style)(withCookies(Home));
