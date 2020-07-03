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
    Progress,
    Row,
    Col,
    FormGroup,
    Input,
    Button,
    //InputGroup,
    Form,
    Label
} from "reactstrap";

import Chart from './Chart'

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

import {
    dashboardPanelChart,
    //dashboardActiveUsersChart,
    //dashboardSummerChart,
    //dashboardActiveCountriesCard
} from "variables/charts.jsx";

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
import { Spring } from 'react-spring/renderprops'

//moment
import Moment from 'react-moment'
import moment from "moment";
import "moment-timezone"

// react plugin used to create datetimepicker
import Datetime from "react-datetime";

import ProgressBar from 'react-bootstrap/ProgressBar'

//PDFDetails model
import { PDFDetails } from '../../models/PDFDetails'



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

            singleSelect: null,
            singleFileName: "",
            singleFile: null,
            bankStatement: '',
            ccSelect: null,
            ccFileName: "",
            ccFile: null,
            ccStatement: '',

            message: '',
            feedbackDialogOpen: '',
            recommendation: '',
            sessionId: '',
            currentProgress: '',
            maxProgress: '',
            percentage: 0,

            showPdfDetails: false,
            PdfDetails: {
                previousMonthBalance: 0,
                startDate: '',
                endDate: '',
                salary: 0,
                currentMonthBalance: 0,
                creditCardSpend: 0,
                averageDailyBalance: 0,
                wealth: 0
            },

            userInputPdfDetails: {
                previousMonthBalance: '',
                startDate: '',
                endDate: '',
                salary: '',
                currentMonthBalance: '',
                creditCardSpend: '',
                averageDailyBalance: '',
                wealth: ''
            },

            chart: {
                data: '',
                options: ''
            }


        }
    }

    askforFeedback = () => {
        this.refs.feedbackPlugin.askforFeedback()
    }

    closeFeedback = () => {
        this.refs.feedbackPlugin.closeFeedback()
    }

    componentDidMount = () => {


        if (this.props.location.data) {
            this.setState({ bankAccountDetails: this.props.location.data }, () => {
                /* (() => { this.retrievePreviousRecommendations() })
                (() => { localStorage.setItem("bankAccountDetails", JSON.stringify(this.state.bankAccountDetails)) }) */
                this.retrievePreviousRecommendations()


            })
        } else {
            var bankAccountDetails = localStorage.getItem("bankAccountDetails")
            this.setState({ bankAccountDetails: JSON.parse(bankAccountDetails) }, () => {
                this.retrievePreviousRecommendations()
            })
        }




    }

    retrievePreviousRecommendations = () => {
        this.setState({ currentProgress: 0 })
        this.setState({ maxProgress: 0 })

        localStorage.setItem("bankAccountDetails", JSON.stringify(this.state.bankAccountDetails))

        axios({
            method: 'post',
            url: `${api}/fetchrecommendations`,
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

    singleFile = React.createRef();
    ccStatement = React.createRef();

    notify(place, color) {
        this.refs.notificationAlert.notificationAlert(CustomNotification.notify(place, color, this.state.message));
    }

    handleFileInput = (e, type) => {
        this[type].current.click(e);
    };


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
            }
        }

        e.target.value = null //clear upload DOM

    };

    clearBankStatement = () => {
        this.setState(
            {
                bankStatement: '',
                singleFileName: ''
            }
        )
    }

    clearCCStatement = () => {
        this.setState(
            {
                ccStatement: '',
                ccFileName: ''
            }
        )
    }

    uploadBankStatement = () => {

        if (!this.state.bankStatement) {
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
            formData.append('bankStatement', this.state.bankStatement);
            formData.append('userId', this.state.bankAccountDetails.userId);
            formData.append('accountTypeId', this.state.bankAccountDetails.accountTypeId);
            formData.append('creditCard', this.state.ccStatement)


            this.setState({ bankStatement: '' })
            this.setState({ singleFileName: '' })
            this.setState({ ccStatement: '' })
            this.setState({ ccFileName: '' })

            axios.post(`${api}/uploadBankStatement`, formData)
                .then(res => {


                    if (res.status === 200) {
                        let parsedDate = res.data.parsedData.date.split("TO")
                        var startDate = parsedDate[0].trim()
                        var endDate = parsedDate[1].trim()


                        var d1 = new moment(startDate)
                        var d2 = new moment(endDate)

                        console.log(d1)
                        console.log(d2)

                        let userInputPdfDetails = this.state.userInputPdfDetails
                        userInputPdfDetails.startDate = d1
                        userInputPdfDetails.endDate = d2
                        this.setState({ userInputPdfDetails })




                        let PdfDetails = new PDFDetails(res.data.parsedData.previousMonthBalance,
                            res.data.parsedData.currentMonthBalance,
                            res.data.parsedData.averageDailyBalance,
                            d1,
                            d2,
                            res.data.parsedData.salary,
                            res.data.parsedData.creditCardSpend)

                        this.setState({ PdfDetails: PdfDetails })
                        this.setState({ message: 'Your bank statement has been uploaded successfully' }, () => {
                            setTimeout(() => {
                                this.setState({ showPdfDetails: true })
                            }, 2000);


                        })
                        this.notify('br', 5)
                        //this.setState({ recommendation: '' })
                        this.closeFeedback()
                        //this.retrievePreviousRecommendations()
                    } else {
                        this.setState({ message: "Unknown error has occured. Please try again later", renderLoading: false }, () => { this.notify('br', 3) })
                    }
                })
                .catch(err => {
                    this.setState({ message: err.message, renderLoading: false }, () => { this.notify('br', 3) })
                })
        }
    }


    colSizeBankUpload = () => {
        if (this.state.bankStatement) {
            return 9
        } else {
            return 12
        }
    }

    colSizeCCUpload = () => {
        if (this.state.ccStatement) {
            return 9
        } else {
            return 12
        }
    }

    handleUserInputOnPdfDetails = (event) => {
        console.log(event.target)


        var userInputPdfDetails = this.state.userInputPdfDetails



        userInputPdfDetails[event.target.name] = event.target.value

        this.setState({
            userInputPdfDetails
        }, () => { console.log(this.state.userInputPdfDetails) })
    }

    handleDateTime = (moment, name) => {

        var canUpdate = true

        if (name === "startDate") {
            var startDate = moment.valueOf()
            var endDate = this.state.userInputPdfDetails.endDate



            

            if (startDate > endDate) {
                canUpdate = false
                this.setState({ message: "Start date cannot be later than end date!" }, () => { this.notify('br', 4) })
            }
        } else {

            var endDate = moment.valueOf()
            var startDate = this.state.userInputPdfDetails.startDate



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
            }, () => { console.log(this.state.userInputPdfDetails) })
        }




    }

    checkPDFDetailsSubmit = (event) => {
        event.preventDefault();


        var PdfDetails = this.state.PdfDetails
        var userInputPdfDetails = this.state.userInputPdfDetails


        Object.keys(userInputPdfDetails).forEach(function (key) {
            console.log(userInputPdfDetails[key])
            if (userInputPdfDetails[key] === "") {
                if (!PdfDetails[key] || PdfDetails[key] === "") {
                    userInputPdfDetails[key] = 0
                } else {
                    userInputPdfDetails[key] = PdfDetails[key]
                }

            }


        })

        /* Processing Date */
        var d1 = userInputPdfDetails.startDate.toString().split(" ")
        userInputPdfDetails.startDate = d1[2] + " " + d1[1] + " " + d1[3]

        var d2 = userInputPdfDetails.endDate.toString().split(" ")
        userInputPdfDetails.endDate = d2[2] + " " + d2[1] + " " + d2[3]


        var statementDate = userInputPdfDetails.startDate + " TO " + userInputPdfDetails.endDate
        userInputPdfDetails.date = statementDate

        console.log(userInputPdfDetails)




        axios({
            method: 'post',
            url: `${api}/updateParsedData`,
            data: {
                userId: this.state.bankAccountDetails.userId,
                accountTypeId: this.state.bankAccountDetails.accountTypeId,
                parsedData: userInputPdfDetails
            }
        }).then((res) => {
            this.setState({ message: "Your financial statements have been verified!" },
                () => {
                    this.notify('br', 5)
                    setTimeout(() => {
                        this.setState({ showPdfDetails: false })
                    }, 2000);
                    setTimeout(() => {
                        this.retrievePreviousRecommendations()
                    }, 4000);
                })
        }).catch((err) => {
            this.setState({ message: err.message },
                () => { this.notify('br', 3) })

        })
    }

    checkPDFDetailsCancel = () => {
        this.setState({ showPdfDetails: false })
    }

    //Render form to let user submit what the PDF parser parsed
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
                                <Row>
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
                                </Row>


                                <Row>
                                    <Col md="9" sm="6">
                                    </Col>

                                    <Col md="3" sm="6">
                                        <Button onClick={this.checkPDFDetailsCancel} > Cancel</Button>
                                        <Button > Submit</Button>
                                    </Col>

                                </Row>





                            </Form>
                        </CardBody>
                        <CardFooter>
                            <div className="stats">
                                <i className="now-ui-icons emoticons_satisfied" />
                                Help us improve our recommendation engine by verifying the fields below
                            </div>
                        </CardFooter>

                    </Card>

                </Col>
            </>
        )
    }

    //Render recommendations and card to upload financial statements
    renderNormal = () => {
        return (
            <>
                <Row>

                    <Col md={12}>
                        <Card className="card-pricing ">
                            <CardHeader>

                                {"Your progress towards the max tier: " + 'S$' + this.state.currentProgress + " / S$" + this.state.maxProgress}

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
                <Row sm={12}>
                    <Col sm={6} >
                        <Card className="card-stats">
                            <CardHeader>
                                <h5 className="card-category"></h5>
                                <CardTitle tag="h2" >Recommendations</CardTitle>



                            </CardHeader>
                            <CardBody>


                                {this.state.recommendation != null ? (

                                    this.state.recommendation ?
                                        <div>

                                            {this.state.recommendation.map((recommendation) =>
                                                <Table responsive className="table-shopping">
                                                    <tbody>
                                                        <Spring
                                                            from={{ opacity: 0, marginTop: 500 }}
                                                            to={{ opacity: 1, marginTop: 0 }}
                                                        >
                                                            {props => (
                                                                <div style={props}>

                                                                    <tr key={recommendation.recommendationId} >

                                                                        <td >
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
                                                                        </td>

                                                                        <td>

                                                                            <div>
                                                                                {recommendation.recommendation}
                                                                            </div>

                                                                        </td>
                                                                    </tr>

                                                                </div>
                                                            )}



                                                        </Spring>
                                                    </tbody>

                                                </Table>

                                            )}
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
                                                    .format('DD-MM-YYYY HH:mm:ss')}


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

                                <CardTitle tag="h4">Upload financial statements</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row >
                                    <Col sm='12'>
                                        <h5>Bank statement</h5>
                                    </Col>

                                    <Col xs={this.colSizeBankUpload()}>
                                        <FormGroup className="form-file-upload form-file-simple">
                                            <Input
                                                type="text"
                                                className="inputFileVisible"
                                                placeholder="Bank statement is mandatory"
                                                onClick={e => this.handleFileInput(e, "singleFile")}
                                                defaultValue={this.state.singleFileName}
                                            />
                                            <input
                                                type="file"
                                                accept='.pdf'
                                                className="inputFileHidden"
                                                /*  style={{ zIndex: -1 }} */
                                                ref={this.singleFile}
                                                onChange={e => this.addFile(e, "singleFile", "bankStatement")}
                                            />
                                        </FormGroup>


                                    </Col>

                                    {this.state.bankStatement ? (
                                        <div>

                                            <Col xs="3">
                                                <Button onClick={this.clearBankStatement} color="danger" className="btn-round btn-icon" style={{ display: 'block,', margin: 'auto' }}>
                                                    <i className="fa fa-times" />
                                                </Button>
                                            </Col>
                                        </div>
                                    ) : (<div></div>)}





                                    <Col sm='12'>
                                        <h5>Credit card statement</h5>
                                    </Col>

                                    <Col xs={this.colSizeCCUpload()}>

                                        <FormGroup className="form-file-upload form-file-simple">
                                            <Input
                                                type="text"
                                                className="inputFileVisible"
                                                placeholder="Supplement your credit card statement"
                                                onClick={e => this.handleFileInput(e, "ccStatement")}
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
                                    ) : (<div></div>)}


                                </Row>





                                <div>
                                    {this.state.bankStatement ?
                                        (


                                            <Button onClick={this.uploadBankStatement}> Submit</Button>


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
                                    .format('DD-MM-YYYY')}
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

                    {/* <Row>
                        <Col md={12}>
                            <Card className="card-chart">
                                <CardHeader>
                                    Place holder for chart title
                                    
                                </CardHeader>
                                <CardBody>
                                <PanelHeader
                                    size="lg"
                                    content={
                                        <Line
                                        data={Chart.data}
                                        options={Chart.options}
                                        />
                                    }
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row> */}





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
