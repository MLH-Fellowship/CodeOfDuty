import React from "react";
import axios from "axios";

const STATUS = {
  INITIAL: "initial",
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: "warrior",
      status: STATUS.INITIAL,
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
          const { token, user } = res.data;
          this.setState({
            token,
            loggedInUser: user.login,
            status: STATUS.AUTHENTICATED,
          });
        });
    }
  }

  render() {
    const { loggedInUser, status } = this.state;
    return (
      <>
        <h1>{`Welcome, ${loggedInUser}!`}</h1>
        <a
          style={{
            display: status === STATUS.INITIAL ? "inline" : "none",
          }}
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&scope=${process.env.REACT_APP_OAUTH_SCOPES}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`}
        >
          Login
        </a>
      </>
    );
  }
}

export default Home;
