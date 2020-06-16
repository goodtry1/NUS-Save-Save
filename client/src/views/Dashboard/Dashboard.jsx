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

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  //DropdownToggle,
  //DropdownMenu,
  //DropdownItem,
  //UncontrolledDropdown,
  //Table,
  //Progress,
  Row,
  Col
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";
/*
import {
  dashboardPanelChart,
  dashboardActiveUsersChart,
  dashboardSummerChart,
  dashboardActiveCountriesCard
} from "variables/charts.jsx";

import jacket from "assets/img/saint-laurent.jpg";
import shirt from "assets/img/balmain.jpg";
import swim from "assets/img/prada.jpg";
*/

import { table_data } from "variables/general.jsx";
import { User } from '../../models/User';
import { Bank } from '../../models/Bank';

//Axios
import axios from 'axios';

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.retrieveUserBanks.bind(this)
    this.state = {
      user: '',
      accounts: []
      //redirectToAddBanks: false
    }
  }

  componentDidMount = () => {
    var user = localStorage.getItem('user')
    //console.log("this is user " + user)
    //console.log("this is ussser from session " + localStorage.getItem('user'))
    this.setState({ user: JSON.parse(user) }, () => {
      console.log("username " + JSON.stringify(this.state.user))

      //console.log("username date" + this.state.user.joinDate.toLocaleDateString())
    })


    setTimeout(() => {
      this.retrieveUserBanks()
    }, 200);

  }

  retrieveUserBanks = () => {

    axios({
      method: 'post',
      url: '/userBankAccountDetails',
      data: {
        userId: this.state.user.userId
      }
    }).then((response) => {
      if (response.status === 200) {
        this.setState({ accounts: response.data.userBankAccountDetails })
        console.log(" UserBankAcc Success")


      } else {
        console.log("Failed to load user banks")
      }
    }).catch((err) => {
      console.log(err.message)
    })
  }

  redirectToBankAccountDetails = (e, account) => {
    this.props.history.push({
      pathname: '/admin/BankAccountDetails',
      data: account // your data array of objects
    })
  }


  createTableData() {
    var tableRows = [];
    for (var i = 0; i < table_data.length; i++) {
      tableRows.push(
        <tr key={i}>
          <td>
            <div className="flag">
              <img src={table_data[i].flag} alt="us_flag" />
            </div>
          </td>
          <td>{table_data[i].country}</td>
          <td className="text-right">{table_data[i].count}</td>
          <td className="text-right">{table_data[i].percentage}</td>
        </tr>
      );
    }
    return tableRows;
  }
  render() {

    //User user = localStorage.getItem('user');
    //var user = JSON.parse(localStorage.getItem('user'));
    //var b = new User();


    //console.log("This is the user --> " + user);
    return (
      <>

        <PanelHeader
          size="sm" />

        {/** 
            content={
              <Line
                data={dashboardPanelChart.data}
                options={dashboardPanelChart.options}
              }
          */}

        <div className="content">
          <Row>
            <Col xs={12} md={12}>
              <Card className="card-stats card-raised">
                <CardBody>
                  <Row>
                    <Col md="9">
                      <div className="intro">
                        <div className="info">

                          <h2 className="info-title">Welcome back,</h2>
                          <p className="info-title">{this.state.user.firstName}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="intro">
                        <div className="info">


                          <p className="info-title">Member since: {this.state.user.joinDate}</p>
                          {/* TODO:... check why cannot check for joiningDate!*/}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs={12} md={12}>
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category"></h5>
                  <CardTitle tag="h2" >Your Bank Accounts:</CardTitle>
                  {/*  
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="btn-round btn-icon"
                      color="default"
                      outline
                    >
                      <i className="now-ui-icons loader_gear" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another Action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                      <DropdownItem className="text-danger">
                        Remove data
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  */}

                </CardHeader>
                <CardBody>
                  <Row>
                    {this.state.accounts.map((account) =>

                      <Col key={account.userBankAccountId} xs={12} md={4}>
                        <Card className="card-chart">
                          <CardHeader>
                            <b> {account.accountTypeName} </b>
                          </CardHeader>
                          <CardBody>
                            Date Created: {account.date}
                            <br />
                          Progress:  <b> To be updated.. PLACEHOLDER </b>
                            <br />
                          Interest Rates  <b> To be updated.. PLACEHOLDER </b>
                            <br />

                            <Button color="primary" className="btn-round float-right" onClick={(e) => this.redirectToBankAccountDetails(e, account)}>
                              View more
                            </Button>
                          </CardBody>
                        </Card>

                      </Col>
                    )}
                  </Row>
                  {/*
                    <Col xs={12} md={4}>
                      <Card className="card-chart">
                        <CardHeader>
                          B
                        </CardHeader>
                        <CardBody>
                          1231231
                        </CardBody>
                      </Card>

                    </Col>
                    <Col xs={12} md={4}>
                      <Card className="card-chart">
                        <CardHeader>
                          C
                        </CardHeader>
                        <CardBody>
                          1231231
                        </CardBody>
                      </Card>

                    </Col>


                  </Row>
                  
                  <div className="chart-area">
                    <Line
                      data={dashboardActiveUsersChart.data}
                      options={dashboardActiveUsersChart.options}
                    />
                  </div>
                  <Table responsive>
                    <tbody>{this.createTableData()}</tbody>
                  </Table>
                  */}
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
          {/*
            <Col xs={12} md={4}>
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Summer Email Campaign</h5>
                  <CardTitle tag="h2">55,300</CardTitle>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="btn-round btn-icon"
                      color="default"
                      outline
                    >
                      <i className="now-ui-icons loader_gear" />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>Action</DropdownItem>
                      <DropdownItem>Another Action</DropdownItem>
                      <DropdownItem>Something else here</DropdownItem>
                      <DropdownItem className="text-danger">
                        Remove data
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={dashboardSummerChart.data}
                      options={dashboardSummerChart.options}
                    />
                  </div>
                  <div className="card-progress">
                    <div className="progress-container">
                      <span className="progress-badge">Delivery Rate</span>
                      <Progress max="100" value="90">
                        <span className="progress-value">90%</span>
                      </Progress>
                    </div>
                    <div className="progress-container progress-success">
                      <span className="progress-badge">Open Rate</span>
                      <Progress max="100" value="60">
                        <span className="progress-value">60%</span>
                      </Progress>
                    </div>
                    <div className="progress-container progress-info">
                      <span className="progress-badge">Click Rate</span>
                      <Progress max="100" value="12">
                        <span className="progress-value">12%</span>
                      </Progress>
                    </div>
                    <div className="progress-container progress-warning">
                      <span className="progress-badge">Hard Bounce</span>
                      <Progress max="100" value="5">
                        <span className="progress-value">5%</span>
                      </Progress>
                    </div>
                    <div className="progress-container progress-danger">
                      <span className="progress-badge">Spam Report</span>
                      <Progress max="100" value="0.11">
                        <span className="progress-value">0.11%</span>
                      </Progress>
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <div className="stats">
                    <i className="now-ui-icons arrows-1_refresh-69" />
                    Just Updated
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Active Countries</h5>
                  <CardTitle tag="h2">105</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={dashboardActiveCountriesCard.data}
                      options={dashboardActiveCountriesCard.options}
                    />
                  </div>
                  <VectorMap
                    map={"world_mill"}
                    backgroundColor="transparent"
                    zoomOnScroll={false}
                    containerStyle={{
                      width: "100%",
                      height: "280px"
                    }}
                    containerClassName="map"
                    regionStyle={{
                      initial: {
                        fill: "#e4e4e4",
                        "fill-opacity": 0.9,
                        stroke: "none",
                        "stroke-width": 0,
                        "stroke-opacity": 0
                      }
                    }}
                    series={{
                      regions: [
                        {
                          values: mapData,
                          scale: ["#AAAAAA", "#444444"],
                          normalizeFunction: "polynomial"
                        }
                      ]
                    }}
                  />
                </CardBody>
                <CardFooter>
                  <div className="stats">
                    <i className="now-ui-icons ui-2_time-alarm" />
                    Last 7 days
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12}>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Best Selling Products</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive className="table-shopping">
                    <thead>
                      <tr>
                        <th className="text-center" />
                        <th>PRODUCT</th>
                        <th>COLOR</th>
                        <th>Size</th>
                        <th className="text-right">PRICE</th>
                        <th className="text-right">QTY</th>
                        <th className="text-right">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="img-container">
                            <img src={jacket} alt="..." />
                          </div>
                        </td>
                        <td className="td-name">
                          <a href="#jacket">Suede Biker Jacket</a>
                          <br />
                          <small>by Saint Laurent</small>
                        </td>
                        <td>Black</td>
                        <td>M</td>
                        <td className="td-number">
                          <small>€</small>3,390
                        </td>
                        <td className="td-number">1</td>
                        <td className="td-number">
                          <small>€</small>549
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="img-container">
                            <img src={shirt} alt="..." />
                          </div>
                        </td>
                        <td className="td-name">
                          <a href="#shirt">Jersey T-Shirt</a>
                          <br />
                          <small>by Balmain</small>
                        </td>
                        <td>Black</td>
                        <td>M</td>
                        <td className="td-number">
                          <small>€</small>499
                        </td>
                        <td className="td-number">2</td>
                        <td className="td-number">
                          <small>€</small>998
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="img-container">
                            <img src={swim} alt="..." />
                          </div>
                        </td>
                        <td className="td-name">
                          <a href="#pants">Slim-Fit Swim Short </a>
                          <br />
                          <small>by Prada</small>
                        </td>
                        <td>Red</td>
                        <td>M</td>
                        <td className="td-number">
                          <small>€</small>200
                        </td>
                        <td className="td-number">3</td>
                        <td className="td-number">
                          <small>€</small>799
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="5" />
                        <td className="td-total">Total</td>
                        <td className="td-price">
                          <small>€</small>2,346
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          */}
        </div>
      </>
    );
  }
}

export default Dashboard;
