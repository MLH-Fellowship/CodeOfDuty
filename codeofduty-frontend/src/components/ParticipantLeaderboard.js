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

class ParticipantLeaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
              <TableCell align="right">Points At Stake</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participantData &&
              participantData.map((participant, index) => (
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
                  <TableCell align="right">
                    {participant.points_at_stake}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(style)(ParticipantLeaderboard);
