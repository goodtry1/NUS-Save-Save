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

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button
} from "reactstrap";

import { Redirect } from 'react-router-dom';
import NotificationAlert from "react-notification-alert";
import SweetAlert from "react-bootstrap-sweetalert";

// core components
import nowLogo from "assets/img/now-logo.png";

import bgImage from "assets/img/bg14.jpg";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',
      redirect: false,
      alert: null,
      show: false
    };

    
  }

  componentDidMount() {
    document.body.classList.add("login-page");
  }
  componentWillUnmount() {
    document.body.classList.remove("login-page");
  }

  handleUserInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    let values = {
      email: this.state.email,
      password: this.state.password
    };

    console.log("values:", values);

    fetch("/signin", {
      method: "POST",
      body: JSON.stringify(values),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => {
        console.log("response status:" + response.status)

        if (response.status === 200) {
          localStorage.setItem("email", this.state.email)
          console.log("Log in successful")
          this.setState({ message: "Login Successful! Redirecting you now.." })
          //this.setState({ redirect: true })
          this.successAlert()
          
          console.log("Supposed to show sweet alert")
          // this.redirect()
        } else {
          console.log("Log in unsuccessful")
          this.setState({ message: "Invalid login credentials" })
          //this.notify("tr", 3)
        }

      })
      .catch(err => {
        console.log("Error has occured")
        this.setState({ message: err.message })
        console.log(this.state.message)
      })

    event.preventDefault();
  }

  successAlert() {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Good job!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
        >
          You clicked the button!
        </SweetAlert>
      )
    });
  }

  hideAlert() {
    this.setState({
      alert: null
    });
  }

  render() {
    return (
      <>
       {this.state.alert}
        <div className="content">
          <div className="login-page">
            <Container>
              <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
                <Form onSubmit={this.handleSubmit}>
                  <Card className="card-login card-plain">
                    <CardHeader>
                      <div className="logo-container">
                        <img src={nowLogo} alt="now-logo" />
                      </div>
                    </CardHeader>
                    <CardBody>
                      <InputGroup
                        className={
                          "no-border form-control-lg " +
                          (this.state.firstnameFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons users_circle-08" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="email"
                          name="email"
                          type="text"
                          placeholder="Email"
                          onFocus={e => this.setState({ firstnameFocus: true })}
                          onBlur={e => this.setState({ firstnameFocus: false })}
                          onChange={this.handleUserInput}
                        />
                      </InputGroup>
                      <InputGroup
                        className={
                          "no-border form-control-lg " +
                          (this.state.lastnameFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons text_caps-small" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Password"
                          onFocus={e => this.setState({ lastnameFocus: true })}
                          onBlur={e => this.setState({ lastnameFocus: false })}
                          onChange={this.handleUserInput}
                        />
                      </InputGroup>
                    </CardBody>
                    <CardFooter>
                      <Button
                        type="submit"
                        block
                        color="primary"
                        size="lg"
                        className="mb-3 btn-round"
                      >
                        Login
                      </Button>
                      <div className="pull-left">
                        <h6>
                          <a href="#pablo" className="link footer-link">
                            Create Account
                          </a>
                        </h6>
                      </div>
                      <div className="pull-right">
                        <h6>
                          <a href="#pablo" className="link footer-link">
                            Need Help?
                          </a>
                        </h6>
                      </div>
                    </CardFooter>
                  </Card>
                </Form>
              </Col>
            </Container>
          </div>
        </div>
        <div
          className="full-page-background"
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        />
      </>
    );
  }
}

export default LoginPage;
