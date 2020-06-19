import React, { Component } from "react";

// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Form,
    Input,
    FormGroup
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

import CustomNotification from '../../Notifications/CustomNotification'
import NotificationAlert from "react-notification-alert";

import Switch from "react-bootstrap-switch";

//Axios
import axios from 'axios';

//Animation
import { Spring } from 'react-spring/renderprops'



import { User } from '../../models/User'

export class MyProfile extends Component {
    constructor(props) {
        super(props);
        //this.retrieveUserBanks.bind(this)
        this.state = {
            user: '',
            updatedUser: '',
            hideEdit: '',
            hideChangePw: '',
            oldPw: '',
            newPw: '',
            retypeNewPw: '',
            notifyMsg: '',
            updateLoading: '',
            changePwLoading: ''
        }
    }

    componentDidMount = () => {
        var user = localStorage.getItem('user')
        this.setState({ user: JSON.parse(user) })
        this.setState({ updatedUser: JSON.parse(user) })
        this.setState({ hideEdit: true })
        this.setState({ hideChangePw: true })
        this.setState({ updateLoading: false })
        this.setState({ changePwLoading: false })

    }

    notify(place, color) {
        this.refs.notificationAlert.notificationAlert(CustomNotification.notify(place, color, this.state.notifyMsg));
    }

    toggleEdit = (e) => {
        var toggleEdit = this.state.hideEdit
        this.setState({ hideEdit: !toggleEdit })

        var toggleChangePw = this.state.hideChangePw
        if (toggleChangePw === false) { //means changePw window is opened
            this.setState({ hideChangePw: !toggleChangePw })
        }

    }

    toggleChangePw = (e) => {
        var toggleChangePw = this.state.hideChangePw
        this.setState({ hideChangePw: !toggleChangePw })

        var toggleEdit = this.state.hideEdit
        if (toggleEdit === false) { //means editProfile window is opened
            this.setState({ hideEdit: !toggleEdit })
        }
    }

    toggleTwoFa = (e) => {
        var tempUpdatedUser = this.state.updatedUser
        console.log("updating 2fa, current is -> " + tempUpdatedUser.twoFAAuth)
        tempUpdatedUser.twoFAAuth = !(tempUpdatedUser.twoFAAuth)
        console.log("now !  " + tempUpdatedUser["twoFAAuth"])

        this.setState({ updatedUser: tempUpdatedUser })
    }

    handleUpdate = (e) => {
        //console.log("key =>" + e.target.name + " value =>" + e.target.value);

        var tempUpdatedUser = this.state.updatedUser
        var field = e.target.name
        var fieldValue = e.target.value

        tempUpdatedUser[field] = fieldValue

        this.setState({ updatedUser: tempUpdatedUser })
    }

    handlePwUpdate = (e) => {
        var key = e.target.name
        var value = e.target.value

        this.setState({ [e.target.name]: e.target.value })
        console.log(key + "__" + value)
    }

    handleUpdateButton = (e) => {

        console.log("update button called")
        var updatedUser = this.state.updatedUser;
        console.log(JSON.stringify(updatedUser));
        this.setState({ updateLoading: true })

        axios({
            method: 'post',
            url: '/editProfile',
            data: {
                userId: this.state.updatedUser.userId,
                email: this.state.updatedUser.email,
                firstName: this.state.updatedUser.firstName,
                lastName: this.state.updatedUser.lastName,
                contactNumber: this.state.updatedUser.contactNo,
                twoFactorAuth: this.state.updatedUser.twoFAAuth
            }
        }).then((response) => {
            if (response.status === 200) {
                //this.setState({ accounts: response.data.userBankAccountDetails })
                console.log(" Update Success!")
                //var tempUser = updatedUser;
                var tempUser = new User(updatedUser.userId, updatedUser.email, updatedUser.firstName, updatedUser.lastName, updatedUser.joinDate, updatedUser.contactNo, updatedUser.twoFAAuth);

                this.setState({
                    user: tempUser,
                    notifyMsg: "Edit Successful!",
                    updateLoading: false
                }, () => {
                    this.notify('br', 2)
                    this.toggleEdit()
                })
                localStorage.setItem('user', JSON.stringify(tempUser))



            } else {
                console.log("Failed to Update proper")
                this.setState({
                    notifyMsg: "Failed to update properly, please check your fields",
                    updateLoading: false
                }, () => {
                    this.notify('br', 3)
                })

            }
        }).catch((err) => {
            console.log(err.message)
            this.setState({
                notifyMsg: "Unknown Error. Please contact admin!",
                updateLoading: false
            }, () => {
                this.notify('br', 3)
            })

        })

    }

