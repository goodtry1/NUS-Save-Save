import React, { Component } from 'react'
//import { Redirect } from 'react-router-dom';

// reactstrap components
import {
    Button,
    //ButtonGroup,
    Card,
    //CardHeader,
    CardBody,
    //CardFooter,
    // CardTitle,
    //DropdownToggle,
    // DropdownMenu,
    // DropdownItem,
    // UncontrolledDropdown,
    //Table,
    // Progress,
    Row,
    Col
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

//Axios
import axios from 'axios';

export class Banks extends Component {
    constructor(props) {
        super(props);
        this.retrieveUserBanks.bind(this)
        this.state = {
            user: '',
            accounts: [],
            redirectToAddBanks: false
        }
    }

    componentDidMount = () => {
        var user = localStorage.getItem('user')
        this.setState({ user: JSON.parse(user) })

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
                console.log("Successfully loaded user banks")


            } else {
                console.log("Failed to load user banks")
            }
        }).catch((err) => {
            console.log(err.message)
        })
    }

    redirectToBankAccountDetails = (e) => {
        this.props.history.push({
            pathname: '/admin/BankAccountDetails',
            data: '' // your data array of objects
        })
    }

    redirectToAddBanks = () => {
        this.props.history.push({
            pathname: '/admin/addBanks',
            data: '' // your data array of objects
        })

        //this.setState({ redirectToAddBanks: true })
    }
    render() {
        /* if (this.state.redirectToAddBanks) {
            return <Redirect to="/admin/addBanks" />;
        } */
        return (
            <div>
                <PanelHeader
                    size="sm"
                    content={<div style={{ textAlign: 'center' }}><h5 style={{ color: 'white' }}>My Bank Accounts</h5></div>}
                />

                {this.state.accounts.map((account) =>
                    <Row key={account.userBankAccountId} >
                        <Col xs={12} md={12}>
                            <Card className="card-chart">

                                <CardBody>
                                    <Row >
                                    <Col xs={2} ></Col>

                                            <Col xs={8} >
                                               <center><h3>{account.accountTypeName}</h3></center> 
                                            </Col>

                                            <Col xs={2}>
                                                <Button color="info" className="btn-round btn-icon">
                                                    <i className="now-ui-icons ui-1_zoom-bold" />
                                                </Button>

                                                <Button color="danger" className="btn-round btn-icon">
                                                    <i className="now-ui-icons ui-1_simple-remove" />
                                                </Button>
                                            </Col>

                                        











                                    </Row>
                                </CardBody>

                            </Card>
                        </Col>




                    </Row>)}
                <Row>
                    <Col xs={12} md={12}>
                        <Card className="card-chart">

                            <CardBody>
                                <center>
                                    <Button color="alert" onClick={this.redirectToAddBanks} className="btn-round btn-icon">
                                        <i className="now-ui-icons ui-1_simple-add" />
                                    </Button>

                           
                                    <h5>Click here to add bank account</h5>
                                </center>


                            </CardBody>

                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Banks
