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
      number: ''
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

  handleUserInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    /* axios({
      method: 'post',
      url: `${api}/signin`,
      data: {
        "email": this.state.email,
        "password": this.state.password
      }
    }) */
  }

  render() {
    return (
      <>
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