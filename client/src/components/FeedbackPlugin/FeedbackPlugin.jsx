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
import StarRatingComponent from 'react-star-rating-component';
import ReactStars from 'react-stars'

class FeedbackPlugin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: "dropdown show",
            bg_checked: true,
            switched: false,
            mini_checked: this.props.mini,
            feedbackDialogOpen: '',
            rating: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.onMiniClick = this.onMiniClick.bind(this);
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({ rating: nextValue });
    }

    handleClick() {
        if (this.state.classes === "dropdown") {
            this.setState({ classes: "dropdown show" });
        } else {
            this.setState({ classes: "dropdown" });
        }
    }

    askForFeedBack = () => {
        /* setTimeout(() => {
            this.setState({ classes: "dropdown show" });
          }, 10000); */
    }
    onMiniClick() {
        this.props.handleMiniClick();
    }

    handleClickOpen = () => {
        this.handleClick()
        this.setState({ feedbackDialogOpen: true })
    }

    handleClose = () => {
        this.setState({ feedbackDialogOpen: false })
    }

    
    render() {
        return (
            <div className="fixed-plugin">
                <div className={this.state.classes}>
                    <div onClick={this.handleClick}>
                        <i className="" />
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
                                            color2={'#ffd700'} />
                                    </center>



                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Additional comments"
                                        type="text"
                                        fullWidth
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleClose} color="primary">
                                        Cancel
                        </Button>
                                    <Button onClick={this.handleClose} color="primary">
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
