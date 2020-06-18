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
  //  DropdownToggle,
  //  DropdownMenu,
  //  DropdownItem,
   // UncontrolledDropdown,
    Table,
   // Progress,
    Row,
    Col,
    FormGroup,
    Input,
    Button,
    //InputGroup
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

//Notification
import CustomNotification from '../../Notifications/CustomNotification'
import NotificationAlert from "react-notification-alert";

//Feedback
import FeedbackPlugin from '../../components/FeedbackPlugin/FeedbackPlugin'

//Animation
import  { Spring } from 'react-spring/renderprops'

//moment

import moment from "moment";
import "moment-timezone"

import ProgressBar from 'react-bootstrap/ProgressBar'

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
        bankAccountDetails : '',
        singleSelect: null,
        singleFileName: "",
        singleFile: null,
        bankStatement: '',
        message: '',
        feedbackDialogOpen: '',
        recommendation: '',
        sessionId: '',
        currentProgress: '',
        maxProgress: ''
    }
}

    askforFeedback = () => {
        this.refs.feedbackPlugin.askforFeedback()
    }

    componentDidMount = () => {
       

       if (this.props.location.data) {
           console.log("Running 1")
            this.setState({ bankAccountDetails : this.props.location.data}, () => {
                /* (() => { this.retrievePreviousRecommendations() })
                (() => { localStorage.setItem("bankAccountDetails", JSON.stringify(this.state.bankAccountDetails)) }) */
                this.retrievePreviousRecommendations()
                
            
          })
       } else {
           var bankAccountDetails = localStorage.getItem("bankAccountDetails")
           this.setState({ bankAccountDetails : JSON.parse(bankAccountDetails)}, () => {
                this.retrievePreviousRecommendations()
           })
       }

       
        
        
    }

    retrievePreviousRecommendations = () => {
        this.setState({ currentProgress : 0 })
        this.setState({ maxProgress : 0 })

        console.log("Sending post request: " + this.state.bankAccountDetails.userId + " " + this.state.bankAccountDetails.accountTypeId)
        localStorage.setItem("bankAccountDetails", JSON.stringify(this.state.bankAccountDetails))

        axios({
            method: 'post',
            url: '/fetchrecommendations',
            data: {
                userId: this.state.bankAccountDetails.userId,
                accountTypeid: this.state.bankAccountDetails.accountTypeId
            }
        }).then((response) => {
            if (response.status === 200) {
                console.log("Retrieved response")
                var recommendation = response.data.recommendation

                if (recommendation.length > 0) {
                    this.setState({ recommendation })
                    this.setState({ sessionId : recommendation[0].parsedRecordId})

                    var maxInterest = 0
                    var currentInterest = 0

                    for (var i = 0; i < recommendation.length; i++) {
                        maxInterest += recommendation[i].interestEarned
                        maxInterest += recommendation[i].interestToBeEarned
                        currentInterest += recommendation[i].interestEarned

                       
                        
                        
                        this.setState({ currentProgress :(Math.round(currentInterest * 100)/100).toFixed(2)})
                        this.setState({ maxProgress : (Math.round(maxInterest * 100)/100).toFixed(2)})
                    }

                    console.log(currentInterest + "/" + maxInterest)

                    


                   /*  var sRecommendation = (recommendation[Object.keys(recommendation)[0]])
                    this.setState({recommendation: sRecommendation.split(',')}) */
                    this.askforFeedback()
                } else {
                    this.setState({ recommendation : null})
                }
               

            } else {
                
            }
        }).catch((err) => {
            console.log(err.message)
        })
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
          console.log("Number of files:" + e.target.files.length)
          fileNames = fileNames + e.target.files[i].name;
          console.log(fileNames)

            if (fileNames.split('.').pop() !== 'pdf') {
                console.log("Not PDF")
                e.target.value = null;
                this.setState({
                    message : 'The file you\'ve uploaded is not a PDF file',
                    [type + "Name"]: '',
                    bankStatement : '',
                    fileNames: '',
                    singleFile: null
                }, () => {this.notify('br', 4) })
                PDFtype = false;

                /* setTimeout(() => {
                    this.notify('br', 4)
                  }, 200); */

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

        e.target.value = null //clear upload DOM
       
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
            formData.append('userId', this.state.bankAccountDetails.userId);
            formData.append('accountTypeId', this.state.bankAccountDetails.accountTypeId);

           
            console.log(formData)

            this.setState({bankStatement : ''})
            this.setState({singleFileName : ''})

            axios.post('/uploadBankStatement', formData)
            .then(res => {
                console.log("Response status: " + res.status)
               

                if (res.status === 200) {
                    this.setState({message : 'Your bank statement has been uploaded successfully'})
                    this.notify('br', 5)
                    this.setState({recommendation : ''})
                    this.retrievePreviousRecommendations()
                } else {
                    
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

                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>
                            <Card className="card-stats card-raised">
                                <CardBody>
                                    <Row>
                                        <Col md="9">
                                            <div className="intro">
                                                <div className="info">

                                                    <p className="">You are viewing</p>
                                                    <h5 className="info-title">{this.state.bankAccountDetails.accountTypeName}</h5>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md="3">
                                            <div className="intro">
                                                <div className="info">


                                                   <p className="">Created since: </p>
                                                   <h5><moment format="DD/MM/YYYY" parse="YYYY-MM-DD">{this.state.bankAccountDetails.date}</moment></h5>
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
                                    <ProgressBar animated now={this.state.currentProgress} max={this.state.maxProgress} label={'S$' + this.state.currentProgress + " / S$" + this.state.maxProgress} />
                                    {/* <h6>Place holder for progress bar</h6> */}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                    <Row sm={12}>
                        <Col sm={6} >
                            <Card className="">
                                <CardHeader>
                                    <h5 className="card-category"></h5>
                                    <CardTitle tag="h2" >Recommendations</CardTitle>
                                   
                  

                                </CardHeader>
                                <CardBody>

                                    
                                    {this.state.recommendation != null? (
                                    
                                       this.state.recommendation ?
                                       <div>

                                            {this.state.recommendation.map((recommendation) => 
                                            <Table responsive className="table-shopping">

                                            <Spring
                                                from={{ opacity : 0, marginTop: 500}}
                                                to={{ opacity : 1, marginTop : 0}}
                                            >
                                                {props => (
                                                    <div style={props}>
                                                    
                                                     <tr key={recommendation.recommendationId} >
                                                         
                                                        <td >
                                                            {recommendation.isRecommCompleted ? 
                                                            (<Button color="success" className="btn-round btn-icon">
                                                            <i className="now-ui-icons ui-1_check" />
                                                            </Button>) 
                                                            : 
                                                            (<Button color="" className="btn-round btn-icon" >
                                                            <i className="now-ui-icons ui-1_simple-remove" />
                                                            </Button>)
                                                            }
                                                        </td>
                                                        <td >
                                                            {recommendation.recommendation}
                                                        </td>
                                                    </tr>
                                                    
                                                    </div>
                                                )}
                                                


                                            </Spring>
                                           
                                            </Table>

                                           )}
                                       </div>  : 
                                       
                                       <div>
                                           <center>
                                           <button className="btn btn-info btn-sm mb-2" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                            </button>
                                            </center>
                                        </div>
                                   
                                    ) : (
                                    <div>
                                          <center>No recommendations available, please upload your bank statement</center>  
                                    </div>
                                    )}
                                   
                                  
                                </CardBody>
                                <CardFooter>
                                    {this.state.recommendation != null ? (
                                        
                                        this.state.recommendation? 
                                        
                                        <div>
                                             <div className="stats">
                                        <i className="now-ui-icons arrows-1_refresh-69" />

                                        
                                        {moment(this.state.recommendation[0].timeStamp)
                                        .tz("Singapore")
                                        .format('YYYY-MM-DD HH:mm:ss')}
                                        
                                     
                                        {/* Generated on: <Moment format="DD/MM/YYYY HH:MM" parse="YYYY-MM-DD">{this.state.recommendation[0].timeStamp}</Moment> */}

                                        </div>

                                        </div> : 
                                        
                                        <div>

                                        </div>
                                        
                                       
                                    ) : (<div></div>)}
                                    
                                </CardFooter>
                            </Card>
                        </Col>

                        <Col sm={6} >
                            <Card className="card-chart">
                                <CardHeader>
                                    <h5 className="card-category"></h5>
                                    
                                    <CardTitle tag="h4">Upload bank statement</CardTitle>
                                    
                                   
                  

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
                                        <i className="now-ui-icons emoticons_satisfied" />
                                        We do not keep a copy of your bank statements
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>

                   
                   
                   
                </div>

                {this.state.recommendation != null && this.state.recommendation? (
                    <FeedbackPlugin ref="feedbackPlugin" sessionId = {this.state.sessionId}>

                    </FeedbackPlugin>
                ) : (<div></div>)}
                
            </>
        );
    }
}

export default BankAccountDetails;
