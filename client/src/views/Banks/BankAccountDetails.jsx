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
import { Line } from "react-chartjs-2";
// react plugin for creating vector maps
//import { VectorMap } from "react-jvectormap";

import { api } from '../../api-config'
import cookie from 'react-cookies'

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
    //Progress,
    Row,
    Col,
    FormGroup,
    Input,
    Button,
    //InputGroup,
    Form,
    //Label
    Tooltip
} from "reactstrap";

//import Chart from './Chart'

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

import {
    //dashboardPanelChart,
    //dashboardActiveUsersChart,
    //dashboardSummerChart,
    //dashboardActiveCountriesCard
} from "variables/charts.jsx";

/* import jacket from "assets/img/saint-laurent.jpg";
import shirt from "assets/img/balmain.jpg";
import swim from "assets/img/prada.jpg"; */

//import { table_data } from "variables/general.jsx";

import axios from 'axios'

//Notification
import CustomNotification from '../../Notifications/CustomNotification'
import NotificationAlert from "react-notification-alert";

//Feedback
import FeedbackPlugin from '../../components/FeedbackPlugin/FeedbackPlugin'

//Animation
import { Spring } from 'react-spring/renderprops'

//moment
import moment from "moment";
import "moment-timezone"

// react plugin used to create datetimepicker
import Datetime from "react-datetime";

import ProgressBar from 'react-bootstrap/ProgressBar'

