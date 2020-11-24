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

class RepoLeaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getSortedData() {
    const { participantData } = this.props;
    participantData.sort((a, b) => b.points_claimed - a.points_claimed);
    return participantData;
  }

  render() {
    const { classes } = this.props;
    const { participantData } = this.props;
    return (
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Participant</TableCell>
              <TableCell align="right">Points Claimed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participantData &&
              this.getSortedData().map((participant, index) => (
                // eslint-disable-next-line no-underscore-dangle
                <TableRow key={participant.user}>
                  <TableCell component="th" scope="row">
                    <a href={`https://github.com/${participant.user}`}>
                      {participant.user}
                    </a>
                    {index === 0 && `  🏆`}
                  </TableCell>
                  <TableCell align="right">
                    {participant.points_claimed}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(style)(RepoLeaderboard);
