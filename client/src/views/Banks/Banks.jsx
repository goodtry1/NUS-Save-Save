import React, { Component } from 'react'

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
    render() {
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
                                    <Button color="alert" className="btn-round btn-icon">
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
