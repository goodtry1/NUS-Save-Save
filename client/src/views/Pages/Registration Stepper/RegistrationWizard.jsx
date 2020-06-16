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
import React, { Component } from "react";
// react plugin used to create a form with multiple steps
import ReactWizard from "react-bootstrap-wizard";

// reactstrap components
import { Col } from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

import Step1 from "../../Pages/Registration Stepper/Step1";
import Step2 from "../../Pages/Registration Stepper/Step2";

var steps = [
  {
    stepName: "Verification",
    stepIcon: "now-ui-icons ui-1_email-85",
    component: Step1
  },
  {
    stepName: "Preferences",
    stepIcon: "now-ui-icons business_bank",
    component: Step2
  },
 
];

class Wizard extends Component {
  render() {
    return (
      <>
        <div className="" >
          <Col xs={12} md={10} className="mr-auto ml-auto">
            <ReactWizard
              steps={steps}
              navSteps
              validate
              title=""
              description="We're almost there, let us verify your email address and get to know your banking preferences"
              headerTextCenter
              color="black"
              finishButtonClasses="btn-wd"
              nextButtonClasses="btn-wd"
              previousButtonClasses="btn-wd"
            />
          </Col>
        </div>
      </>
    );
  }
}

export default Wizard;
