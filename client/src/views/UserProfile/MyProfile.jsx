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

//Axios
import axios from 'axios';

import { User } from '../../models/User'

export class MyProfile extends Component {
    constructor(props) {
        super(props);
        //this.retrieveUserBanks.bind(this)
        this.state = {
            user: '',
            updatedContactNo: '',
            updatedEmail: '',
            updatedFirstName:'',
            updatedLastName:''
        }
    }

    componentDidMount = () => {
        var user = localStorage.getItem('user')
        this.setState({ user: JSON.parse(user) })
        this.setState({ updatedUser : JSON.parse(user)})
        //setTimeout(() => {
        //    this.retrieveUserBanks()
        //}, 200);


    }

    handleUpdate = (e) => {
        console.log("updatedFirstName called :D ");
        console.log("key =>" + e.target.name + " value =>" + e.target.value);

        this.setState({[e.target.name] : e.target.value})
        //TODO: Include a dropdown/Checkbox to indicate preference of 2FA!
    }

    handleUpdateButton = (e) => {
        var updatedUser = new User(this.state.user.userId, this.state.updatedEmail, this.state.updatedFirstName,
            this.state.updatedLastName, this.state.user.joinDate, this.state.updatedContactNo);
        
        console.log(JSON.stringify(updatedUser));
        //TODO: handle update API
    }

    render() {
        return (

            <>
                <PanelHeader size="sm" />
                <div className="content">
                    <Row>
                        <Col md="8">
                            <Card>
                                <CardHeader>
                                    <h5 className="title">Edit Profile</h5>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row>
                                            <Col className="pr-1" md="5">
                                                <FormGroup>
                                                    <label>Joined Date (disabled)</label>
                                                    <Input
                                                        defaultValue={this.state.user.joinDate}
                                                        disabled
                                                        placeholder="Company"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="px-1" md="3">
                                                <FormGroup>
                                                    <label>Contact Number</label>
                                                    <Input
                                                        defaultValue={this.state.user.contactNo}
                                                        name="updatedContactNo"
                                                        placeholder="Contact Number"
                                                        type="text"
                                                        onChange={this.handleUpdate}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup>
                                                    <label htmlFor="exampleInputEmail1">
                                                        Email address
                        </label>
                                                    <Input
                                                        placeholder="Email"
                                                        name="updatedEmail"
                                                        type="email"
                                                        defaultValue={this.state.user.email}
                                                        onChange={this.handleUpdate}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-1" md="6">
                                                <FormGroup>
                                                    <label>First Name</label>
                                                    <Input
                                                        defaultValue={this.state.user.firstName}
                                                        placeholder="First Name"
                                                        name="updatedFirstName"
                                                        type="text"
                                                        onChange={this.handleUpdate}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="6">
                                                <FormGroup>
                                                    <label>Last Name</label>
                                                    <Input
                                                        defaultValue={this.state.user.lastName}
                                                        name="updatedLastName"
                                                        placeholder="Last Name"
                                                        type="text"
                                                        onChange={this.handleUpdate}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        {/* 
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label>Address</label>
                                                    <Input
                                                        defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                                                        placeholder="Home Address"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-1" md="4">
                                                <FormGroup>
                                                    <label>City</label>
                                                    <Input
                                                        defaultValue="Mike"
                                                        placeholder="City"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="px-1" md="4">
                                                <FormGroup>
                                                    <label>Country</label>
                                                    <Input
                                                        defaultValue="Andrew"
                                                        placeholder="Country"
                                                        type="text"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="4">
                                                <FormGroup>
                                                    <label>Postal Code</label>
                                                    <Input placeholder="ZIP Code" type="number" />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label>About Me</label>
                                                    <Input
                                                        cols="80"
                                                        defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                          that two seat Lambo."
                                                        placeholder="Here can be your description"
                                                        rows="4"
                                                        type="textarea"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        */}

                                        <Button color="primary" className="btn-round float-right" onClick={(e) => this.handleUpdateButton(e)} >
                                            Update my Profile
                            </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4">
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
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>

        );
    }
}

export default MyProfile