    handlePwUpdateButton = (e) => {
        console.log("ChangePw button called")
        this.setState({ changePwLoading: true })

        if ((this.state.oldPw == '') || (this.state.newPw == '') || (this.state.retypeNewPw == '')) {
            console.log("Error! One of the fields is empty.");
            this.setState({ 
                notifyMsg: "Error! One of the fields is empty. ",
                changePwLoading: false
            }, () => {
                this.notify('br', 3)
            })

        } else {
            if (this.state.newPw != this.state.retypeNewPw) {
                console.log("Error! New passwords do not match.")
                this.setState({ 
                    notifyMsg: "Error! New passwords do not match. ",
                    changePwLoading: false
                 }, () => {
                    this.notify('br', 3)
                })

            } else {
                console.log("Check correct.")
                axios({
                    method: 'post',
                    url: '/changePassword',
                    data: {
                        userId: this.state.updatedUser.userId,
                        oldPassword: this.state.oldPw,
                        newPassword: this.state.newPw
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        console.log(" Password changed Success!")

                        this.setState({ oldPw: '' })
                        this.setState({ newPw: '' })
                        this.setState({ retypeNewPw: '' })

                        this.setState({ 
                            notifyMsg: "Success! Password changed successfully.",
                            changePwLoading: false
                         }, () => {
                            this.notify('br', 2)

                            this.toggleChangePw();
                        })




                    } else if (response.status == 206) {
                        console.log("Password do not match. Try again!")
                        this.setState({ 
                            notifyMsg: "Error! Your old password do not match. Please try again!",
                            changePwLoading: false
                         }, () => {
                            this.notify('br', 3)
                        })

                    }
                }).catch((err) => {
                    console.log(err.message)
                    this.setState({ 
                        notifyMsg: "Unknown Error. Please contact admin!",
                        changePwLoading: false
                     }, () => {
                        this.notify('br', 3)
                    })

                })
            }
        }

    }




