import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import BusinessSummary from "../BusinessSummary";
import ChartTV from "../ChartTV";
import businessSummaryTypes from '../../constants/businessSummaryTypes'

function TabContainer(props) {
  return (
    <Typography component="div">
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
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      symbol: props.symbol
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return (
      <div className={'stockDetail'}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Chart" />
            <Tab label="Ket qua kinh doanh" />
            <Tab label="Can doi ke toan" />
            <Tab label="Luu chuyen tien te - Truc tiep" />
            <Tab label="Luu chuyen tien te - Gian tiep" />
            <Tab label="Close" onClick={() => this.props.closeStockDetail()} />
            closeStockDetail
          </Tabs>
        </AppBar>
        {value === 0 && <TabContainer><ChartTV symbol={this.state.symbol} /></TabContainer>}
        {value === 1 && <TabContainer><BusinessSummary symbol={this.state.symbol} typeBusinessSummary={businessSummaryTypes.KET_QUA_KINH_DOANH} /></TabContainer>}
        {value === 2 && <TabContainer><BusinessSummary symbol={this.state.symbol} typeBusinessSummary={businessSummaryTypes.CAN_DOI_KE_TOAN} /></TabContainer>}
        {value === 3 && (
          <TabContainer><BusinessSummary symbol={this.state.symbol} typeBusinessSummary={businessSummaryTypes.LUU_CHUYEN_TIEN_TE_TRUC_TIEP} /></TabContainer>
        )}
        {value === 4 && (
          <TabContainer><BusinessSummary symbol={this.state.symbol} typeBusinessSummary={businessSummaryTypes.LUU_CHUYEN_TIEN_TE_GIAN_TIEP} /></TabContainer>
        )}
        {value === 5 && <TabContainer></TabContainer>}
      </div>
    );
  }


}

export default withStyles(styles)(StockDetail);
