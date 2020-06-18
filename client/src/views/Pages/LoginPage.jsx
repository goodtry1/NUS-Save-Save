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
//import SweetAlert from "react-bootstrap-sweetalert";

//Redux
/* import { useSelector, useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { logIn } from '../../redux/actions/actions' */

// core components
import nowLogo from "assets/img/now-logo.png";

import bgImage from "assets/img/bg14.jpg";

import { User } from '../../models/User'

import CustomNotification from '../../Notifications/CustomNotification'

//Axios
import axios from 'axios'

//Animation
import { Spring } from 'react-spring/renderprops'

//Backdrop
import { Backdrop } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',
      redirect: false,
      alert: null,
      show: false,
      twoFA: false,
      otp: '',
      otpInput: '',
      user: '',
      background: false,
      renderLoading: false
    };
  }



  componentDidMount() {
    if (localStorage.getItem('isLoggedIn')) {
      this.setState({ redirect: true })
    }

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

  /* notify(place, color) {
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
  } */

  notify(place, color) {
    this.refs.notificationAlert.notificationAlert(CustomNotification.notify(place, color, this.state.message));
  }



  testLogin = () => {

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
    event.preventDefault();
    this.setState({renderLoading : true},
      () => {
        try {
          this.testLogin()
          this.loginViaServer()
    
        } catch (err) {
          this.setState({renderLoading : false},
            () => {
              setTimeout(() => {
                this.notify('tc', 4)
              }, 200);
            })
         
        }
      })
    


  }

  loginViaServer = () => {
    

    axios({
      method: 'post',
      url: '/signin',
      data: {
        "email": this.state.email,
        "password": this.state.password
      }
    }).then((response) => {



      if (response.status === 200) {

        var user = response.data.userDetails
        console.log(user.twoFactorAuth)

        if (user.twoFactorAuth) {
          this.setState({ twoFA: true, user })

          axios({
            method: 'post',
            url: '/twoFactorAuthenticate',
            data: {
              email: this.state.email,
              action: "signIn"
            }
          }).then((response) => {
            if (response.status === 200) {


              this.setState({
                otp: response.data.otp,
              }, () => { console.log(this.state.otp) })

              console.log("twoFA set to true: " + response.data.otp)
            }
          })

        } else {
          this.setState({ message: "Login Successful! Redirecting you now" })
          this.notify("tc", 5)

          var d = new Date(user.joiningDate)
          console.log(d.toString());
          var c = new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit"
          }).format(d);

          var user = new User(user.userId, user.email, user.firstName, user.lastName, user.joiningDate, user.contactNumber, user.twoFactorAuth)

          localStorage.setItem('isLoggedIn', true)
          localStorage.setItem('user', JSON.stringify(user))

          this.redirect()
        }


      } else if (response.status === 206 || response.status === 204) {
        this.setState({ message: "Invalid login credentials", renderLoading: false }, () => { this.notify("tc", 3) })

      } else if (response.status === 404 || response.status === 500) {
        this.setState({ message: "An error has occured, check your internet settings", renderLoading: false }, () => { this.notify("tc", 3) })
      } else {

      }
    }).then(() => {
      this.setState({
        email: '',
        password: ''
      })
    }).catch((err) => {
      console.log(err.message)
    })

  }

  submitOTP = (event) => {
    event.preventDefault();

    if (this.state.otpInput === this.state.otp) {
      this.setState({ message: "Login Successful! Redirecting you now" },
        () => {

          var user = this.state.user
          var d = new Date(user.joiningDate)
          console.log(d.toString());
          var c = new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit"
          }).format(d);
          var user = new User(user.userId, user.email, user.firstName, user.lastName, user.joiningDate, user.contactNumber, user.twoFactorAuth)
          localStorage.setItem('isLoggedIn', true)
          localStorage.setItem('user', JSON.stringify(user))

          this.notify("tc", 5)
          console.log("Redirecting")
          this.redirect()

        })

    } else {
      this.setState({ message: "Invalid OTP", otpInput: '' }, () => { this.notify("tc", 4) })
    }
  }


  renderOTP() {
    return (
      <div>
        <Spring
          from={{ opacity: 0, marginTop: 500 }}
          to={{ opacity: 1, marginTop: 0 }}
        >
          {props => (
            <div style={props}>
              <Form onSubmit={this.submitOTP}>
                <CardBody>
                  <InputGroup
                    className={
                      "no-border form-control-lg " +
                      (this.state.otpFocus ? "input-group-focus" : "")
                    }
                  >
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="now-ui-icons ui-1_email-85" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      id="otpInput"
                      name="otpInput"
                      type="text"
                      placeholder="6 digit OTP"
                      onFocus={e => this.setState({ otpFocus: true })}
                      onBlur={e => this.setState({ otpFocus: false })}
                      onChange={this.handleUserInput}
                      value={this.state.otpInput}
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
                    onSubmit={this.submitOTP}
                  >
                    Submit
                             </Button>
                  <div className="pull-left">

                  </div>
                  <div className="pull-right">

                  </div>
                </CardFooter>
              </Form>
            </div>
          )}
        </Spring>
      </div>
    )
  }

  renderLoading() {
    return (
      
     <div>
       <center>
       <div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>
      </center>
     </div>
    )
  }

  render() {

    if (this.state.redirect) {
      return <Redirect to="/Admin" />;
    }

   
    return (
      <>
        <Backdrop className={this.useStyles} open={true}>
        <CircularProgress color="inherit" />
        </Backdrop>



        <NotificationAlert ref="notificationAlert" />
        <div className="content">
          <div className="login-page">
            <Container>
              <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
                <Card className="card-login card-plain">
                  <CardHeader>
                    <div className="logo-container">
                      <img src={nowLogo} alt="now-logo" />
                    </div>
                  </CardHeader>
                  {this.state.twoFA ? (


                    this.renderOTP()

                  ) : (
                      <div>
                        <Form onSubmit={this.handleSubmit}>
                          <CardBody>

                          {this.state.renderLoading ? (this.renderLoading()) :(<div><InputGroup
                              className={
                                "no-border form-control-lg " +
                                (this.state.emailFocus ? "input-group-focus" : "")
                              }
                            >
                             

                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="now-ui-icons ui-1_email-85" />
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
                                value={this.state.email}
                              />
                            </InputGroup>
                            <InputGroup
                              className={
                                "no-border form-control-lg " +
                                (this.state.passwordFocus ? "input-group-focus" : "")
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
                                onFocus={e => this.setState({ passwordFocus: true })}
                                onBlur={e => this.setState({ passwordFocus: false })}
                                onChange={this.handleUserInput}
                                value={this.state.password}
                              />
                            </InputGroup></div>)}

                            
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
                        </Form>
                      </div>

                    )}


                </Card>


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

/* //getState from Redux
function mapStateToProps(state) {
  return {
            isLoggedIn: state.isLoggedIn
  }
}

//dispatch action to Redux
function mapDispatchToProps(dispatch) {
  return {
            doLogin: () => {
            dispatch(
              {
                type: 'SIGN_IN'
              }
            )
          }
  }
} */







/* export default connect(mapStateToProps, mapDispatchToProps)(LoginPage); */
export default LoginPage