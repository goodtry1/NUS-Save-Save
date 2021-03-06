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
import { Button, Row, Col, Table } from "reactstrap";


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
import { api } from '../../api-config'

//Sweet alert
import SweetAlert from "react-bootstrap-sweetalert";

class FeedbackPlugin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: "dropdown",
            feedbackDialogOpen: false,
            alert: null,
            show: false,
            recommendation: '',
            totalRecommendationNum: 0,
            submitButtonLoad: false
        };
        this.hideAlert = this.hideAlert.bind(this);
       
       
        
        
        
    }

    /**
     * sets the star for a specific recommendation
     * @param {*} Id - recommendation id
     * @param {*} nextValue - value of stars 0-5
     */
    onStarClick(Id, nextValue) {

        var recommendations = this.state.recommendation
       
       
        for (var i = 0; i < recommendations.length; i++) {
            if (recommendations[i].recommendationId === Id) {
                recommendations[i].rating = nextValue
            }
        }

        this.setState({ recommendation : recommendations})
    }

    /**
     * sets the string feedback to the recommendation
     * @param {*} event - the event triggering this function
     */
    onFeedbackStringChange = (event) => {

        var Id = event.target.id

        var recommendations = this.state.recommendation
       
       
        for (var i = 0; i < recommendations.length; i++) {

            if (recommendations[i].recommendationId == Id) {
                recommendations[i].feedback = event.target.value
            }
        }

        this.setState({ recommendation : recommendations})
    }

    /**
     * sets the recommendation passed down from the parent via props to the state of this component 
     */
    componentDidMount = () => {
        this.setState({ recommendation: this.props.recommendation, totalRecommendationNum: this.props.recommendation.length })


        /* setTimeout(() => {
            this.setState({ classes: "dropdown show" });
      }, 10000); */
    }

    /**
     * shows feedback plugin for the first time
     */
    handleClick = () => {
        if (this.state.classes === "dropdown") {
            this.setState({ classes: "dropdown show" });
        } else {
            this.setState({ classes: "dropdown" });
        }

       
    }

    /**
     * shows popout asking for feedback
     */
    askforFeedback() {
        this.setState({ classes: "dropdown show" });
    }

    /**
     * closes popout
     */
    closeFeedback() {
        this.setState({ classes: "dropdown"})
    }

    
    
    /**
     * user clicks on "Leave your feedback"
     * opens up the feedback dialog to display feedback form for recommendations
     */
    handleClickOpen = () => {
        this.setState({ feedbackDialogOpen: true })
    }

    /**
     * user closes the feedback dialog
     */
    handleClose = () => {
        this.setState({ feedbackDialogOpen: false })
    }

   
    /**
     * user submits feedback
     * data is sent to server via RESTful api
     */
    submitFeedback = () => {

        this.setState({ submitButtonLoad : true})

        var recommendations = this.state.recommendation

        var numFeedbackSubmitted = 0;

        for (var i = 0; i < recommendations.length; i++) {
            var rating = recommendations[i].rating
            var feedback = recommendations[i].feedback
            var recommendationId = recommendations[i].recommendationId
            numFeedbackSubmitted ++

            if (rating === undefined) {
                rating = ""
            }

            if (feedback === undefined) {
                feedback = ""
            }

            axios({
                method: 'post',
                url: `${api}/addFeedback`,
                withCredentials: true,
                data: {
                    recommendationId: recommendationId,
                    feedbackRating: rating,
                    feedbackComment: feedback
                }
            }).then((response) => {
                

                if (response.status === 200) {
                    
                   
                    
                } else {
                    
                }

                if (numFeedbackSubmitted == this.state.totalRecommendationNum) {
                    this.setState({ submitButtonLoad : false})
                    this.handleClose()
                    this.successAlert()
                    this.setState({ classes: "dropdown" })
                }
            }).catch((err) => {
                console.log(err.message)
            }).finally( () => {
                
                
            })

           

           
        }


        

        

        
        
       
    }

    /**
     * show success alert when RESTful api call is successful
     */
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

      /**
       * show failure alert when RESTful api call is unsuccessful
       */
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

      /**
       * hide sweet alert
       */
      hideAlert() {
        this.setState({
          alert: null
        });
      }

    /**
     * render loading button
     */
    renderLoading() {
        return (
    
          <div>
            <Button color="primary"  disabled >
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
            </Button>
          </div>
        )}
    
    /**
     * render feedback plugin and feedback form
     */
    render() {
        return (
            
            <div className="fixed-plugin">
                {this.state.alert}
                <div className={this.state.classes}>
                    <div onClick={this.handleClick}>
                       {/*  <i className="fa fa-comment fa-2x" aria-hidden="true" style={{color: "white"}}/> */}
                       {/* <i className="fa fa-edit fa-2x" aria-hidden="true" style={{color: "white"}}/> */}
                       {/* <i class="fas fa-pencil-alt"></i> */}
                       <i className="far fa-comment-dots fa-2x" style={{color: "white"}}></i>
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
                                {this.state.recommendation? (
                                    <Table responsive>
                                    <tbody>
                                        {this.state.recommendation.map((recommendation) =>
                                        <tr key={recommendation.recommendationId}>
                                          <td> 
                                              {recommendation.recommendation} 
                                              
                                         
                                          <center>
                                                <ReactStars
                                                    name="rate1"
                                                    count={5}
                                                    onChange={this.onStarClick.bind(this, recommendation.recommendationId)}
                                                    size={24}
                                                    value={recommendation.rating}
                                                    half={false}
                                                    color2={'#ffd700'}
                                                />
                                          </center>



                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                id={recommendation.recommendationId.toString()}
                                                name="feedbackString"
                                                label="Additional comments"
                                                type="text"
                                                fullWidth
                                                onChange={this.onFeedbackStringChange}
                                            />
                                          </td>
                                        </tr>)}
                                    
                                        
                                            
                                        
                                    </tbody>
                                    </Table>
                                    
                                ) :(<div></div>)}
                                    

                                   
                                    
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleClose} color="primary">
                                        Cancel
                        </Button>

                                            {this.state.submitButtonLoad? (
                                                this.renderLoading()
                                                ) : (
                                                <Button onClick={this.submitFeedback} color="primary">
                                                    Submit
                                                 </Button>
                                                )}



                                    
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
