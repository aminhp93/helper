import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class StockDetail extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Ket qua kinh doanh" />
            <Tab label="Can doi ke toan" />
            <Tab label="Luu chuyen tien te - Truc tiep" />
            <Tab label="Luu chuyen tien te - Gian tiep" />
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer>Ket qua kinh doanh</TabContainer>}
        {value === 1 && <TabContainer>Can doi ke toan</TabContainer>}
        {value === 2 && (
          <TabContainer>Luu chuyen tien te - Truc tiep</TabContainer>
        )}
        {value === 3 && (
          <TabContainer>Luu chuyen tien te - Gian tiep</TabContainer>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(StockDetail);
