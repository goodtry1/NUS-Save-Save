import React from "react";
import { api } from '../../api-config'


import bgImage from "assets/img/bg13.jpg";

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

import NotificationAlert from "react-notification-alert";

import CustomNotification from '../../Notifications/CustomNotification'

//Axios
import axios from 'axios'

class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      number: '',
      renderLoading: false
    };
  }

  componentDidMount = () => {
    if (localStorage.getItem('isLoggedIn')) {
      this.setState({ redirect: true })
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("forgetPassword-page");
  }

  notify(place, color) {
    this.refs.notificationAlert.notificationAlert(CustomNotification.notify(place, color, this.state.message));
  }

  handleUserInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  testReset = () => {

    var email = this.state.email;
    var number = this.state.number
    //login["email"] = e.target.value;
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var numberRex = !isNaN(number)


    if (email.length === 0 || number.length < 8) {
      this.setState({ message: 'Please enter your email and phone number' })
      throw new Error()
    } else if (!emailRex.test(email) && !numberRex) {
      this.setState({ message: 'Please enter a correct email and phone number format ' })
      throw new Error()
    } else if (emailRex.test(email) && !numberRex) {
      this.setState({ message: 'Please enter a correct phone number format ' })
      throw new Error()
    } else if (!emailRex.test(email) && numberRex) {
      this.setState({ message: 'Please enter a correct email format ' })
      throw new Error()
    } 

  
  }

  

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({renderLoading : true}, () => {


      
    })

    try {
      this.testReset()
      this.resetViaServer()
    } catch (err) {
      this.setState({renderLoading : false},
        () => {
          setTimeout(() => {
            this.notify('tc', 4)
          }, 200);
        })
    }
  }

  resetViaServer = () => {
    axios({
      method: 'post',
      url: `${api}/resetPassword`,
      data: {
        "email": this.state.email,
        "contactNumber": this.state.number
      }
    }).then((response) => {
      
      if (response.status === 200) {
        this.setState({ message: 'Your password has been reset, check your email for your temporary password' }, () => {this.notify('tc', 5)})
      } else {
        this.setState({ message: 'Your email or phone number does not exist, please try again' }, () => {this.notify('tc', 3)})
      }
    }).catch((err) => {
      this.setState({renderLoading : false, message: 'Your email or phone number does not exist, please try again'}, () => {this.notify('tc', 3)})
     
    })
  }

  renderLoading() {
    return (

      <div>
        <Button color="primary"  disabled size="lg" className="mb-3 btn-round" block>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
        </Button>
      </div>
    )
  }
  

     

  render() {
    return (
      <>
      <NotificationAlert ref="notificationAlert" />
        <div className="content">
          <div className="login-page">
            <Container>
              <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
                <Card className="card-login card-plain">
                  <CardHeader>
                    {/*   <div className="logo-container">
                  <img src={piggyBank} alt="piggy-bank" />

                </div> */}

                    <center><h5 style={{ color: 'white' }}>Reset Password</h5></center>

                  </CardHeader>
                  <Form onSubmit={this.handleSubmit}>
                    <CardBody>

                      <InputGroup
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
                          placeholder="Email (required)"
                          onFocus={e => this.setState({ emailFocus: true })}
                          onBlur={e => this.setState({ emailFocus: false })}
                          onChange={this.handleUserInput}
                          value={this.state.email}
                        />
                      </InputGroup>



                      <InputGroup
                        className={
                          "no-border form-control-lg" +
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
                          onChange={this.handleUserInput}
                          maxLength = "8"
                        />
                      </InputGroup>
                    </CardBody>
                    <CardFooter>
                      {this.state.renderLoading ? (this.renderLoading()) : (<div>

                        <Button
                          type="submit"
                          block
                          color="primary"
                          size="lg"
                          className="mb-3 btn-round"

                        >
                          Reset
                          
                        </Button>
                      </div>)}
                    </CardFooter>
                  </Form>
                </Card>
              </Col>
            </Container>
          </div></div>s

        <div
          className="full-page-background"
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        />

      </>
    )
  }
}

export default ForgetPassword