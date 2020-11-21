import React from "react";
import { withStyles } from "@material-ui/core";
import Header from "../components/Header";

const style = () => ({
  root: {
    height: "95vh",
    width: "95vw",
  },
});

class SprintLayout extends React.Component {
  constructor(props) {
    super(props);
    this.setState({});
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Header />
        SprintLayout
      </div>
    );
  }
}

export default withStyles(style)(SprintLayout);
