import './App.css';
import { Container, Row, Col, InputGroup,FormControl, Button, Badge } from 'react-bootstrap';
import checkmark from './images/checkmark.png';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(){
    super()
    this.state = {
      username: '',
      password: '',
      userExist: false,
      wrongLogin: false,
      userId: '',

    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handleLogin() {

    axios({
      method: 'post',
      url: 'http://localhost:5000/login',
      data: {
        username: this.state.username,
        password: this.state.password 
      }
    })
    .then(res => {
      if(res.data.exist === true ){
        this.setState({
          userExist: res.data.exist,
          userId: res.data.userId,
          wrongLogin: false
        });
      }
      else {
        this.setState({
          userExist: false,
          wrongLogin: true,
          userId: ""
        });
      }

    });
  }

  render(){
  const {username, userExist, wrongLogin, userId } = this.state

    return (
      <div className="shopping_app">
        <loginPage />
      </div>
    );
  }
}
export default App;


const loginPage = (<Container>
  <Row>
    <Col xs={1} sm={1} md={2} lg={3} xl={4}></Col>

    <Col xs={10} sm={10} md={8} lg={6} xl={4}>
      <img className="w-100 mb-3 mt-1" style={{opacity: '0.75'}} src={checkmark} alt="check mark" />
    </Col>
  </Row>
  <Row>
    <Col xs={1} sm={1} md={2} lg={3} xl={4}></Col>

    <Col xs={10} sm={10} md={8} lg={6} xl={4}>
      <InputGroup className="mb-2">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1"><i className="fa fa-user" style={{fontSize:'36px'}}/></InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="Användarnamn"
          aria-label="Username"
          aria-describedby="basic-addon1"
          value={this.state.username}
          onChange={this.handleUsernameChange}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1"><i className="fa fa-lock" style={{fontSize:'40px'}}/></InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          type="password"
          placeholder="Lösenord"
          aria-label="Password"
          aria-describedby="basic-addon2"
          value={this.state.password}
          onChange={this.handlePasswordChange}
        />
      </InputGroup>

      { wrongLogin ?
        <p style={{color: 'red', fontSize: '12px'}}>Fel uppgifter!  Du kan enkelt skapa nytt konto.</p>
        :
        ''
      }

      <Button variant="warning" size="lg" className="mb-2 w-100" type="submit" onClick={this.handleLogin}>
        Logga in
      </Button>
      <Button variant="outline-secondary"  size="lg" className="w-100" >Registrera</Button>
    </Col> 
  </Row>
  </Container>);