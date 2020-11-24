import {
  withStyles,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  Table,
  Paper,
  TableRow,
} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import React from "react";

const style = {
  table: {
    marginTop: 25,
    minWidth: 200,
  },
};

class TaskBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    const { taskData } = this.props;
    return (
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Task</TableCell>
              <TableCell align="right">Task Status</TableCell>
              <TableCell align="right">Contributor</TableCell>
              <TableCell align="right">Contribution Points</TableCell>
              <TableCell align="right">Reviewer</TableCell>
              <TableCell align="right">Review Points</TableCell>
              <TableCell align="right">PR Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskData &&
              taskData.map((task, index) => (
                // eslint-disable-next-line no-underscore-dangle
                <TableRow key={task.issue_url}>
                  <TableCell component="th" scope="row">
                    <a href={task.issue_url}>
                      {task.title ? task.title : `Task # ${index}`}
                    </a>
                  </TableCell>
                  <TableCell align="right">{task.task_status}</TableCell>
                  <TableCell align="right">
                    <a href={`https://github.com/${task.contributor}`}>
                      {task.contributor}
                    </a>
                  </TableCell>
                  <TableCell align="right">{task.contributor_points}</TableCell>
                  <TableCell align="right">
                    <a href={`https://github.com/${task.reviewer}`}>
                      {task.reviewer}
                    </a>
                  </TableCell>
                  <TableCell align="right">{task.reviewer_points}</TableCell>
                  <TableCell align="right">
                    {task.pr_url ? (
                      <a href={task.pr_url}>
                        <GitHubIcon />
                      </a>
                    ) : (
                      <div>-</div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(style)(TaskBoard);
