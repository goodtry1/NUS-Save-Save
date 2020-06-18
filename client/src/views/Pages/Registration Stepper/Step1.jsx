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
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";

// core components
import PictureUpload from "components/CustomUpload/PictureUpload.jsx";

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      codeState: '',
      codeCorrect: false,
      message: ''
    };

    this.componentDidMount = () => {
      console.log(this.props.otp)
    }

  }

  codeChange = (e) => {
    this.setState({ code: e.target.value })

    if (e.target.value === this.props.otp) {
      this.setState({ codeCorrect : true})
    }
  }

  isValidated() {
  
    if (!this.state.code || !this.state.codeCorrect) {
      this.setState({ message: "Invalid code" })
      this.setState({ codeState : " has-danger"})
      return false
    } else {
      this.setState({ codeState : " has-success"})
      return true
    }
  }

  render() {

    
    return (
      <>
        <h5 className="info-text">
          {" "}
          Input the code sent to your email
        </h5>
        <Row className="justify-content-center">

          <Col sm="4">
            <InputGroup
              className={
                "form-control-lg" +
                (this.state.codeState ? this.state.codeState : "") +
                (this.state.codeFocus ? " input-group-focus" : "")
              }
            >
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  {/* <i className="now-ui-icons tech_mobile" /> */}
                </InputGroupText>
              </InputGroupAddon>
              <Input
                defaultValue={this.state.code}
                type="text"
                placeholder="6 digit code"
                name="code"
                onFocus={e => this.setState({ codeFocus: true })}
                onBlur={e => this.setState({ codeFocus: false })}
                onChange={e => this.codeChange(e)}
              />
            </InputGroup>
          </Col>







        </Row>


      </>
    );
  }
}

export default Step1;
