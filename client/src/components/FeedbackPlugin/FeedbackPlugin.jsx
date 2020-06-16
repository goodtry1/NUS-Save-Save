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
/*eslint-disable*/
import React, { Component } from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
// react plugin used to create switch buttons
import { Button, Row, Col } from "reactstrap";


//Feedback dialog
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactStars from 'react-stars'

//Axios
import axios from 'axios'

//Sweet alert
import SweetAlert from "react-bootstrap-sweetalert";

class FeedbackPlugin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: "dropdown",
            feedbackDialogOpen: '',
            rating: '',
            feedbackString: '',
            alert: null,
            show: false
        };
        this.hideAlert = this.hideAlert.bind(this);
       
       
        
        
        
    }

    onStarClick(nextValue) {
        this.setState({ rating: nextValue });
    }

    onFeedbackStringChange = (event) => {

        this.setState({
            [event.target.name]: event.target.value,
          });
    }

    componentDidMount = () => {
        /* setTimeout(() => {
            this.setState({ classes: "dropdown show" });
      }, 10000); */
    }

    handleClick = () => {
        if (this.state.classes === "dropdown") {
            this.setState({ classes: "dropdown show" });
        } else {
            this.setState({ classes: "dropdown" });
        }

       
    }

    askforFeedback() {
        this.setState({ classes: "dropdown show" });
    }

    
    

    handleClickOpen = () => {
        this.setState({ feedbackDialogOpen: true })
    }

    handleClose = () => {
        this.setState({ feedbackDialogOpen: false })
    }

   

    submitFeedback = () => {
        var rating = this.state.rating
        var feedbackString = this.state.feedbackString

        this.setState({
            rating: '',
            feedbackString: ''
        })

        console.log(rating + " " + feedbackString)
        
        axios({
            method: 'post',
            url: '/addFeedback',
            data: {
                sessionId: this.props.sessionId,
                feedbackRating: rating,
                feedbackComment: feedbackString
            }
        }).then((response) => {
            console.log(response)
            if (response.status === 200) {
                this.handleClose()
                this.successAlert()
                
            } else {
                
            }
        }).catch((err) => {
            console.log(err.message)
        }).finally( () => {
            this.setState({ classes: "dropdown" })
        })
    }

    successAlert = () => {
        this.setState({
          alert: (
            <SweetAlert
              success
              style={{ display: "block", marginTop: "-100px" }}
              title="Feedback Submitted"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnBsStyle="info"
            >
              Thank you for your feedback
            </SweetAlert>
          )
        });
      }

      failureAlert() {
        this.setState({
          alert: (
            <SweetAlert
              danger
              style={{ display: "block", marginTop: "-100px" }}
              title="An error has occured"
              onConfirm={() => this.hideAlert()}
              onCancel={() => this.hideAlert()}
              confirmBtnBsStyle="info"
            >
              Please try again later
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
            
            <div className="fixed-plugin">
                {this.state.alert}
                <div className={this.state.classes}>
                    <div onClick={this.handleClick}>
                        <i className="fa fa-cog fa-2x" />
                    </div>
                    <ul className="dropdown-menu show">
                        <li className="header-title">
                            <Row>
                                <Col md='9'></Col>
                                <Col md='2'>
                                
                                <button onClick={this.handleClick} style={dialogCloseButtonStyle}>x</button>
                                </Col>

                                <Col md='12'>
                                Help us improve by giving us your feedback
                                </Col>
                            </Row>

                           
                             
                        </li>
                        <li className="adjustments-line"></li>
                        <li className="adjustments-line">
                             
                            <center> <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                                Leave your feedback
                            </Button></center>

                            

                            <Dialog open={this.state.feedbackDialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title" fullWidth>
                                <DialogTitle id="form-dialog-title">Leave your feedback</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Your feedback is important to help us improve! Let us know if the recommendations given helped you. We appreciate your time.
                                        
                        </DialogContentText>

                                    How did we do?
                                    <center>
                                        <ReactStars
                                            count={5}
                                            onChange={this.onStarClick.bind(this)}
                                            size={24}
                                            value={this.state.rating}
                                            half={false}
                                            color2={'#ffd700'}
                                             />
                                    </center>



                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="feedbackString"
                                        name="feedbackString"
                                        label="Additional comments"
                                        type="text"
                                        fullWidth
                                        onChange={this.onFeedbackStringChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleClose} color="primary">
                                        Cancel
                        </Button>
                                    <Button onClick={this.submitFeedback} color="primary">
                                        Submit
                        </Button>
                                </DialogActions>
                            </Dialog>
                        </li>
                        

                        
                        <li className="adjustments-line"></li>

                        

                        







                    </ul>
                </div>
            </div>
        );
    }
}

FeedbackPlugin.defaultProps = {
    sidebarMini: true,
    handleMiniClick: () => { },
    bgColor: "blue",
    handleColorClick: () => { }
};

FeedbackPlugin.propTypes = {
    // background color for the Sidebar component
    bgColor: PropTypes.oneOf(["blue", "yellow", "green", "orange", "red"]),
    // function that is called upon pressing the button near the logo
    handleMiniClick: PropTypes.func,
    // bool variable to know if the Sidebar component is minimized or not
    sidebarMini: PropTypes.bool,
    // function that returns the selected color for the Sidebar background
    handleColorClick: PropTypes.func
};

const dialogCloseButtonStyle = {
    marginBottom: '15px',
    padding: '3px 8px',
    cursor: 'pointer',
    borderRadius: '50%',
    border: 'none',
    width: '30px',
    height: '30px',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
}

export default FeedbackPlugin;
