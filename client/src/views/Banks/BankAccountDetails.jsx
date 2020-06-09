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
//import { Line } from "react-chartjs-2";
// react plugin for creating vector maps
//import { VectorMap } from "react-jvectormap";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
  /*   DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Table,
    Progress, */
    Row,
    Col,
    FormGroup,
    Input,
    Button,
    InputGroup
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

/* import {
    dashboardPanelChart,
    dashboardActiveUsersChart,
    dashboardSummerChart,
    dashboardActiveCountriesCard
} from "variables/charts.jsx"; */

/* import jacket from "assets/img/saint-laurent.jpg";
import shirt from "assets/img/balmain.jpg";
import swim from "assets/img/prada.jpg"; */

import { table_data } from "variables/general.jsx";

import axios from 'axios'

import CustomNotification from '../../Notifications/CustomNotification'
import NotificationAlert from "react-notification-alert";

//Feedback
import FeedbackPlugin from '../../components/FeedbackPlugin/FeedbackPlugin'


/* var mapData = {
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
}; */

class BankAccountDetails extends React.Component {
    constructor(props) {
        super(props);
    this.state = {
        user : '',
        account : '',
        singleSelect: null,
        singleFileName: "",
        singleFile: null,
        bankStatement: '',
        message: '',
        feedbackDialogOpen: ''
    }
}

    singleFile = React.createRef();

    notify(place, color) {
        this.refs.notificationAlert.notificationAlert(CustomNotification.notify(place, color, this.state.message));
      }

    handleFileInput = (e, type) => {
        this[type].current.click(e);
    };

    addFile = (e, type) => {
        let fileNames = "";
        let files = e.target.files;

        var PDFtype = true;

        for (let i = 0; i < e.target.files.length; i++) {
          fileNames = fileNames + e.target.files[i].name;

            if (fileNames.split('.').pop() !== 'pdf') {
               
                this.setState({
                    message : 'The file you\'ve uploaded is not a PDF file',
                    [type + "Name"]: '',
                    bankStatement : ''
                })
                PDFtype = false;

                setTimeout(() => {
                    this.notify('br', 4)
                  }, 200);

                  break;
            } 

          if (type === "multipleFile" && i !== e.target.files.length - 1) {
            fileNames = fileNames + ", ";
          }
        }

        if (PDFtype) {
            this.setState({
                [type + "Name"]: fileNames,
                bankStatement : files[0]
              });
        }
       
      };

    clearBankStatement = () => {
        this.setState(
            {
                bankStatement : '',
                singleFileName : ''
            }
        )
    }

    uploadBankStatement = () => {
        if (!this.state.bankStatement) {
            console.log("Bank Statement empty")
            /* this.setState(
                {
                    message : 'You have not uploaded a bank statement'
                },

                function() {
                   this.notify('br', 4)
                }
                   
                ) */
            
        } else {
            const formData = new FormData();
            formData.append('file', this.state.bankStatement);
            formData.append('userId', 3/* this.state.accountTypeId */);
            formData.append('accountTypeId', 2/* this.state.accountTypeId */);

            this.setState({bankStatement : ''})
            this.setState({singleFileName : ''})

            axios.post('/uploadBankStatement', formData)
            .then(res => {
                console.log("Response status: " + res.status)
               

                if (res.status === 200) {
                    this.setState({message : 'Your bank statement has been uploaded successfully'})
                    this.notify('br', 5)
                    FeedbackPlugin.askForFeedBack()
                } else {
                    FeedbackPlugin.askForFeedBack()
                }
            })
            .catch(err => console.log(err))
        }
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
        return (
            <>
                <NotificationAlert ref="notificationAlert" />
                <PanelHeader
                    size="sm" >
                <Row >
                <Col sm='9'>
                
                </Col>

                <Col sm='3'>
               
                </Col>
                </Row>
                   


                </PanelHeader>


                {/** 
            content={
              <Line
                data={dashboardPanelChart.data}
                options={dashboardPanelChart.options}
              }
          */}

                <div className="">
                    <Row>
                        <Col xs={12} md={12}>
                            <Card className="card-stats card-raised">
                                <CardBody>
                                    <Row>
                                        <Col md="9">
                                            <div className="intro">
                                                <div className="info">

                                                    <h2 className="info-title">Welcome back,</h2>
                                                    <p className="info-title">$user</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="intro">
                                                <div className="info">


                                                    <p className="info-title">Member since:</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Card className="card-chart">
                                <CardHeader>
                                    Place holder for chart title
                                    
                                </CardHeader>
                                <CardBody>
                                    <h6>Place holder for chart</h6>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Card className="card-chart">
                                <CardHeader>
                                    Your progress towards the max tier
                                    
                                </CardHeader>
                                <CardBody>
                                    <h6>Place holder for progress bar</h6>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                    <Row sm={12}>
                        <Col sm={6} >
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category"></h5>
                                    <CardTitle tag="h2" >Recommendations</CardTitle>
                                   
                  

                                </CardHeader>
                                <CardBody>
                                   1. Recommendation 1 <br/>
                                   2. Recommendation 2 <br/>
                                   3. Recommendation 3 <br/>
                                  
                                </CardBody>
                                <CardFooter>
                                    <div className="stats">
                                        <i className="now-ui-icons arrows-1_refresh-69" />
                                        Generated on: placeholder for recommendation date
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>

                        <Col sm={6} >
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category"></h5>
                                    <CardTitle tag="h2"> Upload bank statement </CardTitle>
                                   
                  

                                </CardHeader>
                                <CardBody>
                                <FormGroup className="form-file-upload form-file-simple">
                                    <Input
                                    type="text"
                                    className="inputFileVisible"
                                    placeholder="We accept PDF versions only..."
                                    onClick={e => this.handleFileInput(e, "singleFile")}
                                    defaultValue={this.state.singleFileName}
                                    />
                                    <input
                                    type="file"
                                    accept='.pdf'
                                    className="inputFileHidden"
                                    style={{ zIndex: -1 }}
                                    ref={this.singleFile}
                                    onChange={e => this.addFile(e, "singleFile")}
                                    />
                                    

                                </FormGroup>

                                <div>
                                    {this.state.bankStatement ? 
                                    (<div><Button onClick={this.uploadBankStatement}> Submit</Button>
                                        <Button onClick={this.clearBankStatement}> Clear </Button></div>) : (<div></div>) }

                                </div>
                                
                                  
                                </CardBody>
                                <CardFooter>
                                    <div className="stats">
                                        <i className="now-ui-icons arrows-1_refresh-69" />
                                        We do not keep a copy of your bank statements
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>

                   
                   
                   
                </div>
                <FeedbackPlugin></FeedbackPlugin>
            </>
        );
    }
}

export default BankAccountDetails;
