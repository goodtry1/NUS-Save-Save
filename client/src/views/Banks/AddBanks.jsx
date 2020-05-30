import React, { Component } from 'react'

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Table,
    Progress,
    Row,
    Col
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

// axios
import axios from 'axios';

//models
import { Bank } from '../../models/Bank'

export class AddBanks extends Component {
    constructor(props) {
        super(props);
        this.bankOnClick = this.bankOnClick.bind(this)
        this.state = {
            email: '',
            PDF: '',
            banks: [],
            selectedBank: '',
            selectedBankId: '',
            accountTypes: [],
            selectedAccountType: '',
            selectedAccountTypeId: '',
            message: ''
        }
    }

    componentDidMount = () => {
        var email = localStorage.getItem('email')
        this.setState({ email: email })

        axios.get('/bankDetails')
            .then((res) => {
                console.log("res.status: " + res.status)
                console.log("Num banks: " + res.data.banks.length)
                var banks = []

                banks = res.data.banks

             

                this.setState({ banks: banks })
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                this.getAccountTypes()
            })


    }

    getAccountTypes = async () => {

        var transformedBanks = []

        for (var i = 0; i < this.state.banks.length; i++) {
            console.log("******Fetching accounts for bankId: " + this.state.banks[i].bankId)
            console.log(this.state.banks[i].bankName)

            let fetchedResult = await this.getAccountTypesFromBankId(this.state.banks[i].bankId)
            var accountTypes = []
            accountTypes = fetchedResult.data.account


            let transformedBank = await this.transformBank(this.state.banks[i].bankId, this.state.banks[i].bankName, accountTypes)
            transformedBanks.push(transformedBank)


            console.log("******Finished fetching accounts for bankId: " + this.state.banks[i].bankId)

        }

        console.log("Banks after processing: " + transformedBanks.length)

        this.setState({ banks: transformedBanks })


    }

    transformBank = (bankId, bankName, accountTypes) => {
        console.log("Transforming bank: " + bankName)

        var bank = new Bank(bankId, bankName, accountTypes)
        // console.log(bank.bankId + " , " + bank.bankName + " , " + bank.accountTypes[0].accountTypeName)
        return bank
    }

    getAccountTypesFromBankId = (bankId) => {
        return axios({
            method: 'post',
            url: '/fetchAccountType',
            data: {
                bankid: bankId
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    bankOnClick = (e) => {

        this.setState({ selectedBankId: e.target.id })
        this.setState({ selectedBank: e.target.name })
        this.setState({ selectedAccountType: '' })
        this.setState({ selectedAccountTypeId: '' })

        this.state.banks.map(bank => {
            if (bank.bankId == this.state.selectedBankId) {
                this.setState({ accountTypes: bank.accountTypes })
            }
        })

    }

    accountTypeOnClick = (e) => {
        this.setState({ selectedAccountTypeId: e.target.id })
        this.setState({ selectedAccountType: e.target.name })
    }


    render() {
        return (
            <div>

                <PanelHeader
                    size="sm"
                    content={<div style={{ textAlign: 'center' }}><h5 style={{ color: 'white' }}>Add a new bank</h5></div>}
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
                                            <Button style={{ width: '100%' }} id={bank.bankId} name={bank.bankName} onClick={this.bankOnClick}>{bank.bankName}</Button>



                                            {/* <Card className="card-chart" value={bank.bankName} onClick={this.bankOnClick} >
                                                <CardBody style={{ textAlign: 'center' }}>{bank.bankName}</CardBody>
                                            </Card> */}
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
                                <h5 className="card-category">Step 2: Select account</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    {this.state.accountTypes.map((account) =>


                                        <Col xs={12} md={4} key={account.accountTypeId} >
                                            <Button style={{ width: '100%' }} id={account.accountTypeId} name={account.accountTypeName} onClick={this.accountTypeOnClick} >{account.accountTypeName}</Button>
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
                                        <Card className="card-chart">

                                            <CardBody style={{ textAlign: 'center' }}>
                                                <h3>{this.state.selectedBank}</h3>
                                                <h5>{this.state.selectedAccountType}</h5>


                                            </CardBody>

                                        </Card>
                                    </Col>

                                    <Col xs={12} md={4}></Col>

                                </Row>

                                <Row>
                                    <Col xs={12} md={10}></Col>

                                    <Col xs={12} md={2}>
                                        <Button color="primary" className="btn-round">
                                            Create
                                        </Button>
                                    </Col>
                                </Row>



                            </CardBody>

                        </Card>
                    </Col>
                </Row>




            </div>
        )
    }
}

export default AddBanks
