import React from 'react';
import { Modal, Row, Col, Button, Spinner} from 'react-bootstrap';
import {API_GET_ITEMS, API_EDIT_ITEM, API_DELETE_ITEM} from './api';
import axios from 'axios';

class History extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            items: []
        }

        this.handle_editItem = this.handle_editItem.bind(this);
        this.handle_deleteItem = this.handle_deleteItem.bind(this);
        this.uppdateList = this.uppdateList.bind(this);
    }

    componentDidMount(){
        axios.get(`${API_GET_ITEMS}/${localStorage.getItem('localStorage_userId')}`)
        .then(res => {
            if(res.data.findList ){
                this.setState({ items: res.data.items })
            } 
        })   
    }

    handle_editItem(event, _id, _itemName, _amout, _measure, _checked){
        event.preventDefault();

        axios.put(API_EDIT_ITEM, { 
            userId: localStorage.getItem('localStorage_userId'),
            itemId: _id,
            itemName: _itemName,
            amout: _amout,
            measure: _measure,
            checked: _checked
        })
        .then(res => {
            if(res.data.edited){
                this.uppdateList()
            }
        })
    }

    handle_deleteItem(event, _itemId,){
        event.preventDefault();

        axios({
            method: 'delete',
            url: API_DELETE_ITEM,
            data: {
                userId: localStorage.getItem('localStorage_userId'),
                itemId: _itemId
            }
        }).then(res => {
            if(res.data.deleted){
                this.uppdateList()
            }
        })
    }

    uppdateList(){
        axios.get(`${API_GET_ITEMS}/${localStorage.getItem('localStorage_userId')}`)
        .then(res => {
            if(res.data.findList ){
                this.setState({ items: res.data.items })
            } 
        }) 
    }


    render(){
        const { items } = this.state
        
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
                {items ?
                    <Modal.Body>
                        {items.map(item =>
                            <div key={item.itemId}>
                                {item.checked?
                                    <Row key={item.itemId} className="mb-4 list_item">
                                        <Col xs={2} sm={2} md={1} lg={1} xl={1} className="d-flex justify-content-left align-items-center">
                                            <Button size="md" variant="danger" onClick={(event) => this.handle_editItem(event, item.itemId, item.itemName, item.amout, item.measure, false)}><i className="fa fa-close" /></Button>
                                        </Col>

                                        <Col xs={7} sm={7} md={7} lg={8} xl={8} className="d-flex justify-content-left align-items-center" style={{minHeight: '50px'}}>
                                            {item.itemName}                              
                                        </Col>
                                        <Col xs={1} sm={1} md={2} lg={2} xl={2} className="d-flex justify-content-center align-items-center">
                                            {item.amout}<i style={{fontSize: '5px', margin: '0 2px'}} className="fa fa-window-minimize" />{item.measure}
                                        </Col>

                                        <Col xs={2} sm={2} md={2} lg={1} xl={1} className="d-flex justify-content-center align-items-center">
                                        
                                        <Button size="sm" variant="outline-danger" onClick={(event) => this.handle_deleteItem(event, item.itemId)}><i className="fa fa-trash" /></Button>
                                        
                                        </Col>
                                    </Row> 
                                    :
                                    ""
                                }
                            </div>
                        )}
                    </Modal.Body>
                    :
                    <Modal.Body>
                            <Spinner animation="border" variant="primary" />
                    </Modal.Body>
                    }

                <Modal.Footer >
                    <div className="new_item_save_btn">
                        <Button variant="primary" style={{marginRight: '10px'}} onClick={this.uppdateList}><i className="fa fa-refresh" /> UPPDATERA</Button>
                        <Button variant="outline-danger" onClick={this.props.onHide}><i className="fa fa-close" /> STÄNG</Button>
                    </div>
                    
                </Modal.Footer>
            </Modal>
        );
    }
}
export default History;