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

export class MyProfile extends Component {
    constructor(props) {
        super(props);
        //this.retrieveUserBanks.bind(this)
        this.state = {
            user: '',
            updatedUser: ''
        }
    }

    componentDidMount = () => {
        var user = localStorage.getItem('user')
        this.setState({ user: JSON.parse(user) })

        //setTimeout(() => {
        //    this.retrieveUserBanks()
        //}, 200);


    }

    handleFirstName = (e) => {
        console.log("updatedFirstName called :D ");
        console.log(e.target.value);
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
                                                        name="contactNo"
                                                        placeholder="Contact Number"
                                                        type="text"
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
                                                        type="email"
                                                        defaultValue={this.state.user.email}
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
                                                        type="text"
                                                        onChange={this.handleFirstName}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-1" md="6">
                                                <FormGroup>
                                                    <label>Last Name</label>
                                                    <Input
                                                        defaultValue={this.state.user.lastName}
                                                        placeholder="Last Name"
                                                        type="text"
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

                                        <Button color="primary" className="btn-round float-right" onClick={(e) => this.updateProfile(e)} >
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