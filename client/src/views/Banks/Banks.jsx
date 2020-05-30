import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Table,
    Progress,
    Row,
    Col
} from "reactstrap";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.jsx";

export class Banks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToAddBanks: false
        }
    }

    redirectToAddBanks = () => {
        this.setState({redirectToAddBanks: true})
    }
    render() {
        if (this.state.redirectToAddBanks) {
            return <Redirect to="/admin/addBanks" />;
        }
        return (
            <div>
                <PanelHeader
                    size="sm"

                />
                <Row>
                    <Col xs={12} md={12}>
                        <Card className="card-chart">

                            <CardBody>
                                <center>
                                    <Button color="alert" onClick={this.redirectToAddBanks} className="btn-round btn-icon">
                                        <i className="now-ui-icons ui-1_simple-add" />
                                    </Button>

                                    <h5>Click here to add bank account</h5>
                                </center>


                            </CardBody>

                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Banks
