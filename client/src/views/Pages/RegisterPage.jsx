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
import { api } from '../../api-config'

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
  //FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  //Label,
  Button,
  Tooltip
} from "reactstrap";

// core components
import bgImage from "assets/img/MBS_night.jpg";

//Additional imports
import NotificationAlert from "react-notification-alert";

//FaceBook
//import FacebookLogin from 'react-facebook-login'

//Dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
//import DialogTitle from '@material-ui/core/DialogTitle';

//Registration Wizard
import RegistrationWizard from '../Pages/Registration Stepper/RegistrationWizard'

//Slide up transition
import Slide from '@material-ui/core/Slide';

//Axios
import axios from 'axios'

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailState: "",
      password: '',
      passwordState: '',
      reTypePassword: '',
      reTypePasswordState: '',
      firstName: '',
      firstNameState: '',
      lastNameState: '',
      lastName: '',
      number: '',
      numberState: '',
      message: '',
      notificationColor: '',
      openDialog: false,
      dialogFinish: false,
      code: '',
      renderLoading: false,
      accountToolTipState: false
    };
  }

  /**
   * default function by Creative Tim
   */
  componentDidMount() {
    document.body.classList.add("register-page");
  }

  /**
   * default function by Creative Tim
   */
  componentWillUnmount() {
    document.body.classList.remove("register-page");
  }

  /**
   * 
   * @param {*} place - place of notification
   * @param {*} color - color of notification
   */
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

  /**
   * checks for user email input and changes the state accordingly based on whether it's valid or not
   * @param {*} e - event triggering this function
   */
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

   /**
   * checks for user first name input and changes the state accordingly based on whether it's valid or not
   * @param {*} e - event triggering this function
   */
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

   /**
   * checks for user last name input and changes the state accordingly based on whether it's valid or not
   * @param {*} e - event triggering this function
   */
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

   /**
   * checks for user password input and changes the state accordingly based on whether it's valid or not
   * @param {*} e - event triggering this function
   */
  passwordChange(e) {
    this.setState({
      password: e.target.value
    }, () => {
      if (this.state.reTypePassword === this.state.password) {



        this.setState({
          reTypePasswordState: " has-success"
        });
      } else {
        this.setState({
          reTypePasswordState: " has-danger"
        });
      }

    });

    //8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
    var passRex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (passRex.test(e.target.value)) {
      this.setState({
        passwordState: " has-success"
      });
    } else {
      this.setState({
        passwordState: " has-danger"
      });
    }
  }

  
  reTypePasswordChange(e) {
    this.setState({
      reTypePassword: e.target.value
    }, () => {
      if (this.state.reTypePassword === this.state.password) {
        this.setState({
          reTypePasswordState: " has-success"
        });
      } else {
        this.setState({
          reTypePasswordState: " has-danger"
        });
      }
    });
  }

  /**
   * tooltip for password strength
   */
  toggleToolTip = () => {
    this.setState({ accountToolTipState: !this.state.accountToolTipState })
  }

   /**
   * checks for user number input and changes the state accordingly based on whether it's valid or not
   * @param {*} e - event triggering this function
   */
  numberChange(e) {
    this.setState({
      number: e.target.value
    });
    if (e.target.value.length > 0) {
      this.setState({
        numberState: " has-success"
      });
    } else {
      this.setState({
        numberState: " has-danger"
      });
    }
  }

  /**
   * checks if all of the input are valid
   */
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

    if (this.state.numberState !== " has-success") {
      this.setState({
        numberState: " has-danger"
      });
    }


    if (
      this.state.firstNameState !== " has-success" ||
      this.state.lastNameState !== " has-success" ||
      this.state.emailState !== " has-success" ||
      this.state.passwordState !== " has-success" ||
      this.state.numberState !== " has-success"
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

 
 /*  handleUserInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }; */



  /**
   * when user clicks on "Register"
   * @param {*} event - event triggering this function
   */
  handleSubmit = (event) => {


    if (this.isValidated()) {
      this.setState({ renderLoading: true })
      //this.registerViaServer()

      axios({
        method: 'post',
        url: `${api}/twoFactorAuthenticate`,
        data: {
          "email": this.state.email,
          "action": "signUp"
        }
      }).then((response) => {
        this.setState({ renderLoading: false })
        if (response.status === 200) {

          // localStorage.setItem('code', response.data.otp)

          this.setState({ code: response.data.otp }, () => { this.openDialog() })

        } else if (response.status === 206) {
          this.setState({ message: 'An account has already been registered with this email', renderLoading: false },
            () => { this.notify('br', 4) })
        }
      }).catch((err) => {
        this.setState({ message: "An error has occured, please try again later", renderLoading: false }, () => { this.notify('tc', 3) })
      })





    }

    event.preventDefault();
  }

  /**
   * submit details to server via RESTful api
   */
  registerViaServer = () => {



    let values = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      contactNumber: this.state.number,
      twoFactorAuth: 'false'

    };

    fetch(`${api}/signUp`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => {

        if (response.status === 200) {
          this.setState({ message: 'Sign Up successful! You have achieved your first step as a smart saver!' })
          // this.setState({ notificationColor: 5 })
          this.notify('tc', 5)
        } else {

          this.setState({ message: 'An error has occured, please try again later' })

          // console.log("An error occured")
          // this.setState({ notificationColor: 4 })
          this.notify('tc', 4)


        }



      }).catch((err) => {
        this.setState({ message: "An error has occured, please try again later", renderLoading: false }, () => { this.notify('tc', 3) })
      }).then(() => {
        this.setState({
          email: '',
          emailState: '',
          password: '',
          passwordState: '',
          firstName: '',
          firstNameState: '',
          lastName: '',
          lastNameState: '',
          number: '',
          numberState: ''
        })
      })
  }

  /* componentClicked = () => {
    console.log("Facebook login clicked")
  }

  responseFacebook = (response) => {
    console.log(response)
  } */


  /**
   * open OTP dialog
   */
  openDialog = () => {
    this.setState({ openDialog: true })
  }

  /**
   * close OTP dialog
   */
  closeDialog = () => {
    this.setState({ openDialog: false })
  }

  /**
   * when user completes OTP check
   */
  completedDialog = () => {
    this.setState({
      dialogFinish: true,
      openDialog: false
    }, () => { this.registerViaServer() })

  }

  /**
   * render loading button
   */
  renderLoading() {
    return (

      <div>
        <center>
          <Button color="primary" disabled size="lg" className="mb-3 btn-round" block>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
        </Button>
        </center>
      </div>
    )
  }

  /**
   * render register page
   */
  render() {
    return (
      <>


        <div id="fb-root"></div>
        <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v7.0&appId=1210844962589186&autoLogAppEvents=1"></script>


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
                      <h5 className="info-title">Save Save</h5>
                      <p className="description">
                        Join us today to experience the next step of smart banking.
                        We analyse your bank statements to optimise your interest rates.
                      </p>
                    </div>
                  </div>
                  {/* <div className="info-area info-horizontal">
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
                  </div> */}
                  {/*  <div className="info-area info-horizontal">
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
                  </div> */}
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
                            /*  defaultValue={this.state.email} */
                            value={this.state.email}
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
                            /* defaultValue={this.state.firstName} */
                            value={this.state.firstName}
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
                            /* Value={this.state.lastNamedefault} */
                            value={this.state.lastName}
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
                            /* defaultValue={this.state.password} */
                            id="password"
                            value={this.state.password}
                            type="password"
                            placeholder="Password (required)"
                            name="password"
                            onFocus={e => this.setState({ passwordFocus: true })}
                            onBlur={e => this.setState({ passwordFocus: false })}
                            onChange={e => this.passwordChange(e)}
                          />
                          {this.state.passwordState === " has-danger" ? (

                            <Tooltip placement="right" target="password" isOpen={this.state.passwordState === " has-danger"} >
                              Password must contain 8 to 15 characters which contain at least one lowercase letter,
                              one uppercase letter, one numeric digit, and one special character.
                            </Tooltip>

                          ) : (
                              <div />
                            )}
                        </InputGroup>

                        <InputGroup
                          className={
                            "form-control-lg" +
                            (this.state.reTypePasswordState ? this.state.reTypePasswordState : "") +
                            (this.state.reTypePasswordFocus ? " input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons objects_key-25" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            /* defaultValue={this.state.password} */
                            id="reTypePassword"
                            value={this.state.reTypePassword}
                            type="password"
                            placeholder="Retype Password (required)"
                            name="reTypepassword"
                            onFocus={e => this.setState({ reTypePasswordFocus: true })}
                            onBlur={e => this.setState({ reTypePasswordFocus: false })}
                            onChange={e => this.reTypePasswordChange(e)}
                          />
                          <Tooltip placement="right" target="reTypePassword" isOpen={(this.state.passwordState === " has-success") && (this.state.reTypePasswordState === " has-danger")} >
                            Passwords do not match!
                            </Tooltip>

                        </InputGroup>

                        <InputGroup
                          className={
                            "form-control-lg" +
                            (this.state.numberState ? this.state.numberState : "") +
                            (this.state.numberFocus ? " input-group-focus" : "")
                          }
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="now-ui-icons tech_mobile" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            /* defaultValue={this.state.number} */
                            value={this.state.number}
                            type="text"
                            placeholder="Phone number (required)"
                            name="number"
                            onFocus={e => this.setState({ numberFocus: true })}
                            onBlur={e => this.setState({ numberFocus: false })}
                            onChange={e => this.numberChange(e)}
                          />
                        </InputGroup>


                        {/* <FormGroup check>
                          <Label check>
                            <Input type="checkbox" />
                            <span className="form-check-sign" />
                            <div>
                              I agree to the{" "}
                              <a href="#something">terms and conditions</a>.
                            </div>
                          </Label>
                        </FormGroup> */}

                        {/*   <div className="fb-login-button" data-size="medium" data-button-type="continue_with" data-layout="rounded" data-auto-logout-link="true" data-use-continue-as="false" data-width="" >

                        </div> */}



                        {/*   <FacebookLogin
                          appId="1210844962589186"
                          autoLoad={false}
                          fields="name,email,picture"
                          onClick={this.componentClicked}
                          callback={this.responseFacebook}
                          data-auto-logout-link="true"
                        >
                        </FacebookLogin> */}






                      </CardBody>
                      <CardFooter className="text-center">
                        {this.state.renderLoading ?
                          (this.renderLoading()
                          ) : (
                            <Button
                              color="primary"
                              size="lg"
                              block
                              className="mb-3 btn-round"
                            //href="#pablo"
                            >
                              Register
                            </Button>)}

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



        <Dialog fullScreen open={this.state.openDialog} onClose={this.closeDialog} aria-labelledby="form-dialog-title" scroll={'body'} TransitionComponent={Transition}>
          <DialogContent >
            <RegistrationWizard completedDialog={this.completedDialog} otp={this.state.code}></RegistrationWizard>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog} color="primary">
              Cancel
          </Button>
            {/* <Button onClick={this.closeDialog} color="primary">
              Subscribe
          </Button> */}
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default RegisterPage;