//PDFDetails model
//import { PDFDetails } from '../../models/PDFDetails'



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
            user: '',
            bankAccountDetails: '',
            bankStatementRenderLoading: false,
            bankStatementVerificationLoading: false,
            infoState: false, //tooltip
            verifyInfoState: false, //tooltip

            /**
             * file upload states for bank statement, credit card and transaction history
             */
            singleSelect: null,
            singleFileName: "",
            singleFile: null,
            bankStatement: '',
            ccSelect: null,
            ccFileName: "",
            ccFile: null,
            ccStatement: '',
            /* transactionSelect: null, */
            transactionHistoryFileName: "",
            transactionHistory: "",


            message: '',
            feedbackDialogOpen: '',
            recommendation: '',
            sessionId: '',
            currentProgress: '',
            maxProgress: '',
            percentage: 0,

            
            showPdfDetails: false,

            //placeholder object for parsed data, the attributes will be increased in the functions
            PdfDetails: {
                startDate: '',
                endDate: ''
            },

            //placeholder object for user input data, the attributes will be increased in the functions
            userInputPdfDetails: {
                startDate: '',
                endDate: ''
            },
            /* {
                previousMonthBalance: '',
                startDate: '',
                endDate: '',
                salary: '',
                currentMonthBalance: '',
                creditCardSpend: '',
                averageDailyBalance: '',
                wealth: 0
            } */

            //settings for chart
            chartDetails : {
                label: [],
                interestEarned: [],
                interestToBeEarned: []
            },

            chart : {

                data: canvas => {
                    const ctx = canvas.getContext("2d");
                    var chartColor = "#FFFFFF";
                    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
                    gradientStroke.addColorStop(0, "#80b6f4");
                    gradientStroke.addColorStop(1, chartColor);
                    var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
                    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
                    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.14)");
                    
                  return {
                    labels: this.state.chartDetails.label,
                    datasets: [
                      {
                        label: "Interest earned (S$)",
                        borderColor: chartColor,
                        pointBorderColor: chartColor,
                        pointBackgroundColor: "#2c2c2c",
                        pointHoverBackgroundColor: "#2c2c2c",
                        pointHoverBorderColor: chartColor,
                        pointBorderWidth: 1,
                        pointHoverRadius: 7,
                        pointHoverBorderWidth: 2,
                        pointRadius: 5,
                        fill: true,
                        backgroundColor: gradientFill,
                        borderWidth: 2,
                        data: this.state.chartDetails.interestEarned
                      }, 
                      {
                        label: "Additional interest you could have earned (S$)",
                        borderColor: "#00ff00",
                        pointBorderColor: "#00ff00",
                        pointBackgroundColor: "#2c2c2c",
                        pointHoverBackgroundColor: "#2c2c2c",
                        pointHoverBorderColor: "#00ff00",
                        pointBorderWidth: 1,
                        pointHoverRadius: 7,
                        pointHoverBorderWidth: 2,
                        pointRadius: 5,
                        fill: true,
                        backgroundColor: gradientFill,
                        borderWidth: 2,
                        data: this.state.chartDetails.interestToBeEarned
                      } 
                    ]
                  };
                },
                options: {
                  backgroundColor: "#ffffff",
                  title: {
                    display: true,
                    text: "Your bank account's performance",
                    fontSize: "24",
                    fontColor: "#ffffff"
                  },
                  layout: {
                    padding: {
                      left: 40,
                      right: 40,
                      top: 0,
                      bottom: 0
                    }
                  },
                  maintainAspectRatio: false,
                  tooltips: {
                    backgroundColor: "#ffffff",
                    titleFontColor: "#333",
                    bodyFontColor: "#666",
                    bodySpacing: 4,
                    xPadding: 12,
                    mode: "nearest",
                    intersect: 0,
                    position: "nearest"
                  },
                  legend: {
                    position: "top",
                    fillStyle: "#FFF",
                    display: true
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          fontColor: "rgba(255,255,255,0.4)",
                          fontStyle: "bold",
                          beginAtZero: false,
                          maxTicksLimit: 5,
                          padding: 10
                        },
                        gridLines: {
                          drawTicks: true,
                          drawBorder: false,
                          display: true,
                          color: "rgba(255,255,255,0.1)",
                          zeroLineColor: "transparent"
                        }
                      }
                    ],
                    xAxes: [
                      {
                        gridLines: {
                          display: false,
                          color: "rgba(255,255,255,0.1)"
                        },
                        ticks: {
                          padding: 10,
                          fontColor: "rgba(255,255,255,0.4)",
                          fontStyle: "bold"
                        }
                      }
                    ]
                  }
                }
              }


        }
    }

    /**
     * triggers askForFeedback() function in FeedbackPlugin.jsx
     */
    askforFeedback = () => {
        this.refs.feedbackPlugin.askforFeedback()
    }

    /**
     * triggers closeFeedBack() function in FeedbackPlugin.jsx
     */
    closeFeedback = () => {
        this.refs.feedbackPlugin.closeFeedback()
    }

    /**
     * when page loads, 2 scenarios happen
     * 1. user came from Dashboard.jsx or Banks.jsx and the specific bank account is pushed from there. The bank account will be set onto the state
     * 2. use refreshes the page, the bank specific bank account is fetched from the localStorage
     * it will proceed to retrieve previous recommendations and chart information
     */
    componentDidMount = () => {
       

        if (this.props.location.data) {
            this.setState({ bankAccountDetails: this.props.location.data}, () => {
                /* (() => { this.retrievePreviousRecommendations() })
                (() => { localStorage.setItem("bankAccountDetails", JSON.stringify(this.state.bankAccountDetails)) }) */
                this.retrievePreviousRecommendations()
                this.retrieveChartDetails()

            })
        } else {
            var bankAccountDetails = localStorage.getItem("bankAccountDetails")
            this.setState({ bankAccountDetails: JSON.parse(bankAccountDetails)}, () => {
                this.retrievePreviousRecommendations()
                this.retrieveChartDetails()
            })
        }




    }

    /**
     * retrieves the chart information of a user bank account
     */
    retrieveChartDetails = () => {
        axios({
            method: 'post',
            url: `${api}/getParametersForGraph`,
            withCredentials: true,
            data: {
                userId: this.state.bankAccountDetails.userId,
                accountTypeid: this.state.bankAccountDetails.accountTypeId
            }
        }).then((response) => {
            var recordSet = response.data.recordset

            var label = []
            var interestEarned = []
            var interestToBeEarned = []

            var month = ["", "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December" ];

            

            for (var i = 0; i < recordSet.length; i++) {
                
            label.push(month[recordSet[i].MONTHYEAR])
            interestEarned.push(recordSet[i].INTERESTEARNED)
            interestToBeEarned.push(recordSet[i].INTERESTTOBEEARNED)

            }

            var chartDetails = {
                label,
                interestEarned,
                interestToBeEarned
            }

            this.setState({
                chartDetails
            })
        })
    }

    /**
     * retrieves latest recommendations of a user bank account
     * the percentage for the current tier and max tier is calculated here
     */
    retrievePreviousRecommendations = () => {
        this.setState({ currentProgress: 0 })
        this.setState({ maxProgress: 0 })

        localStorage.setItem("bankAccountDetails", JSON.stringify(this.state.bankAccountDetails))

        axios({
            method: 'post',
            url: `${api}/fetchrecommendations`,
            withCredentials: true,
            data: {
                userId: this.state.bankAccountDetails.userId,
                accountTypeid: this.state.bankAccountDetails.accountTypeId
            }
        }).then((response) => {
            if (response.status === 200) {
                var recommendation = response.data.recommendation

                if (recommendation.length > 0) {
                    this.setState({ recommendation })
                    this.setState({ sessionId: recommendation[0].parsedRecordId })

                    var maxInterest = 0
                    var currentInterest = 0

                    for (var i = 0; i < recommendation.length; i++) {
                        maxInterest += recommendation[i].interestEarned
                        maxInterest += recommendation[i].interestToBeEarned
                        currentInterest += recommendation[i].interestEarned




                        this.setState({ currentProgress: (Math.round(currentInterest * 100) / 100).toFixed(2) })
                        this.setState({ maxProgress: (Math.round(maxInterest * 100) / 100).toFixed(2) })

                        this.setState({ percentage: (Math.round(currentInterest / maxInterest * 100)).toFixed(0) })
                    }





                    /*  var sRecommendation = (recommendation[Object.keys(recommendation)[0]])
                     this.setState({recommendation: sRecommendation.split(',')}) */
                    this.askforFeedback()
                } else {
                    this.setState({ recommendation: null })
                }


            } else {

            }
        }).catch((err) => {

        })
    }

    

    /**
     * 
     * @param {*} place - place to notify
     * @param {*} color - color of notification
     */
    notify(place, color) {
        this.refs.notificationAlert.notificationAlert(CustomNotification.notify(place, color, this.state.message));
    }

    /**
     * creates references for the 3 input file upload
     * these are necessary to hide the input file upload button, and to let the custom upload button reference this
     */
    singleFile = React.createRef();
    ccStatement = React.createRef();
    transactionHistory = React.createRef();

    /**
     * clicks on the element based on the type
     * the type is either singleFile, ccStatement, or transactionHistory reference created earlier on
     * @param {*} e - event triggering this function
     * @param {*} type - referencing element
     */
    handleFileInput = (e, type) => {
        this[type].current.click(e);
    };

    /**
     * checks if the file uploaded is a PDF and sets it onto the state
     * @param {*} e - event triggering this function
     * @param {*} type - the file type set by the input upload element
     * @param {*} id - id of the element
     */
    addFile = (e, type, id) => {

        let fileNames = "";
        let files = e.target.files;


        var PDFtype = true;

        for (let i = 0; i < e.target.files.length; i++) {
            fileNames = fileNames + e.target.files[i].name;

            if (fileNames.split('.').pop() !== 'pdf') {
                e.target.value = null;
                PDFtype = false;


                if (id === "bankStatement") {
                    this.setState(
                        {
                            message: 'The file you\'ve uploaded is not a PDF file',
                            bankStatement: '',
                            singleFileName: ''
                        }, () => { this.notify('br', 4) }
                    )
                } else if (id === "ccStatement") {
                    this.setState(
                        {
                            message: 'The file you\'ve uploaded is not a PDF file',
                            ccStatement: '',
                            ccFileName: ''
                        }, () => { this.notify('br', 4) }
                    )
                } else if (id === "transactionHistory") {
                    this.setState(
                        {
                            message: 'The file you\'ve uploaded is not a PDF file',
                            transactionHistory: '',
                            transactionHistoryFileName: ''
                        }, () => { this.notify('br', 4) }
                    )
                }





                /* this.setState({
                    message : 'The file you\'ve uploaded is not a PDF file',
                    [type + "Name"]: '',
                    bankStatement : '',
                    fileNames: '',
                    singleFile: null
                }, () => {this.notify('br', 4) })
                PDFtype = false; */


                break;
            }



            if (type === "multipleFile" && i !== e.target.files.length - 1) {
                fileNames = fileNames + ", ";
            }
        }

        if (PDFtype) {
            if (id === "bankStatement") {
                this.setState({
                    [type + "Name"]: fileNames,
                    bankStatement: files[0]
                });
            } else if (id === "ccStatement") {
                this.setState({
                    ccFileName: fileNames,
                    ccStatement: files[0]
                });
            } else if (id === "transactionHistory") {
                this.setState({
                    transactionHistoryFileName: fileNames,
                    transactionHistory: files[0]
                });
            }
        }

        e.target.value = null //clear upload DOM

    };

    /**
     * removes the bank statement from the state
     */
    clearBankStatement = () => {
        this.setState(
            {
                bankStatement: '',
                singleFileName: ''
            }
        )
    }

    /**
     * removes the transaction history from the state
     */
    cleartTransactionHistory = () => {
        this.setState(
            {
                transactionHistory: '',
                transactionHistoryFileName: ''
            }
         )
    }

    /**
     * removes the credit card statement from the state
     */
    clearCCStatement = () => {
        this.setState(
            {
                ccStatement: '',
                ccFileName: ''
            }
        )
    }

    /**
     * user clicks on submit
     * sends form data to RESTful api and transforms parsedData dynamically into fields for user to verify
     */
    uploadBankStatement = () => {

       
            this.setState({bankStatementRenderLoading : true})



            const formData = new FormData();
            formData.append('bankStatement', this.state.bankStatement);
            formData.append('userId', this.state.bankAccountDetails.userId);
            formData.append('accountTypeId', this.state.bankAccountDetails.accountTypeId);
            formData.append('creditCard', this.state.ccStatement)
            formData.append('transactionHistory', this.state.transactionHistory)


            /* this.setState({ bankStatement: '' })
            this.setState({ singleFileName: '' })
            this.setState({ ccStatement: '' })
            this.setState({ ccFileName: '' }) */

            axios({
                method: 'post',
                url: `${api}/uploadBankStatement`,
                withCredentials: true,
                data: formData,

            }).then(res => {
                this.setState({
                    bankStatementRenderLoading: false,
                    bankStatement: '',
                    singleFileName: '',
                    ccStatement: '',
                    ccFileName: '',
                    transactionHistory: '',
                    transactionHistoryFileName: ''
                })


                if (res.status === 200) {


                    /* Retrieve all the attributes required from the parsedData object */
                    let parsedData = res.data.parsedData
                    let PdfDetails = this.state.PdfDetails
                    let userInputPdfDetails = this.state.userInputPdfDetails

                    Object.keys(parsedData).forEach(function (key) {
                        
                    if (key === 'date') {

                    } else {

                        PdfDetails[key] = parsedData[key]
                        userInputPdfDetails[key] = ''  
                       
                    }

                      
                                
                    })




                    var d1 = new moment()
                    var d2 = new moment()

                    try {
                        var startDate = ''
                        var endDate = ''

                        let parsedDate = res.data.parsedData.date.split("TO")
                        startDate = parsedDate[0].trim()
                        endDate = parsedDate[1].trim()
    
    
                        d1 = new moment(startDate)
                        d2 = new moment(endDate)
                    } catch (err) {
                        
                    }
                    

                    
                    PdfDetails.startDate = d1
                    PdfDetails.endDate = d2
                    this.setState({ PdfDetails }, () => {
                       
                    })
                    
                    userInputPdfDetails.startDate = d1
                    userInputPdfDetails.endDate = d2
                    this.setState({ userInputPdfDetails })

                    


                   /*  let PdfDetails = new PDFDetails(res.data.parsedData.previousMonthBalance,
                        res.data.parsedData.currentMonthBalance,
                        res.data.parsedData.averageDailyBalance,
                        d1,
                        d2,
                        res.data.parsedData.salary,
                        res.data.parsedData.creditCardSpend? res.data.parsedData.creditCardSpend: 0) */

                    
                    this.setState({ /* PdfDetails ,userInputPdfDetails , */message: 'Your bank statement has been uploaded successfully' }, () => {
                        setTimeout(() => {
                            
                            this.setState({ showPdfDetails: true })
                           
                            try {
                                this.closeFeedback()
                            } catch (err) {

                            }
                            
                        }, 2000);


                    })
                    this.notify('br', 5)
                    //this.setState({ recommendation: '' })
                    
                    
                    //this.retrievePreviousRecommendations()
                } else {
                    this.setState({ message: "Unknown error has occured. Please try again later", bankStatementRenderLoading: false }, () => { this.notify('br', 3) })
                }
            })
            .catch(err => {
                this.setState({ message: err.message, bankStatementRenderLoading: false }, () => { this.notify('br', 3) })
            })

            
        }
    
    /**
     * sets the state of userInputPdfDetails whenever they type an input
     * @param {*} event - event triggering this function
     */
    handleUserInputOnPdfDetails = (event) => {
       


        var userInputPdfDetails = this.state.userInputPdfDetails



        userInputPdfDetails[event.target.name] = event.target.value

        this.setState({
            userInputPdfDetails
        })
    }

    /**
     * special event handler to take care of user input dates
     * @param {*} moment - date retrieved from calendar element
     * @param {*} name - name of the element
     */
    handleDateTime = (moment, name) => {

        var canUpdate = true

        if (name === "startDate") {
            const startDate = moment.valueOf()
            const endDate = this.state.userInputPdfDetails.endDate



            

            if (startDate > endDate) {
                canUpdate = false
                this.setState({ message: "Start date cannot be later than end date!" }, () => { this.notify('br', 4) })
            }
        } else {

            const endDate = moment.valueOf()
            const startDate = this.state.userInputPdfDetails.startDate



            if (startDate > endDate) {
                canUpdate = false
                this.setState({ message: "End date must be later than start date!" }, () => { this.notify('br', 4) })
            }
        }

        if (canUpdate) {
            var userInputPdfDetails = this.state.userInputPdfDetails
            userInputPdfDetails[name] = moment

            this.setState({
                userInputPdfDetails
            })
        }




    }

    /**
     * submits the data after user verification via RESTful api
     * @param {*} event - event triggering this function
     */
    checkPDFDetailsSubmit = (event) => {
        event.preventDefault();

        
        this.setState({bankStatementVerificationLoading: true})

        var PdfDetails = this.state.PdfDetails
        var userInputPdfDetails = this.state.userInputPdfDetails

        //temp adding creditCardSpend attribute to avoid 'undefined' error from server
        /* PdfDetails.creditCardSpend = 0
        userInputPdfDetails.creditCardSpend = 0 */

        Object.keys(userInputPdfDetails).forEach(function (key) {
           
            if (userInputPdfDetails[key] === "") {
                if (!PdfDetails[key] || PdfDetails[key] === "") {
                    userInputPdfDetails[key] = 0
                } else {
                    userInputPdfDetails[key] = PdfDetails[key]
                }

            }


        })

        var d1 = "";
        var d2 = "";
        var d3 = "";
        var d4 = "";

        //Formatting moment into a string so it can be inserted into DB
        try {
            d1 = userInputPdfDetails.startDate.toString().split(" ")
            userInputPdfDetails.startDate = d1[2] + " " + d1[1] + " " + d1[3]
    
            d2 = userInputPdfDetails.endDate.toString().split(" ")
            userInputPdfDetails.endDate = d2[2] + " " + d2[1] + " " + d2[3]
        } catch (err) {
           
        }

        try {
            PdfDetails = this.state.PdfDetails

            d3 = PdfDetails.startDate.toString().split(" ")
            PdfDetails.startDate = d3[2] + " " + d3[1] + " " + d3[3]
    
            d4 = PdfDetails.endDate.toString().split(" ")
            PdfDetails.endDate = d4[2] + " " + d4[1] + " " + d4[3]

            this.setState({ PdfDetails })
        } catch (err) {
           
        }

        



        axios({
            method: 'post',
            url: `${api}/updateParsedData`,
            withCredentials: true,
            data: {
                userId: this.state.bankAccountDetails.userId,
                accountTypeId: this.state.bankAccountDetails.accountTypeId,
                parsedData: this.state.PdfDetails,
                userInput: userInputPdfDetails
            }
        }).then((res) => {
            this.setState({ message: "Your financial statements have been verified!" },
                () => {
                    
                    this.notify('br', 5)
                    setTimeout(() => {
                        this.setState({ showPdfDetails: false, bankStatementVerificationLoading: false })
                    }, 2000);
                    setTimeout(() => {
                        this.retrievePreviousRecommendations()
                        this.retrieveChartDetails()
                    }, 4000);
                })
        }).catch((err) => {
            this.setState({ message: err.message, bankStatementVerificationLoading: false },
                () => { this.notify('br', 3) })

        })
    }

    /**
     * user closes the verification page
     */
    checkPDFDetailsCancel = () => {
        this.setState({ showPdfDetails: false })
    }

    /**
     * changes state when user toggles tooltip
     * this tooltip is at "Upload financial statements"
     */
    toggleToolTip = () => {
        this.setState({ infoState: !this.state.infoState })
    }

    /**
     * changes syaye when user toggles tooltip
     * this tooltip is at "Verification"
     */
    toggleVerifyInfoToolTip = () => {
        this.setState({ verifyInfoState: !this.state.verifyInfoState})
    }

    /**
     * I got this regex from stackoverflow to transform the variable name to cap each first letter 
     * and a space in between each word from camelCase
     * @param {*} string - input string
     */
    formatString = (string) => {
        var result = string                         
            .replace(/([a-z])([A-Z][a-z])/g, "$1 $2")           
            .replace(/([A-Z][a-z])([A-Z])/g, "$1 $2")           
            .replace(/([a-z])([A-Z]+[a-z])/g, "$1 $2")          
            .replace(/([A-Z]+)([A-Z][a-z][a-z])/g, "$1 $2")     
            .replace(/([a-z]+)([A-Z0-9]+)/g, "$1 $2")           
            
            // Note: the next regex includes a special case to exclude plurals of acronyms, e.g. "ABCs"
            .replace(/([A-Z]+)([A-Z][a-rt-z][a-z]*)/g, "$1 $2") 
            .replace(/([0-9])([A-Z][a-z]+)/g, "$1 $2")           

            // Note: the next two regexes use {2,} instead of + to add space on phrases like Room26A and 26ABCs but not on phrases like R2D2 and C3PO"
            .replace(/([A-Z]{2,})([0-9]{2,})/g, "$1 $2")        
            .replace(/([0-9]{2,})([A-Z]{2,})/g, "$1 $2")        
            .trim();


        // capitalize the first letter
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    
   
    /**
     * Render form to let user submit what the PDF parser parsed
     */
    renderCheckPDFDetails = () => {
        return (
            <>
                {/* <Row>

                    <Col md={12}>
                        <Card className="card-pricing card-plain ">
                            <CardHeader>
                                Help us improve our recommendation engine by verifying the fields below

                            </CardHeader>

                        </Card>
                    </Col>

                </Row> */}
                <Col sm={12} >
                    <Card className="card-chart">
                        <CardHeader>
                            <center>
                                <CardTitle tag="h4">Here's what we got from the statements you submitted</CardTitle>
                            </center>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={this.checkPDFDetailsSubmit} >
                            <Table responsive style={{overflow: 'auto'}}>
                                <thead className="text-primary">
                                    
                                    <tr>
                                        
                                        <th sm="3">
                                            Variables
                                        </th>

                                        <th sm="3">
                                            Extracted Values
                                        </th>

                                        <th sm="3">
                                        
                                            Verification

                                            <i id="verification" className="now-ui-icons travel_info" />
                                        </th>
                                            <Tooltip placement="right" target="verification" isOpen={this.state.verifyInfoState} toggle={this.toggleVerifyInfoToolTip}>
                                                You may input the correct information for each of the variables if the extracted information is inaccurate
                                            </Tooltip>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr>
                                        <td>
                                            Start Date
                                        </td>

                                        <td>
                                            {moment(this.state.PdfDetails.startDate)
                                                        .tz("Singapore")
                                                        .format('DD/MM/YYYY')}
                                        </td>

                                        <td>
                                            <Col sm="6">
                                            
                                                <Datetime
                                                        inputProps={{
                                                            placeholder: moment(this.state.PdfDetails.startDate)
                                                                .tz("Singapore")
                                                                .format('DD/MM/YYYY')
                                                        }}
                                                        dateFormat="DD/MM/YYYY"
                                                        timeFormat={false}


                                                        value={moment(this.state.userInputPdfDetails.startDate)
                                                            .tz("Singapore")
                                                            .format('DD/MM/YYYY')}
                                                        onChange={moment => this.handleDateTime(moment, 'startDate')}
                                                    />
                                            
                                            </Col>
                                        </td>
                                        
                                        </tr>

                                        <tr>
                                        <td>
                                            End Date
                                        </td>

                                        <td>
                                            {moment(this.state.PdfDetails.endDate)
                                                        .tz("Singapore")
                                                        .format('DD/MM/YYYY')}
                                        </td>

                                        <td>
                                            <Col sm="6">
                                                <Datetime
                                                        inputProps={{
                                                            placeholder: moment(this.state.PdfDetails.endDate)
                                                                .tz("Singapore")
                                                                .format('DD/MM/YYYY')
                                                        }}
                                                        dateFormat="DD/MM/YYYY"
                                                        timeFormat={false}


                                                        value={moment(this.state.userInputPdfDetails.endDate)
                                                            .tz("Singapore")
                                                            .format('DD/MM/YYYY')}
                                                        onChange={moment => this.handleDateTime(moment, 'endDate')}
                                                    />
                                            </Col>
                                        </td>
                                    </tr>

                                        {this.state.PdfDetails && Object.keys(this.state.PdfDetails).map((key) => (
                                            key !== 'startDate' && key !== 'endDate'? 
                                            (
                                                <tr key={key}>
                                                    <td>
                                                        {this.formatString(key)}
                                                    </td>

                                                    <td>
                                                        {this.state.PdfDetails[key]}
                                                    </td>

                                                    <td>
                                                        <Col sm="6">
                                                            <Input
                                                                    name={key}
                                                                    type="number"
                                                                    min="0.00"
                                                                    max="1000000"
                                                                    step="100"
                                                                    placeholder={this.state.PdfDetails[key]}
                                                                    onChange={this.handleUserInputOnPdfDetails}
                                                                    width=""
                                                                />
                                                        </Col>
                                                    </td>
                                                </tr>
                                            ) : (React.Fragment)
                                            
                                        ))}
                                    
                                      
                                   
                                   

                                    

                                    
                                    

                                   {/*  <tr>
                                        <td>
                                            This month's current balance         
                                        </td>

                                        <td>
                                            {this.state.PdfDetails.currentMonthBalance}
                                        </td>

                                        <td>
                                            <Col sm="6">
                                                <Input
                                                        name="currentMonthBalance"
                                                        type="number"
                                                        min="0.00"
                                                        max="1000000"
                                                        step="100"
                                                        placeholder={this.state.PdfDetails.currentMonthBalance}
                                                        onChange={this.handleUserInputOnPdfDetails}
                                                        width=""
                                                    />
                                            </Col>
                                        </td>

                                    </tr>

                                    <tr>
                                        <td>
                                            Previous month's Balance         
                                        </td>

                                        <td>
                                            {this.state.PdfDetails.previousMonthBalance}
                                        </td>

                                        <td>
                                            <Col sm="6">
                                                <Input
                                                    name="previousMonthBalance"
                                                    type="number"
                                                    min="0.00"
                                                    max="1000000"
                                                    step="100"
                                                    placeholder={this.state.PdfDetails.previousMonthBalance}
                                                    onChange={this.handleUserInputOnPdfDetails}
                                                />
                                            </Col>
                                        </td>

                                    </tr>

                                    <tr>
                                        <td>
                                            Salary credited         
                                        </td>

                                        <td>
                                            {this.state.PdfDetails.salary}
                                        </td>

                                        <td>
                                            <Col sm="6">
                                                <Input
                                                    name="salary"
                                                    type="number"
                                                    min="0.00"
                                                    max="1000000"
                                                    step="100"
                                                    placeholder={this.state.PdfDetails.salary}
                                                    onChange={this.handleUserInputOnPdfDetails}
                                                />
                                            </Col>
                                        </td>

                                    </tr>

                                    <tr>
                                        <td>
                                            Average daily balance         
                                        </td>

                                        <td>
                                            {this.state.PdfDetails.averageDailyBalance}
                                        </td>

                                        <td>
                                            <Col sm="6">
                                                <Input
                                                    name="averageDailyBalance"
                                                    type="number"
                                                    min="0.00"
                                                    max="1000000"
                                                    step="100"
                                                    placeholder={this.state.PdfDetails.averageDailyBalance}
                                                    onChange={this.handleUserInputOnPdfDetails}
                                                />
                                            </Col>
                                        </td>

                                    </tr>

                                    <tr>
                                        <td>
                                            Credit card spending         
                                        </td>

                                        <td>
                                            {this.state.PdfDetails.creditCardSpend}
                                        </td>

                                        <td>
                                            <Col sm="6">
                                                <Input
                                                    name="creditCardSpend"
                                                    type="number"
                                                    min="0.00"
                                                    max="1000000"
                                                    step="100"
                                                    placeholder={this.state.PdfDetails.creditCardSpend}
                                                    onChange={this.handleUserInputOnPdfDetails}
                                                />
                                            </Col>
                                        </td>

                                    </tr> */}
                                   
                                </tbody>

                            </Table>

                               {/*  <Row>
                                    <Col sm="3">
                                    </Col>

                                    <Col sm="3">
                                        <label>Start Date</label>
                                        <FormGroup>
                                            <Datetime
                                                inputProps={{
                                                    placeholder: moment(this.state.PdfDetails.startDate)
                                                        .tz("Singapore")
                                                        .format('DD/MM/YYYY')
                                                }}
                                                dateFormat="DD/MM/YYYY"
                                                timeFormat={false}


                                                value={moment(this.state.userInputPdfDetails.startDate)
                                                    .tz("Singapore")
                                                    .format('DD/MM/YYYY')}
                                                onChange={moment => this.handleDateTime(moment, 'startDate')}
                                            />
                                        </FormGroup>


                                    </Col>



                                    <Col sm="3">
                                        <label>End Date</label>
                                        <FormGroup>
                                            <Datetime
                                                inputProps={{
                                                    placeholder: moment(this.state.PdfDetails.endDate)
                                                        .tz("Singapore")
                                                        .format('DD/MM/YYYY')
                                                }}

                                                value={moment(this.state.userInputPdfDetails.endDate)
                                                    .tz("Singapore")
                                                    .format('DD/MM/YYYY')}
                                                dateFormat="DD/MM/YYYY"
                                                timeFormat={false}
                                                onChange={moment => this.handleDateTime(moment, 'endDate')}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm="3">
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm="4">
                                        <label>This month's current balance</label>
                                        <FormGroup>
                                            <Input
                                                name="currentMonthBalance"
                                                type="number"
                                                min="0.00"
                                                max="1000000"
                                                step="100"
                                                placeholder={this.state.PdfDetails.currentMonthBalance}
                                                onChange={this.handleUserInputOnPdfDetails}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm="4">
                                        <label>Previous month's Balance</label>
                                        <FormGroup>
                                            <Input
                                                name="previousMonthBalance"
                                                type="number"
                                                min="0.00"
                                                max="1000000"
                                                step="100"
                                                placeholder={this.state.PdfDetails.previousMonthBalance}
                                                onChange={this.handleUserInputOnPdfDetails}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm="4">
                                        <label>Salary credited</label>
                                        <FormGroup>
                                            <Input
                                                name="salary"
                                                type="number"
                                                min="0.00"
                                                max="1000000"
                                                step="100"
                                                placeholder={this.state.PdfDetails.salary}
                                                onChange={this.handleUserInputOnPdfDetails}
                                            />
                                        </FormGroup>
                                    </Col>


                                </Row>

                                <Row>
                                    <Col sm="2">

                                    </Col>

                                    <Col sm="4">
                                        <label>Average daily balance</label>
                                        <FormGroup>
                                            <Input
                                                name="averageDailyBalance"
                                                type="number"
                                                min="0.00"
                                                max="1000000"
                                                step="100"
                                                placeholder={this.state.PdfDetails.averageDailyBalance}
                                                onChange={this.handleUserInputOnPdfDetails}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm="4">
                                        <label>Credit card spending</label>
                                        <FormGroup>
                                            <Input
                                                name="creditCardSpend"
                                                type="number"
                                                min="0.00"
                                                max="1000000"
                                                step="100"
                                                placeholder={this.state.PdfDetails.creditCardSpend}
                                                onChange={this.handleUserInputOnPdfDetails}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col sm="2">

                                    </Col>
                                </Row> */}

                            
                                {this.state.bankStatementVerificationLoading? 
                                (
                                    <div>
                                        <Row>
                                            <Col md="10">
                                            
                                            </Col>

                                            <Col md="2">
                                                <Button 
                                                        
                                                    color="primary"
                                                    size="md"
                                                    className="mb-3 btn-round"
                                                    disabled
                                                    > <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </Button>

                                            </Col>

                                            
                                        
                                        </Row>

                                    </div>
                                ) : (
                                    <div>
                                            <Row >
                                            <Col md="9" sm="6">
                                            </Col>

                                    

                                            <Col md="3" sm="6" >
                                                <Button 
                                                        
                                                        color=""
                                                        size="md"
                                                        className="mb-3 btn-round"
                                                        onClick={this.checkPDFDetailsCancel} 
                                                    > Cancel
                                                    </Button>
                                                    

                                                <Button 
                                                        
                                                        color="primary"
                                                        size="md"
                                                        className="mb-3 btn-round"
                                                    > Submit
                                                </Button>
                                            </Col>

                                        </Row>
                                    </div>
                                )}

                               





                            </Form>
                        </CardBody>
                        <CardFooter>
                            <div className="stats">
                                <i className="now-ui-icons emoticons_satisfied" />
                                Help us improve our recommendation engine by verifying the fields above
                            </div>
                        </CardFooter>

                    </Card>

                </Col>
            </>
        )
    }

    /**
     * Render recommendations and card to upload financial statements
     */
    renderNormal = () => {
        return (
            <>
                    
                    <Row>

                    <Col md={12}>
                        <Card className="card-pricing ">
                            <CardHeader>

                                {"Your progress towards the max tier: S$" + this.state.currentProgress + " / S$" + this.state.maxProgress}

                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs='3'>

                                    </Col>

                                    <Col>

                                        <ProgressBar style={{ backgroundColor: 'grey', borderColor: 'black' }} animated now={this.state.percentage} max={100} label={this.state.percentage + '%'} />
                                    </Col>

                                    <Col xs='3'>

                                    </Col>

                                </Row>


                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                
                {this.state.chartDetails.label.length > 0 ? (<Row>
                            <Col md={12}>
                                <Card className="card-chart card-plain" >
                                    <CardHeader>
                                       
                                        
                                    </CardHeader>
                                    <CardBody>
                                    <PanelHeader
                                        size="lg"
                                        content={
                                            <Line
                                            data={this.state.chart.data}
                                            options={this.state.chart.options}
                                            />
                                        }
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                    </Row>) : (<div></div>)}

                
                <Row sm={12}>
                    <Col sm={6} >
                        <Card className="card-stats">
                            <CardHeader>
                                {/* <h5 className="card-category"></h5> */}
                                <CardTitle tag="h2" >Recommendations</CardTitle>



                            </CardHeader>
                            <CardBody>


                                {this.state.recommendation != null ? (

                                    this.state.recommendation ?
                                        <div>

                                            
                                                <Table responsive className="table-shopping" /* key={recommendation.recommendationId} */>
                                                     
                                                    <tbody>
                                                       
                                                    {this.state.recommendation.map((recommendation) =>
                                                                    <tr key={recommendation.recommendationId} >
                                                                        
                                                                        <td >
                                                                        <Spring
                                                            from={{ opacity: 0, marginTop: 500 }}
                                                            to={{ opacity: 1, marginTop: 0 }}
                                                        >
                                                            {props => (
                                                                <div style={props}>
                                                                            {recommendation.isRecommCompleted ?
                                                                                (
                                                                                    <div className="info info-horizontal">
                                                                                        <div className="icon icon-success icon-circle">
                                                                                            <i className="fa fa-check" />
                                                                                        </div>
                                                                                    </div>


                                                                                )
                                                                                :
                                                                                (

                                                                                    <div className="info info-horizontal">
                                                                                        <div className="icon icon-danger icon-circle">
                                                                                            <i className="fa fa-exclamation" />
                                                                                        </div>
                                                                                    </div>

                                                                                )
                                                                            }
                                                                             </div>
                                                                             )}
                                                                             </Spring>
                                                                        </td>
                                                                       

                                                                        <td>

                                                                            <div>
                                                                                {recommendation.recommendation}
                                                                            </div>
                                                                           

                                                                        </td>
                                                                    </tr>

                                                               
                                                            



                                                            )}
                                                    </tbody>

                                                </Table>

                                            
                                        </div> :

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

                                    this.state.recommendation ?

                                        <div>
                                            <div className="stats">
                                                <i className="now-ui-icons arrows-1_refresh-69" />

                                                {"Generated on: "}
                                                {moment(this.state.recommendation[0].timeStamp)
                                                    .tz("Singapore")
                                                    .format('DD-MMMM-YYYY HH:mm:ss')}


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
                                {/* <h5 className="card-category"></h5> */}

                                

                                <CardTitle tag="h4">Upload financial statements<i id="info" className="now-ui-icons travel_info" />
                                <Tooltip placement="right" target="info" isOpen={this.state.infoState} toggle={this.toggleToolTip}>
                                    You must either upload your bank statement or transaction history, but your credit card statement is optional
                                </Tooltip></CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row >

                                    
                                    <Col sm='12'>
                                        <h5>Bank statement</h5>
                                    </Col>

                                    <Col xs="10">
                                        <FormGroup className="">
                                            <Input
                                                type="text"
                                                className="inputFileVisible"
                                                placeholder="Bank statement is mandatory"
                                                /* onClick={e => this.handleFileInput(e, "singleFile")} */
                                                defaultValue={this.state.singleFileName}
                                            />

                                            <input
                                                type="file"
                                                accept='.pdf'
                                                className="inputFileHidden"
                                                style={{ zIndex: -1 }}
                                                ref={this.singleFile}
                                                onChange={e => this.addFile(e, "singleFile", "bankStatement")}
                                            />
                                            
                                        </FormGroup>


                                    </Col>

                                    {this.state.bankStatement ? (
                                        <div>

                                            <Col xs="2">
                                                <Button onClick={this.clearBankStatement} color="danger" className="btn-round btn-icon" style={{ display: 'block,', margin: 'auto' }}>
                                                    <i className="fa fa-times" />
                                                </Button>
                                            </Col>
                                        </div>
                                    ) : (
                                    <div>
                                        <Col xs="2">
                                            <Button onClick={e => this.handleFileInput(e, "singleFile")} color="info" className="btn-round btn-icon" style={{ display: 'block,', margin: 'auto' }}>
                                            <i className="fa fa-upload" />
                                            </Button>
                                        </Col>
                                    </div>)}


                                    <Col sm='12'>
                                        <h5>Transaction history</h5>
                                    </Col>

                                    <Col xs="10">

                                        <FormGroup className="form-file-upload form-file-simple">
                                            <Input
                                                type="text"
                                                className="inputFileVisible"
                                                placeholder="Transaction history is mandatory"
                                                /* onClick={e => this.handleFileInput(e, "transactionHistory")} */
                                                defaultValue={this.state.transactionHistoryFileName}
                                            />
                                            <input
                                                type="file"
                                                accept='.pdf'
                                                className="inputFileHidden"
                                                style={{ zIndex: -1 }}
                                                ref={this.transactionHistory}
                                                onChange={e => this.addFile(e, "transactionHistory", "transactionHistory")}
                                            />


                                        </FormGroup>

                                    </Col>

                                    {this.state.transactionHistory ? (
                                        <div>

                                            <Col xs="2">
                                                <Button onClick={this.cleartTransactionHistory} color="danger" className="btn-round btn-icon" style={{ display: 'block,', margin: 'auto' }}>
                                                    <i className="fa fa-times" />
                                                </Button>
                                            </Col>
                                        </div>
                                    ) : (
                                        <div>
                                            <Col xs="2">
                                                <Button onClick={e => this.handleFileInput(e, "transactionHistory")} color="info" className="btn-round btn-icon" style={{ display: 'block,', margin: 'auto' }}>
                                                <i className="fa fa-upload" />
                                                </Button>
                                            </Col>
                                        </div>
                                    )}


                                    <Col sm='12'>
                                        <h5>Credit card statement</h5>
                                    </Col>

                                    <Col xs="10">

                                        <FormGroup className="form-file-upload form-file-simple">
                                            <Input
                                                type="text"
                                                className="inputFileVisible"
                                                placeholder="Credit card statement is optional"
                                                /* onClick={e => this.handleFileInput(e, "ccStatement")} */
                                                defaultValue={this.state.ccFileName}
                                            />
                                            <input
                                                type="file"
                                                accept='.pdf'
                                                className="inputFileHidden"
                                                style={{ zIndex: -1 }}
                                                ref={this.ccStatement}
                                                onChange={e => this.addFile(e, "ccStatement", "ccStatement")}
                                            />


                                        </FormGroup>

                                    </Col>

                                    {this.state.ccStatement ? (
                                        <div>

                                            <Col xs="3">
                                                <Button onClick={this.clearCCStatement} color="danger" className="btn-round btn-icon" style={{ display: 'block,', margin: 'auto' }}>
                                                    <i className="fa fa-times" />
                                                </Button>
                                            </Col>
                                        </div>
                                    ) : (
                                        <div>
                                            <div>
                                                <Col xs="2">
                                                    <Button onClick={e => this.handleFileInput(e, "ccStatement")} color="info" className="btn-round btn-icon" style={{ display: 'block,', margin: 'auto' }}>
                                                    <i className="fa fa-upload" />
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                        )}


                                </Row>





                                <div>
                                    {this.state.bankStatement || this.state.transactionHistory ?
                                        (

                                    this.state.bankStatementRenderLoading?
                                    (<div>
                                        <Row sm="12">
                                            <Col sm="4">
                                                <Button color="primary"  
                                                disabled size="md" 
                                                className="mb-3 btn-round"
                                                >
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                                </Button>
                                            </Col>
                                        </Row>
                                      </div>) : 
                                    (<div>
                                        <Row sm="12">
                                        <Col sm="4">
                                            <Button
                                            type="submit"
                                            color="primary"
                                            size="md"
                                            className="mb-3 btn-round"
                                            onClick={this.uploadBankStatement}
                                            >
                                                Submit
                                            
                                            </Button>
                                        </Col>
                                    </Row>
                                    </div>) 
                            

                                        ) : (<div></div>)}

                                </div>


                            </CardBody>
                            <CardFooter>
                                <div className="stats">
                                    <i className="now-ui-icons emoticons_satisfied" />
                                        We only accept PDF versions
                                    </div>
                            </CardFooter>
                        </Card>
                    </Col>



                </Row>

                


            </>
        )
    }






    /**
     * determines whether to renderNormal() or renderCheckPDFDetails() based on what the user clicks
     */
    render() {
        return (
            <>
                <NotificationAlert ref="notificationAlert" />
                <PanelHeader
                    content={
                        <div className="header text-center">
                            <h2 className="title">{this.state.bankAccountDetails.accountTypeName}</h2>
                            <p className="category">
                                Created since: {moment(this.state.bankAccountDetails.date)
                                    .tz("Singapore")
                                    .format('DD-MMMM-YYYY')}
                            </p>
                        </div>
                    }>





                </PanelHeader>


                {/** 
            content={
              <Line
                data={dashboardPanelChart.data}
                options={dashboardPanelChart.options}
              }
          */}

                <div className="content">
                    {/*  <Row>
                        <Col xs={3} md={3}></Col>
                        <Col xs={6} md={6}>
                            <Card className="card-stats card-raised">
                                <CardBody>
                                    <Row>
                                        <Col xs="6" md="6">
                                            <div className="intro">
                                                <div className="info">

                                                    <p className="">You are viewing</p>
                                                    <h5 className="info-title">{this.state.bankAccountDetails.accountTypeName}</h5>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs="6" md="6">
                                            <div className="intro">
                                                <div className="info">


                                                    <p className="">Created since: </p>
                                                    <h5>
                                                        {moment(this.state.bankAccountDetails.date)
                                                            .tz("Singapore")
                                                            .format('DD-MM-YYYY')}
                                                    </h5>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row> */}



                    {this.state.showPdfDetails ? (this.renderCheckPDFDetails()) : (this.renderNormal())}

                    





                </div>

                {this.state.recommendation != null && this.state.recommendation ? (
                    <FeedbackPlugin ref="feedbackPlugin" sessionId={this.state.sessionId} recommendation={this.state.recommendation}>

                    </FeedbackPlugin>
                ) : (<div></div>)}



            </>
        );
    }
}

export default BankAccountDetails;
