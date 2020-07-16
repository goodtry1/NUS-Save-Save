import React, { Component } from 'react'
import { api } from '../../api-config'

// reactstrap components
import {
    Button,
    /*    ButtonGroup, */
    Card,
    CardHeader,
    CardBody,
    /*     CardFooter,
        CardTitle,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
        UncontrolledDropdown,
        Table,
        Progress, */
    Row,
    Col,
    Tooltip
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

// axios
import axios from 'axios';

//models
import { Bank } from '../../models/Bank'

//Notification
import CustomNotification from '../../Notifications/CustomNotification'
import NotificationAlert from "react-notification-alert";

export class AddBanks extends Component {
    constructor(props) {
        super(props);
        this.bankOnClick = this.bankOnClick.bind(this)
        this.state = {
            user: '',
            PDF: '',
            userAccounts: [],
            banks: [],
            banksLoaded: false,
            selectedBank: '',
            selectedBankId: '',
            accountTypes: [],
            selectedAccountType: '',
            selectedAccountTypeId: '',
            message: '',
            accountToolTipState: false
        }
    }

    /**
     * puts the user object from localStorage into the state before page loads
     */
    componentWillMount = () => {
        var user = localStorage.getItem('user')
        this.setState({ user: JSON.parse(user) })
    }

    /**
     * takes the list of banks pushed in from Banks.jsx
     * if the list of banks aren't available, meaning that user refreshes the page, redirect back to Banks.jsx
     * if the list of banks are available, fetch all the banks from the RESTful api and set those banks in the state
     */
    componentDidMount = () => {
        if (!this.props.location.data) {
            this.props.history.push({
                pathname: '/admin/myBanks' // your data array of objects
            })
        } else {
            this.setState({ userAccounts: this.props.location.data })
        }




        /*  setTimeout(() => {
             axios({
                 method: 'post',
                 url: '/userAccountsId',
                 data: {
                     userId: this.state.user.userId
                 }
             }).then((response) => {
                 if (response.status === 200) {
                     console.log(response.data.listOfAccountIds)
                     this.setState({ userAccounts: response.data.listOfAccountIds })
                 }
             }).catch((err) => {
                 console.log(err.message)
             })
         }, 200); */



         axios({
             method: 'get',
             url: `${api}/bankDetails`,
             withCredentials: true,
         }).then((res) => {
            var banks = []

            banks = res.data.banks



            this.setState({ banks: banks })
        })
        .catch((err) => {
        })
        .finally(() => {
            this.getAccountTypes()
        })


      /*   axios.get(`${api}/bankDetails`)
            .then((res) => {
                var banks = []

                banks = res.data.banks



                this.setState({ banks: banks })
            })
            .catch((err) => {
            })
            .finally(() => {
                this.getAccountTypes()
            }) */


    }

    /**
     * gets account types for each of the banks in the list of banks in the state
     */
    getAccountTypes = async () => {

        var transformedBanks = []

        for (var i = 0; i < this.state.banks.length; i++) {

            let fetchedResult = await this.getAccountTypesFromBankId(this.state.banks[i].bankId)
            var accountTypes = []
            accountTypes = fetchedResult.data.account


            let transformedBank = await this.transformBank(this.state.banks[i].bankId, this.state.banks[i].bankName, accountTypes)
            transformedBanks.push(transformedBank)


        }


        this.setState({ banks: transformedBanks })
        this.setState({ banksLoaded: true })

    }

    /**
     * takes in a few parameters and returns a bank object
     * @param {*} bankId - id of the bank
     * @param {*} bankName - name of the bank
     * @param {*} accountTypes - list of account types under this bank 
     */
    transformBank = (bankId, bankName, accountTypes) => {

        var bank = new Bank(bankId, bankName, accountTypes)
        // console.log(bank.bankId + " , " + bank.bankName + " , " + bank.accountTypes[0].accountTypeName)
        return bank
    }

    /**
     * retrieves the account types from RESTful api using bankId
     * returns a promise
     * @param {*} bankId - id of the bank
     */
    getAccountTypesFromBankId = (bankId) => {
        return axios({
            method: 'post',
            url: `${api}/fetchAccountType`,
            withCredentials: true,
            data: {
                bankid: bankId
            }
        }).catch((err) => {
        })
    }

    /**
     * sets the bank a user clicks on in the state, and the account types that corresponds to that bank in the state
     * @param {*} e - event triggering this function
     * @param {*} bank - bank user clicks on
     */
    bankOnClick = (e, bank) => {

        this.setState({ selectedBank: bank })
        this.setState({ selectedBankId: bank.bankId })
        this.setState({ accountTypes: bank.accountTypes })
        this.setState({ selectedAccountType: '' })
        this.setState({ selectedAccountTypeId: '' })

    }

    /**
     * sets the account that the user clicks on
     * @param {*} e - event triggering this function
     * @param {*} account - account user clicks on
     */
    accountTypeOnClick = (e, account) => {
        this.setState({ selectedAccountTypeId: account.accountTypeId })
        this.setState({ selectedAccountType: account })
    }

    /**
     * user clicks "clear" to remove the banks and account types he previously selected
     * @param {*} e - event triggering this function
     */
    clearSelectionOnClick = (e) => {
        this.setState({ selectedBank: '' })
        this.setState({ selectedBankId: '' })
        this.setState({ selectedAccountType: '' })
        this.setState({ selectedAccountTypeId: '' })
        this.setState({ accountTypes: [] })
    }

    /**
     * user clicks on create
     * sends data to RESTful api to create the account under this user
     * @param {*} e - event triggering this function
     */
    createAccountOnClick = (e) => {

        axios({
            method: 'post',
            url: `${api}/addBankAccount`,
            withCredentials: true,
            data: {
                userId: this.state.user.userId,
                accountTypeId: this.state.selectedAccountTypeId,

            }
        }).then(response => {
            if (response.status === 200) {
                this.setState({ message: "Account has been created successfully" })
                this.notify("br", 5)

                setTimeout(() => {
                    this.props.history.push({
                        pathname: '/admin/myBanks',
                        data: '' // your data array of objects
                    })
                }, 2000);

            } else {
                this.setState({ message: "An error has occured, please try again later" })
                this.notify("br", 3)
            }


        })

    }

    /**
     * checks if user has already registered for this bank account
     * @param {*} accountId - bank account Id
     */
    checkAccountExists(accountId) {
        for (var i = 0; i < this.state.userAccounts.length; i++) {

            if (this.state.userAccounts[i].accountTypeId === accountId) {
                return true
            } else {
            }
        }

        return false
    }

    /**
     * toggles the state of the tooltip when it's hovered
     */
    toggleToolTip = () => {
        this.setState({ accountToolTipState: !this.state.accountToolTipState })
    }

    /**
     * notification based on the place and color
     * @param {*} place - place of notification
     * @param {*} color - color of notification
     */
    notify(place, color) {
        this.refs.notificationAlert.notificationAlert(CustomNotification.notify(place, color, this.state.message));
    }

    /**
     * determines whether to renderLoading() or renderAddBanks() based on whether the banks have been loaded
     */
    render() {

        return (
            <div>
                {this.state.banksLoaded ? (this.renderAddBanks()) : (this.renderLoading())}
            </div>
        )

    }

    /**
     * render loading screen
     */
    renderLoading() {
        return (
            <div>
                <center>
                    <button className="btn btn-info btn-sm mb-2" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                            </button>
                </center>
            </div>
        )
    }


    /**
     * render add bank account
     */
    renderAddBanks() {
        return (
            <div>
                <NotificationAlert ref="notificationAlert" />

                <PanelHeader
                    size="sm"
                    content=
                    {<div style={{ textAlign: 'center' }}><h5 style={{ color: 'white' }}>Add a new bank account <i id="info" className="now-ui-icons travel_info" /></h5>
                        <Tooltip placement="right" target="info" isOpen={this.state.accountToolTipState} toggle={this.toggleToolTip}>
                            Add an account in 3 easy steps! Note: accounts that you currently own in Save Save will be disabled.
                        </Tooltip>
                    </div>
                    }
                />

                <Row>
                    <Col xs={12} md={12}>
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Step 1: Choose your bank</h5>
                            </CardHeader>
                            <CardBody>

                                <Row>
                                    {this.state.banks.map((bank) =>


                                        <Col xs={12} md={4} key={bank.bankId} >

                                            <Button style={{ width: '100%' }} onClick={((e) => this.bankOnClick(e, bank))} >{bank.bankName}</Button>

                                        </Col>
                                    )}

                                </Row>




                            </CardBody>

                        </Card>
                    </Col>
                </Row >

                <Row>
                    <Col xs={12} md={12}>
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Step 2: Select account</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    {this.state.accountTypes && this.state.accountTypes.map((account) =>


                                        <Col xs={12} md={4} key={account.accountTypeId} >
                                            <Button id="accountButton" style={accountStyle} onClick={((e) => this.accountTypeOnClick(e, account))} disabled={this.checkAccountExists(account.accountTypeId)}>{account.accountTypeName}</Button>

                                        </Col>
                                    )}

                                </Row>


                            </CardBody>

                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={12}>
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Step 3: Confirm</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs={12} md={4}></Col>


                                    <Col xs={12} md={4}>

                                        <div>
                                            {this.state.selectedBank ? (
                                                <div>
                                                    <Card className="card-chart">

                                                        <CardBody style={{ textAlign: 'center' }}>
                                                            <h3>{this.state.selectedBank.bankName}</h3>
                                                            <h5>{this.state.selectedAccountType.accountTypeName}</h5>


                                                        </CardBody>

                                                    </Card>
                                                </div>

                                            ) : (
                                                    <div></div>
                                                )}
                                        </div>

                                    </Col>

                                    <Col xs={12} md={4}></Col>

                                </Row>






                                {this.state.selectedBank && !this.state.selectedAccountType ? (
                                    <div>
                                        <Row><Col xs={12} md={9}></Col>
                                            <Col xs={12} md={3}>
                                                <Button onClick={this.clearSelectionOnClick} color="danger" className="btn-round">
                                                    Clear Selection
                                                    </Button>

                                            </Col>
                                        </Row>

                                    </div>

                                ) : (
                                        <div></div>
                                    )}


                                {this.state.selectedBank && this.state.selectedAccountType ? (
                                    <div>
                                        <Row><Col xs={12} md={9}></Col>
                                            <Col xs={12} md={3}>
                                                <Button onClick={this.clearSelectionOnClick} color="danger" className="btn-round">
                                                    Clear Selection
                                                    </Button>
                                                <Button color="" className="btn-round" onClick={this.createAccountOnClick}>
                                                    Create
                                                    </Button>
                                            </Col>
                                        </Row>

                                    </div>

                                ) : (
                                        <div></div>
                                    )}












                            </CardBody>

                        </Card>
                    </Col>
                </Row >




            </div >
        )
    }
}

const accountStyle = {

    width: '100%'
}

export default AddBanks
