import React from 'react';
import { Navbar, Container, Spinner, ButtonGroup, Row, Col, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { API_GET_ITEMS, API_EDIT_ITEM, API_DELETE_ITEM} from './api';
import CreateNewItem from './new_item';
import History from './history';
import logo_img from '../images/logo.png';

class ItemsList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            error: false,
            username: this.props.username,
            userId:  this.props.userId,
            modalNewItem: false,
            modalHistory: false,
            items:  []
           
        };

        this.handle_logout = this.handle_logout.bind(this);
        this.handle_editItem = this.handle_editItem.bind(this);
        this.setModalShow = this.setModalShow.bind(this);
        this.handle_deleteItem = this.handle_deleteItem.bind(this);
        
    }

    componentDidMount(){
       axios.get(`${API_GET_ITEMS}/${this.state.userId}`)
        .then(res => {
            if(res.data.findList ){
                this.setState({ items: res.data.items })
            } 
        })   
    }

    


    handle_logout(event){
        event.preventDefault();
        localStorage.setItem('locarStorage_loggedIn', false);
        localStorage.setItem('localStorage_userId', "");
        localStorage.setItem('localStorage_username', "");
        window.location.reload(false);
    }

    handle_editItem(event, _id, _itemName, _amout, _measure, _checked){
        event.preventDefault();
        try{
            axios.put(API_EDIT_ITEM, { 
                userId: this.state.userId,
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
        }catch (err) {
            this.setState({
                error: true
            })

            setTimeout(() => {
                this.setState({
                    error: false
                })
            }, 5000)
        }
        
    }
    
    handle_deleteItem(event, _itemId,){
        event.preventDefault();

        axios({
            method: 'delete',
            url: API_DELETE_ITEM,
            data: {
                userId: this.state.userId,
                itemId: _itemId
            }
        })
        .then(res => {
            if(res.data.deleted){
                this.uppdateList()
            }
        })
    }

    setModalShow(_modal, _component){
        if(_component === "modalHistory"){
            this.setState({modalHistory: _modal});
            this.uppdateList();
        }

        if(_component === "modalNewItem"){
            this.setState({modalNewItem: _modal});
            this.uppdateList();
        }
        
    }

    uppdateList(){
        axios.get(`${API_GET_ITEMS}/${this.state.userId}`)
        .then(res => {
            if(res.data.findList ){
                this.setState({ items: res.data.items })
            } 
        }) 
    }

    render(){
        const {error, items, modalNewItem, modalHistory} = this.state
        const user_icon = <i className="fa fa-user" style={{fontSize:'26px'}}/>;
        if(error){
            return (
                <div className="app_loading">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        }
        else if(items){
            return(
                <div className="shopping_app_list">
                    <Navbar bg="light" ariant="light" className="mb-3 shopping_app_nav" style={{borderBottom: '1px solid #7777774b'}}>
                        <Container>
                            <Navbar.Brand>
                                <img
                                    alt=""
                                    src={logo_img}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                />{}
                                {' ' + this.state.username}
                            </Navbar.Brand>
                            <Navbar.Collapse className="justify-content-end">
                                <ButtonGroup>
                                    <DropdownButton variant="outline-primary" as={ButtonGroup} title={user_icon} id="bg-nested-dropdown">
                                        <Dropdown.Item eventKey="1" onClick={this.handle_logout}>Logga ut</Dropdown.Item>
                                    </DropdownButton>
                                    <Button variant="primary" onClick={() => this.setModalShow(true, 'modalHistory')}>Historik</Button>
                                </ButtonGroup>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                    
                    {items.map(item =>
                        <Container key={item.itemId}>
                            {!item.checked?
                                <Row key={item.itemId} className="mb-4 list_item">
                                    <Col xs={2} sm={2} md={1} lg={1} xl={1} className="d-flex justify-content-left align-items-center">
                                        <Button size="md" variant="success" onClick={(event) => this.handle_editItem(event, item.itemId, item.itemName, item.amout, item.measure, true)}><i className="fa fa-check" /></Button>
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
                        </Container>
                    )}

                    <Container>
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={5} xl={5}></Col>
                            <Col xs={4} sm={4} md={4} lg={2} xl={2}>
                                <Row>
                                <Button size="md" variant="primary" onClick={() => this.setModalShow(true, 'modalNewItem')}><i className="fa fa-plus" /></Button>
                                </Row>
                            </Col>
                        </Row>
                    </Container>

                    <CreateNewItem
                        show={modalNewItem}
                        onHide={() => this.setModalShow(false, 'modalNewItem')}
                    />

                    <History
                        show={modalHistory}
                        onHide={() => this.setModalShow(false, 'modalHistory')}
                    />
                </div>
            );
        }
        else {
            return (
                <div className="app_loading">
                    <Spinner animation="border" variant="primary" />
                </div>
            )
        }
    }
}
export default ItemsList;