    render() {
        return (

            <>
                <NotificationAlert ref="notificationAlert" />
                <PanelHeader size="sm" />
                <div className="content">
                    <Row>

                        <Col md="8" className="ml-auto mr-auto" >
                            <Card className="card-user">
                                <div className="image">
                                    <img alt="..." src={require("assets/img/bg5.jpg")} />

                                </div>
                                <CardBody>
                                    <div className="author">
                                        <a href="#pablo" onClick={e => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="avatar border-gray"
                                                src={require("assets/img/mike.jpg")}
                                            />
                                            <h5 className="title">{this.state.user.firstName + " " + this.state.user.lastName}</h5>
                                        </a>

                                        <p className="description">{this.state.user.email}</p>
                                    </div>
                                    <p className="description text-center">
                                        {this.state.user.contactNo} <br />
                                        {this.state.user.joinDate}

                                    </p>
                                </CardBody>
                                <hr />

                                <div className="button-container">
                                    <Button
                                        className="btn-icon btn-round"
                                        color="neutral"
                                        href="#pablo"
                                        onClick={e => e.preventDefault()}
                                        size="lg"
                                    >
                                        <i className="fab fa-facebook-square" />
                                    </Button>
                                    <Button
                                        className="btn-icon btn-round"
                                        color="neutral"
                                        href="#pablo"
                                        onClick={e => e.preventDefault()}
                                        size="lg"
                                    >
                                        <i className="fab fa-twitter" />
                                    </Button>
                                    <Button
                                        className="btn-icon btn-round"
                                        color="neutral"
                                        href="#pablo"
                                        onClick={e => e.preventDefault()}
                                        size="lg"
                                    >
                                        <i className="fab fa-google-plus-square" />
                                    </Button>
                                    <br />
                                    *Note... Further version will include a profile picture for each users*
                                </div>
                                <div className="button-container">
                                    <Button color="primary" className="btn-round" onClick={(e) => this.toggleEdit(e)} >
                                        Edit Profile
                                    </Button>

                                    <Button color="primary" className="btn-round" onClick={(e) => this.toggleChangePw(e)} >
                                        Change Password
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    {this.state.hideEdit != true ? (
                        <Row>
                            <Spring
                                from={{ opacity: 0, marginTop: 500 }}
                                to={{ opacity: 1, marginTop: 0 }}
                            >
                                {props => (
                                    <Col md="8" className="ml-auto mr-auto" style={props}>
                                        <Card>
                                            <CardHeader>
                                                <h5 className="title">Edit Profile</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <Row>
                                                        <Col className="pr-1" md="6">
                                                            <FormGroup>
                                                                <label>Joined Date (disabled)</label>
                                                                <Input
                                                                    defaultValue={this.state.updatedUser.joinDate}
                                                                    disabled
                                                                    placeholder="Company"
                                                                    type="text"
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col className="pl-1" md="6">
                                                            <FormGroup>
                                                                <label htmlFor="exampleInputEmail1">
                                                                    Email address
                        </label>
                                                                <Input
                                                                    placeholder="Email"
                                                                    name="email"
                                                                    disabled
                                                                    type="email"
                                                                    defaultValue={this.state.updatedUser.email}
                                                                    onChange={this.handleUpdate}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>First Name</label>
                                                                <Input
                                                                    defaultValue={this.state.updatedUser.firstName}
                                                                    placeholder="First Name"
                                                                    name="firstName"
                                                                    type="text"
                                                                    onChange={this.handleUpdate}
                                                                />
                                                            </FormGroup>

                                                        </Col>

                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Last Name</label>
                                                                <Input
                                                                    defaultValue={this.state.updatedUser.lastName}
                                                                    name="lastName"
                                                                    placeholder="Last Name"
                                                                    type="text"
                                                                    onChange={this.handleUpdate}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Contact Number</label>
                                                                <Input
                                                                    defaultValue={this.state.updatedUser.contactNo}
                                                                    name="contactNo"
                                                                    placeholder="Contact Number"
                                                                    type="text"
                                                                    onChange={this.handleUpdate}
                                                                />
                                                            </FormGroup>

                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <p className="category">2 Factor Authentication (2FA)</p>
                                                            <Switch
                                                                name="twoFAAuth"
                                                                onColor={"green"}
                                                                offColor={"red"}
                                                                onText={<i className="now-ui-icons ui-1_check" />}
                                                                offText={
                                                                    <i className="now-ui-icons ui-1_simple-remove color" />
                                                                }
                                                                value={this.state.updatedUser.twoFAAuth}
                                                                onChange={this.toggleTwoFa}
                                                            />
                                                        </Col>
                                                    </Row>
                                                    {this.state.updateLoading != true ? (

                                                        <Button color="primary" className="btn-round float-right" onClick={(e) => this.handleUpdateButton(e)} >
                                                            Update my Profile
                                                        </Button>
                                                    )
                                                        : (
                                                            <div>

                                                                <Button color="primary" className="btn-round float-right" disabled >
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                            </Button>

                                                            </div>
                                                        )}
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )}
                            </Spring>
                        </Row>
                    ) : (
                            <div />
                        )}
                    {this.state.hideChangePw != true ? (
                        <Row>
                            <Spring
                                from={{ opacity: 0, marginTop: 500 }}
                                to={{ opacity: 1, marginTop: 0 }}
                            >
                                {props => (
                                    <Col md="8" className="ml-auto mr-auto" style={props}>
                                        <Card>
                                            <CardHeader>
                                                <h5 className="title">Change Password</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Old Password</label>
                                                                <Input
                                                                    defaultValue={""}
                                                                    placeholder="Old Password"
                                                                    required={true}
                                                                    name="oldPw"
                                                                    type="text"
                                                                    onChange={this.handlePwUpdate}
                                                                />
                                                            </FormGroup>

                                                        </Col>

                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>New Password</label>
                                                                <Input
                                                                    defaultValue={""}
                                                                    name="newPw"
                                                                    required={true}
                                                                    placeholder="New Password"
                                                                    type="text"
                                                                    onChange={this.handlePwUpdate}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Retype New Password</label>
                                                                <Input
                                                                    defaultValue={""}
                                                                    name="retypeNewPw"
                                                                    required={true}
                                                                    placeholder="Retype New Password"
                                                                    type="text"
                                                                    onChange={this.handlePwUpdate}
                                                                />
                                                            </FormGroup>

                                                        </Col>
                                                    </Row>

                                                    {this.state.changePwLoading != true ? (
                                                        <Button color="primary" className="btn-round float-right" onClick={(e) => this.handlePwUpdateButton(e)} >
                                                            Change password
                                                        </Button>
                                                    )
                                                        : (
                                                            <div>
                                                                <Button color="primary" className="btn-round float-right" disabled >
                                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
Loading...
</Button>
                                                            </div>
                                                        )}





                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )}
                            </Spring>
                        </Row>
                    ) : (
                            <div />
                        )}
                </div>
            </>

        );
    }
}

export default MyProfile