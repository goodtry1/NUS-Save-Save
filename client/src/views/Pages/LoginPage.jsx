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

  redirect = () => {
    setTimeout(() => {
      this.setState({ redirect: true })
    }, 2000);
  }

  notify(place, color) {
    //var color = 5;
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {this.state.message}
          </div>
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  }



  testLogin = () => {
    console.log("Testing now!")
    var email = this.state.email;
    //login["email"] = e.target.value;
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(email) && this.state.password.length > 0) {

    } else if (emailRex.test(email) && this.state.password.length <= 0) {
      this.setState({ message: 'Please enter your password' })
      throw new Error()
    } else if (!emailRex.test(email) && this.state.password.length > 0) {
      this.setState({ message: 'Please enter a correct email format' })
      throw new Error()
    } else if (!emailRex.test(email) && this.state.password.length <= 0) {
      this.setState({ message: 'Please enter a correct email format and password' })
      throw new Error()

    }
  }

  handleSubmit = (event) => {
    try {
      this.testLogin()
      this.loginViaServer()
    } catch (err) {

    } finally {
      setTimeout(() => {
        this.notify('br', 4)
      }, 200);

    }

    event.preventDefault();
  }

  loginViaServer = () => {
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
          this.setState({ message: "Login Successful! Redirecting you now" })
          //this.successAlert()
          this.notify("tc", 5)
          this.redirect()
        } else {
          console.log("Log in unsuccessful")
          this.setState({ message: "Invalid login credentials" })
          this.notify("tc", 3)
        }

      })
      .catch(err => {
        console.log("Error has occured")
        this.setState({ message: err.message })
        console.log(this.state.message)
      })
  }





  render() {

    if (this.state.redirect) {
      return <Redirect to="/Admin" />;
    }
    return (
      <>
        {/* {this.state.alert} */}
        <NotificationAlert ref="notificationAlert" />
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
                          (this.state.emailFocus ? "input-group-focus" : "")
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
                          onFocus={e => this.setState({ emailFocus: true })}
                          onBlur={e => this.setState({ emailFocus: false })}
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
                            <i className="now-ui-icons objects_key-25" />
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
                          {/* <a href="/auth/register-page" className="link footer-link">
                            Create Account
                          </a> */}
                        </h6>
                      </div>
                      <div className="pull-right">
                        <h6>
                          {/* <a href="#pablo" className="link footer-link">
                            Need Help?
                          </a> */}
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
