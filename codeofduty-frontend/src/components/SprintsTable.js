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
import React from "react";

const style = {
  table: {
    marginTop: 25,
    minWidth: 200,
  },
};

class SprintsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getSortedData() {
    const { sprintData } = this.props;
    sprintData.sort((a, b) => b.points_claimed - a.points_claimed);
    return sprintData;
  }

  render() {
    const { classes } = this.props;
    const { sprintData } = this.props;

    return (
      <TableContainer component={Paper} className={classes.table}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sprint Name</TableCell>
              <TableCell align="right">Repo</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="right">Contributors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sprintData &&
              this.getSortedData().map((sprint) => (
                // eslint-disable-next-line no-underscore-dangle
                <TableRow key={sprint._id}>
                  <TableCell component="th" scope="row">
                    <a href={`/repo/${sprint.repo}/${sprint.sprint_perm_id}`}>
                      {sprint.name}
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    <a href={`/repo/${sprint.repo}`}>{sprint.repo}</a>
                  </TableCell>
                  <TableCell align="right">
                    {new Date(sprint.due_date).toDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {sprint.contributors.length}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(style)(SprintsTable);
