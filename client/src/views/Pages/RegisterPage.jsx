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
      password: '',
      firstName: '',
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

  handleUserInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
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
          //this.setState({ message: 'Sign Up successful! You have achieved your first step as a smart saver!' })
          this.setState({notificationColor : 5})
         // this.notify('tc', 5)
        } else {

          // console.log("An error occured")
          this.setState({notificationColor : 4})
          //this.notify('tc', 4)
        }

        return response.json();

      }).then((data) => {
        this.setState({message: data.message})
        this.notify('tc', this.state.notificationColor)
      })

      .catch(err => {
        console.log(err)

      })

    event.preventDefault();
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
                        <div className="social btns-mr-5">
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
                        </div>
                      </CardHeader>
                      <CardBody>

                        <InputGroup
                          className={
                            this.state.emailFocus ? "input-group-focus" : ""
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons ui-1_email-85" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email..."
                            value={this.state.email}
                            onChange={this.handleUserInput}
                            onFocus={e => this.setState({ emailFocus: true })}
                            onBlur={e => this.setState({ emailFocus: false })}
                          />
                        </InputGroup>
                        <InputGroup
                          className={
                            this.state.firstnameFocus ? "input-group-focus" : ""
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons users_circle-08" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="First Name..."
                            id="firstName"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.handleUserInput}
                            onFocus={e =>
                              this.setState({ firstnameFocus: true })
                            }
                            onBlur={e =>
                              this.setState({ firstnameFocus: false })
                            }
                          />
                        </InputGroup>
                        <InputGroup
                          className={
                            this.state.lastnameFocus ? "input-group-focus" : ""
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons text_caps-small" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Last Name..."
                            id="lastName"
                            name="lastName"
                            value={this.state.lastName}
                            onChange={this.handleUserInput}
                            onFocus={e =>
                              this.setState({ lastnameFocus: true })
                            }
                            onBlur={e =>
                              this.setState({ lastnameFocus: false })
                            }
                          />
                        </InputGroup>

                        <InputGroup
                          className={
                            this.state.passwordFocus ? "input-group-focus" : ""
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons ui-1_email-85" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password..."
                            value={this.state.password}
                            onChange={this.handleUserInput}
                            onFocus={e => this.setState({ passwordFocus: true })}
                            onBlur={e => this.setState({ passwordFocus: false })}
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
