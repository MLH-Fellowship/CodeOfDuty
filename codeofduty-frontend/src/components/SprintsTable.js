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
    marginTop: 50,
    minWidth: 200,
  },
};

class SprintsTable extends React.Component {
  constructor(props) {
    super(props);
    this.setState({});
  }

  render() {
    const { classes } = this.props;
    const { sprintData } = this.props;

    return (
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="simple table">
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
              sprintData.map((sprint) => (
                // eslint-disable-next-line no-underscore-dangle
                <TableRow key={sprint._id}>
                  <TableCell component="th" scope="row">
                    {sprint.name}
                  </TableCell>
                  <TableCell align="right">{sprint.repo}</TableCell>
                  <TableCell align="right">
                    {new Date(sprint.due_date).toString()}
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
