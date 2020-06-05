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
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Button
} from "reactstrap";

// core components
import bgImage from "assets/img/bg16.jpg";

//Additional imports
import NotificationAlert from "react-notification-alert";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailState: "",
      password: '',
      passwordState: '',
      firstName: '',
      firstNameState: '',
      lastNameState: '',
      lastName: '',
      message: '',
      notificationColor: '',
    };
  }
  componentDidMount() {
    document.body.classList.add("register-page");
  }
  componentWillUnmount() {
    document.body.classList.remove("register-page");
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

  emailChange(e) {
    this.setState({
      email: e.target.value
    });
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(e.target.value)) {
      this.setState({
        emailState: " has-success"
      });
    } else {
      this.setState({
        emailState: " has-danger"
      });
    }
  }

  firstNameChange(e) {
    this.setState({
      firstName: e.target.value
    });
    if (e.target.value.length > 0) {
      this.setState({
        firstNameState: " has-success"
      });
    } else {
      this.setState({
        firstNameState: " has-danger"
      });
    }
  }

  lastNameChange(e) {
    this.setState({
      lastName: e.target.value
    });
    if (e.target.value.length > 0) {
      this.setState({
        lastNameState: " has-success"
      });
    } else {
      this.setState({
        lastNameState: " has-danger"
      });
    }
  }

  passwordChange(e) {
    this.setState({
      password: e.target.value
    });
    if (e.target.value.length > 0) {
      this.setState({
        passwordState: " has-success"
      });
    } else {
      this.setState({
        passwordState: " has-danger"
      });
    }
  }

  isValidated() {
    if (this.state.firstNameState !== " has-success") {
      this.setState({
        firstNameState: " has-danger"
      });
    }

    if (this.state.lastNameState !== " has-success") {
      this.setState({
         lastNameState: " has-danger"
      });
    }

    if (this.state.emailState !== " has-success") {
      this.setState({
         emailState: " has-danger"
      });
    }

    if (this.state.passwordState !== " has-success") {
      this.setState({
         passwordState: " has-danger"
      });
    }


    if (
      this.state.firstNameState !== " has-success" ||
      this.state.lastNameState !== " has-success" ||
      this.state.emailState !== " has-success" ||
      this.state.passwordState !== " has-success"
    ) {
      this.setState({
        /* firstNameState: " has-danger",
         lastNameState: " has-danger",
         emailState: " has-danger",
         passwordState: " has-danger" */
      });
      return false;
    }
    return true;
  }

  handleUserInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };




  handleSubmit = (event) => {
    if (this.isValidated()) {
      this.registerViaServer()
    }

    event.preventDefault();
  }

  registerViaServer = () => {
    this.setState({ email: '', password: '', firstName: '', lastName: '' })


    let values = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };

    console.log("values:", values);

    fetch("/signUp", {
      method: "POST",
      body: JSON.stringify(values),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => {

        console.log("response status:" + response.status)

        if (response.status === 200) {
          console.log("Signup successful")
          this.setState({ message: 'Sign Up successful! You have achieved your first step as a smart saver!' })
          // this.setState({ notificationColor: 5 })
          this.notify('tc', 5)
        } else {

          // console.log("An error occured")
          // this.setState({ notificationColor: 4 })
          this.notify('tc', 4)
        }

        return response.json();

      }).then((data) => {
        this.setState({ message: data.message })
        //this.notify('tc', this.state.notificationColor)
      })

      .catch(err => {
        console.log(err)

      })
  }



  render() {
    return (
      <>
        <div className="content">
          <NotificationAlert ref="notificationAlert" />
          <div className="register-page">
            <Container>
              <Row className="justify-content-center">
                <Col lg={5} md={8} xs={12}>
                  <div className="info-area info-horizontal mt-5">
                    <div className="icon icon-primary">
                      <i className="now-ui-icons media-2_sound-wave" />
                    </div>
                    <div className="description">
                      <h5 className="info-title">Marketing</h5>
                      <p className="description">
                        We've created the marketing campaign of the website. It
                        was a very interesting collaboration.
                      </p>
                    </div>
                  </div>
                  <div className="info-area info-horizontal">
                    <div className="icon icon-primary">
                      <i className="now-ui-icons media-1_button-pause" />
                    </div>
                    <div className="description">
                      <h5 className="info-title">Fully Coded in React 16</h5>
                      <p className="description">
                        We've developed the website with React 16, HTML5 and
                        CSS3. The client has access to the code using GitHub.
                      </p>
                    </div>
                  </div>
                  <div className="info-area info-horizontal">
                    <div className="icon icon-info">
                      <i className="now-ui-icons users_single-02" />
                    </div>
                    <div className="description">
                      <h5 className="info-title">Built Audience</h5>
                      <p className="description">
                        There is also a Fully Customizable CMS Admin Dashboard
                        for this product.
                      </p>
                    </div>
                  </div>
                </Col>
                <Col lg={4} md={8} xs={12}>
                  <Form onSubmit={this.handleSubmit}>
                    <Card className="card-signup">
                      <CardHeader className="text-center">
                        <CardTitle tag="h4">Register</CardTitle>
                        {/* <div className="social btns-mr-5">
                          <Button className="btn-icon btn-round" color="twitter">
                            <i className="fab fa-twitter" />
                          </Button>
                          <Button className="btn-icon btn-round" color="dribbble">
                            <i className="fab fa-dribbble" />
                          </Button>
                          <Button className="btn-icon btn-round" color="facebook">
                            <i className="fab fa-facebook-f" />
                          </Button>
                          <h5 className="card-description">or be classical</h5>
                        </div> */}
                      </CardHeader>
                      <CardBody>

                        <InputGroup
                          className={
                            "form-control-lg" +
                            (this.state.emailState ? this.state.emailState : "") +
                            (this.state.emailFocus ? " input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons ui-1_email-85" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            defaultValue={this.state.email}
                            type="text"
                            placeholder="Email (required)"
                            name="email"
                            onFocus={e => this.setState({ emailFocus: true })}
                            onBlur={e => this.setState({ emailFocus: false })}
                            onChange={e => this.emailChange(e)}
                          />
                        </InputGroup>

                        <InputGroup
                          className={
                            "form-control-lg" +
                            (this.state.firstNameState ? this.state.firstNameState : "") +
                            (this.state.firstNameFocus ? " input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons users_single-02" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            defaultValue={this.state.firstName}
                            type="text"
                            placeholder="First Name (required)"
                            name="firstName"
                            onFocus={e => this.setState({ firstNameFocus: true })}
                            onBlur={e => this.setState({ firstNameFocus: false })}
                            onChange={e => this.firstNameChange(e)}
                          />
                        </InputGroup>

                        <InputGroup
                          className={
                            "form-control-lg" +
                            (this.state.lastNameState ? this.state.lastNameState : "") +
                            (this.state.lastNameFocus ? " input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons text_caps-small" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            defaultValue={this.state.lastName}
                            type="text"
                            placeholder="Last Name (required)"
                            name="lastName"
                            onFocus={e => this.setState({ lastNameFocus: true })}
                            onBlur={e => this.setState({ lastNameFocus: false })}
                            onChange={e => this.lastNameChange(e)}
                          />
                        </InputGroup>

                        <InputGroup
                          className={
                            "form-control-lg" +
                            (this.state.passwordState ? this.state.passwordState : "") +
                            (this.state.passwordFocus ? " input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons objects_key-25" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            defaultValue={this.state.password}
                            type="text"
                            placeholder="Password (required)"
                            name="password"
                            onFocus={e => this.setState({ passwordFocus: true })}
                            onBlur={e => this.setState({ passwordFocus: false })}
                            onChange={e => this.passwordChange(e)}
                          />
                        </InputGroup>


                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox" />
                            <span className="form-check-sign" />
                            <div>
                              I agree to the{" "}
                              <a href="#something">terms and conditions</a>.
                            </div>
                          </Label>
                        </FormGroup>

                      </CardBody>
                      <CardFooter className="text-center">
                        <Button
                          color="primary"
                          size="lg"
                          className="btn-round"
                        //href="#pablo"
                        >
                          Register
                      </Button>
                      </CardFooter>
                    </Card>
                  </Form>
                </Col>
              </Row>
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

export default RegisterPage;
