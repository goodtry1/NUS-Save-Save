/*!

=========================================================
* Now UI Dashboard PRO React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";
// react plugin used to create charts
// import { Line } from "react-chartjs-2";
// react plugin for creating vector maps
// import { VectorMap } from "react-jvectormap";

import { api } from '../../api-config'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";
import moment from "moment";
import "moment-timezone"
//import { User } from '../../models/User';
//import { Bank } from '../../models/Bank';

//Axios
import axios from 'axios';
/* import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple"; */

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.retrieveUserBanks.bind(this)
    this.state = {
      user: '',
      accounts: [],
      finishedLoading: '',
      JWT_Token: ''
      //redirectToAddBanks: false
    }
  }

  componentDidMount = () => {
    var user = localStorage.getItem('user')
    this.setState({ user: JSON.parse(user) }, () => {    })

    setTimeout(() => {
      this.retrieveUserBanks()
    }, 200);

  }

  /**
   *  Upon entering this page, this method will be called to make a RESTful API call 
   *  to backend to retrieve all the bank accounts tagged to this account. 
   *  Same API retrieved from Banks.jsx
   */
  retrieveUserBanks = () => {
    axios({
      method: 'post',
      url: `${api}/userBankAccountDetails`,
      withCredentials: true,
      data: {
        userId: this.state.user.userId
      }
    }).then((response) => {
      if (response.status === 200) {
        this.setState({ accounts: response.data.userBankAccountDetails })
        this.setState({ finishedLoading: true })
      } else {

      }
    }).catch((err) => {
      console.log(err.message)
    })
  }

  /**
   * This method will redirect the user from the dashboard to the specified bank account. 
   * 
   * @param {*} e - Event that is triggered when user click on the 'View More' button
   * @param {*} account - The account that is used to be pushed to the actual bank account page
   */
  redirectToBankAccountDetails = (e, account) => {
    this.props.history.push({
      pathname: '/admin/BankAccountDetails',
      data: account // your data array of objects
    })
  }

  //this is still WIP..
  /* getBankProgress = (accountTypeId) => {
    var currentProgress = 0;
    var maxProgress = 0;
    var percentage = 0;
    console.log("API called.. accountTypeId ->" + accountTypeId)
    console.log("userid.. " + this.state.user.userId)

    axios({
      method: 'post',
      url: `${api}/fetchrecommendations`,
      data: {
        userId: this.state.user.userId,
        accountTypeid: accountTypeId
      }
    }).then((response) => {
      if (response.status === 200) {
        var recommendation = response.data.recommendation

        if (recommendation.length > 0) {

          var maxInterest = 0
          var currentInterest = 0

          for (var i = 0; i < recommendation.length; i++) {
            maxInterest += recommendation[i].interestEarned
            maxInterest += recommendation[i].interestToBeEarned
            currentInterest += recommendation[i].interestEarned




            currentProgress = (Math.round(currentInterest * 100) / 100).toFixed(2)
            maxProgress = (Math.round(maxInterest * 100) / 100).toFixed(2)

            percentage = (Math.round(currentInterest / maxInterest * 100)).toFixed(0)
            console.log(percentage)
          }
          return percentage

        } else {

        }

      } else {

      }
    }).catch((err) => {

    })
    return 0
  } */

  /**
   *  This method will only be used when the logged in user do not have any existing bank accounts created
   *  This is to boost the UX to reduce number of clicks they have to perform in order to add a new bank acc
   */
  redirectToAddBanks = () => {
    this.props.history.push({
      pathname: '/admin/addBanks',
      data: this.state.accounts // your data array of objects
    })
  }

  /**
   * Render the loading spinner when API call is still being made.
   */
  renderLoading() {
    console.log("rendering loading..")
    return (
      <div>
        <center>
          <button className="btn btn-info btn-sm mb" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                        </button>
        </center>
      </div>
    )
  }

  render() {
    return (
      <>
        <PanelHeader
          content={
            <div className="header text-center">
              <h2 className="title">Welcome, {this.state.user.firstName} </h2>
              <p className="category">
                Member since: {moment(this.state.user.joinDate)
                  .tz("Singapore")
                  .format('DD-MMMM-YYYY')}
              </p>
            </div>
          }
        />
        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <Card className="card-chart">
                <CardHeader>
                  {/*  <h5 className="card-category"></h5> */}
                  <CardTitle tag="h2" >
                    My Bank Status
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    {this.state.finishedLoading === true ? (
                      this.state.accounts.length !== 0 ? (
                        this.state.accounts.map((account) =>
                          <Col key={account.userBankAccountId} xs={12} md={4}>
                            <Card className="card-chart">
                              <CardHeader>
                                <b> {account.accountTypeName} </b>
                              </CardHeader>
                              <CardBody>
                                Date Created: {moment(account.date)
                                  .tz("Singapore")
                                  .format('DD-MMMM-YYYY')}
                                <br />
                                  Progress:  <b> To be updated.. PLACEHOLDER </b>{/* this.getBankProgress(account.accountTypeId) */}
                                <br />
                                  Interest Rates  <b> To be updated.. PLACEHOLDER </b>
                                <br />
                                <Button color="primary" className="btn-round float-right" onClick={(e) => this.redirectToBankAccountDetails(e, account)}>
                                  View more
                             </Button>
                              </CardBody>
                            </Card>
                          </Col>
                        )
                      ) : (
                          <Col>
                            <CardHeader>
                              <center>
                                <b>You have no bank accounts added with us..... Lets get started now! </b>
                                <br />
                                <Button color="alert" onClick={this.redirectToAddBanks} className="btn-round btn-icon">
                                  <i className="now-ui-icons ui-1_simple-add" />
                                </Button>
                              </center>
                            </CardHeader>
                          </Col>
                        )
                    ) : (
                        <Col md={12}>
                          {this.renderLoading()}
                        </Col>
                      )
                    }

                  </Row>
                </CardBody>
                <CardFooter>
                  <div className="stats">
                    <i className="now-ui-icons arrows-1_refresh-69" />
                    Just Updated
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;