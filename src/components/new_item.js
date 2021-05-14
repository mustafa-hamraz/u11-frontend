import React from 'react';
import { Modal, Form, Row, Col, Button} from 'react-bootstrap';
import {API_NEW_ITEM} from './api';
import axios from 'axios';

class CreateNewItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            itemName: '',
            amout: '',
            measure: '',
            checked: false

        }

        this.handleItemNameChange = this.handleItemNameChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleMeasureChange = this.handleMeasureChange.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
    }

    handleItemNameChange(e) {
        this.setState({itemName: e.target.value});
    }
    handleAmountChange(e) {
        this.setState({amout: e.target.value});
    }
    handleMeasureChange(e) {
        this.setState({measure: e.target.value});
    }

    handleSaveClick(e){
        e.preventDefault();

        if(this.state.itemName.length > 1){
            axios.post(API_NEW_ITEM, { 
                userId: localStorage.getItem('localStorage_userId'),
                itemName: this.state.itemName,
                amout: this.state.amout,
                measure: this.state.measure,
                checked: false
            })
            .then(res => {
                if(res.data.added){
                    this.setState({
                        itemName: '',
                        amout: '',
                        measure: ''
                    })
                }
            })
        }
    }

    render(){
        return (
            <Modal
                {...this.props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <div className="new_item_close_btn">
                        <Button  variant="secondary" onClick={this.props.onHide}><i className="fa fa-close" /></Button>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{marginBottom: '10px'}}>
                            <Form.Control 
                                type="text"
                                size="lg" 
                                value={this.state.itemName}
                                onChange={this.handleItemNameChange}
                                placeholder="t.ex. äpple"
                            />
                        </Col>

                        <Col xs={6} sm={6} md={6} lg={2} xl={2}>
                            <Form.Control 
                                type="text"
                                size="lg" 
                                value={this.state.amout}
                                onChange={this.handleAmountChange}
                                placeholder="t.ex. 2"
                            />
                        </Col>

                        <Col xs={6} sm={6} md={6} lg={2} xl={2}>
                            <Form.Control 
                                as="select" 
                                size="lg" 
                                value={this.state.measure}
                                onChange={this.handleMeasureChange}
                            >
                                <option>st</option>
                                <option>kg</option>
                                <option>par</option>
                                <option>kr</option>
                                <option>klockan</option>
                            </Form.Control>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer >
                    <div className="new_item_save_btn">
                        <Button variant="primary" style={{marginRight: '10px'}} onClick={this.handleSaveClick}><i className="fa fa-save" /> SPARA</Button>
                        <Button variant="outline-danger" onClick={this.props.onHide}><i className="fa fa-close" /> STÄNG</Button>
                    </div>
                    
                </Modal.Footer>
            </Modal>
        );
    }
}
export default CreateNewItem;