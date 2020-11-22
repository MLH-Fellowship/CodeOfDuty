import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  makeStyles,
  TextField,
  Button,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

class CreateSprint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      repo: null,
      milestone: null,
      settings: {
        victoryThreshold: 90,
      },
    };
  }

  // Use the submitted data to set the state
  handleChangeDropdown = (event, value) => {
    event.preventDefault();
    const id = event.target.id.split(/-(.+)/)[0];
    this.setState({
      [id]: value,
    });
  };

  handleChangeSettings = (event) => {
    const { id, value } = event.target;
    this.setState({
      settings: {
        [id]: value,
      },
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { repo, milestone, settings } = this.state;
    const { token, user, history } = this.props;
    axios
      .post(
        "http://localhost:5000/sprints/create",
        {
          user,
          repo,
          milestone,
          victoryThreshold: settings.victoryThreshold,
        },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then(history.push(`/repo/${repo}`));
  };

  get previousButton() {
    const { currentStep } = this.state;
    if (currentStep > 1) {
      return (
        <Button
          variant="contained"
          color="secondary"
          style={{ margin: "10px 20px 20px 20px" }}
          onClick={this.prev}
          type="button"
        >
          Prev
        </Button>
      );
    }
    return null;
  }

  get nextButton() {
    const { currentStep } = this.state;
    if (currentStep < 3) {
      return (
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "10px 20px 20px 20px" }}
          onClick={this.next}
          type="button"
        >
          Next
        </Button>
      );
    }
    return (
      <Button
        variant="contained"
        color="primary"
        style={{ margin: "10px 20px 20px 20px" }}
        type="button"
        onClick={this.handleSubmit}
      >
        Create Sprint
      </Button>
    );
  }

  next = () => {
    let { currentStep } = this.state;
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2 ? 3 : currentStep + 1;
    this.setState({ currentStep });
  };

  prev = () => {
    let { currentStep } = this.state;
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({ currentStep });
  };

  render() {
    const { token } = this.props;
    const { currentStep, repo, milestone, settings } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Create a New Sprint ⚔️</h1>

        <form>
          <Step1
            currentStep={currentStep}
            handleChange={this.handleChangeDropdown}
            repo={repo}
            token={token}
          />
          <Step2
            currentStep={currentStep}
            handleChange={this.handleChangeDropdown}
            milestone={milestone}
            repo={repo}
            token={token}
          />
          <Step3
            currentStep={currentStep}
            handleChange={this.handleChangeSettings}
            settings={settings}
          />
          {this.previousButton}
          {this.nextButton}
        </form>
      </div>
    );
  }
}

const useStyles = makeStyles({
  dropdownMenu: {
    margin: "0 auto",
    flexDirection: "horizontal",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    margin: "0 auto",
  },
});

const Step1 = (props) => {
  const classes = useStyles();
  const { currentStep, repo, handleChange, token } = props;

  let isRendered = useRef(false);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    isRendered = true;
    axios
      .get("http://localhost:5000/fetchUserRepos", {
        headers: {
          authorization: token,
        },
      })
      .then((res) => {
        if (isRendered) {
          setRepos(res.data);
        }
      });
    return () => {
      isRendered = false;
    };
  }, []);

  if (currentStep !== 1) {
    return null;
  }

  return (
    <div className={classes.dropdownMenu}>
      <h2>Select Sprint&apos;s Repository</h2>
      <Autocomplete
        id="repo"
        className={classes.dropdown}
        options={repos}
        getOptionLabel={(option) => option}
        style={{ width: "80%" }}
        value={repo}
        onChange={(e, value) => handleChange(e, value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a Repository"
            variant="outlined"
            required
          />
        )}
      />
      <p>
        Don&apos;t see your repository? Grant us access &nbsp;
        <a
          href="https://github.com/settings/connections/applications/ef37d21f2e2a5d06f28a"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
      </p>
    </div>
  );
};

const Step2 = (props) => {
  const classes = useStyles();
  const { currentStep, repo, milestone, handleChange, token } = props;
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    if (repo) {
      axios
        .get(`http://localhost:5000/fetchRepoMilestones?repo=${repo}`, {
          headers: {
            authorization: token,
          },
        })
        .then((res) => {
          setMilestones(res.data);
        });
    }
  }, [repo]);

  if (currentStep !== 2) {
    return null;
  }

  return (
    <div className={classes.dropdownMenu}>
      <h2>Select Sprint&apos;s Milestone</h2>
      <Autocomplete
        id="milestone"
        className={classes.dropdown}
        options={milestones}
        getOptionLabel={(option) => option.name}
        style={{ width: "80%" }}
        value={milestone}
        onChange={(e, value) => handleChange(e, value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a Milestone"
            variant="outlined"
            required
          />
        )}
      />
      <p>
        Don&apos;t see your milestone? Make sure that your milestone follows our
        guidelines &nbsp;
        <a
          href="https://github.com/MLH-Fellowship/CodeOfDuty/blob/main/codeofduty-docs/USAGE.md"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
      </p>
    </div>
  );
};

const Step3 = (props) => {
  const classes = useStyles();
  const { currentStep, settings, handleChange } = props;
  if (currentStep !== 3) {
    return null;
  }
  return (
    <div className={classes.dropdownMenu}>
      <h2>Sprint Settings</h2>
      <FormControl>
        <InputLabel htmlFor="victoryThreshold">Victory Threshold</InputLabel>
        <Input
          id="victoryThreshold"
          type="number"
          min="0"
          max="100"
          step="5"
          onChange={(e) => handleChange(e)}
          defaultValue={settings.victoryThreshold}
          endAdornment={<InputAdornment position="end">%</InputAdornment>}
          aria-describedby="victory-threshold-helper-text"
        />
        <FormHelperText id="victory-threshold-helper-text">
          percentage of points needed to win
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default withRouter(CreateSprint);
