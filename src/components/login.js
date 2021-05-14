import React from 'react';
import axios from 'axios';
import { Container, Row, Col, InputGroup,FormControl, Button } from 'react-bootstrap';
import {API_LOGIN, API_CREATE_ACCOUNT} from './api';
import ItemsList from './itemsList';
import checkmark from '../images/checkmark.jpg';


class Login extends React.Component {
  constructor(){
    super()
    this.state = {
      username: '',
      password: '',
      password_2: '',
      userExist: false,
      loggedIn: false,
      wrongLogin: false,
      registering: false,
      userId: '',

    }

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);

    this.handleRegister = this.handleRegister.bind(this);
    this.changeViewToRegister = this.changeViewToRegister.bind(this);
    
    this.handleLogin = this.handleLogin.bind(this);
    this.changeViewToLogin = this.changeViewToLogin.bind(this);
  }

  componentDidMount(){
    let locarStorage_loggedIn = localStorage.getItem('locarStorage_loggedIn');
    let localStorage_userId = localStorage.getItem('localStorage_userId');
    let localStorage_username = localStorage.getItem('localStorage_username', this.state.username);

    if(locarStorage_loggedIn){
      if(localStorage_userId.length > 1){
        this.setState({
          loggedIn: true,
          userId: localStorage_userId,
          username: localStorage_username
        })
      }
    }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value});
  }

  handlePassword2Change(e) {
    this.setState({password_2: e.target.value});
  }

  handleRegister(event){
    event.preventDefault();

    if(this.state.password === this.state.password_2){
      axios({
        method: 'post',
        url: API_CREATE_ACCOUNT,
        data: {
          username: this.state.username,
          password: this.state.password 
        }
      })
      .then(res => {
        if(res.data.userAdded === true ){
          this.setState({
            userId: res.data.userId,
            wrongLogin: false,
            loggedIn: true,
          });

          localStorage.setItem('locarStorage_loggedIn', true);
          localStorage.setItem('localStorage_userId', this.state.userId);
          localStorage.setItem('localStorage_username', this.state.username);
        }
        else {
          this.setState({
            wrongLogin: true,
            loggedIn: false,
            userId: ""
          });

          localStorage.setItem('locarStorage_loggedIn', false);
          localStorage.setItem('localStorage_userId', this.state.userId);
          localStorage.setItem('localStorage_username', this.state.username);
        }
      });
    }

    else {
      this.setState({
        wrongLogin: true,
      })
    }
  }

  handleLogin(event) {
    event.preventDefault();

    if(this.state.username.length > 1){
      axios({
        method: 'post',
        url: API_LOGIN,
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
            wrongLogin: false,
            loggedIn: true,
          });

          localStorage.setItem('locarStorage_loggedIn', true);
          localStorage.setItem('localStorage_userId', this.state.userId);
          localStorage.setItem('localStorage_username', this.state.username);
        }
        else {
          this.setState({
            userExist: false,
            wrongLogin: true,
            loggedIn: false,
            userId: ""
          });

          localStorage.setItem('locarStorage_loggedIn', false);
          localStorage.setItem('localStorage_userId', this.state.userId);
          localStorage.setItem('localStorage_username', this.state.username);
        }
      });
    }

    else {
      this.setState({
        wrongLogin: true,
      })
    }

  }

  changeViewToRegister(event) {
    event.preventDefault();
    this.setState({
      wrongLogin: false,
      loggedIn: false,
      registering: true,
    });
  }

  changeViewToLogin(event) {
    event.preventDefault();
    this.setState({
      wrongLogin: false,
      loggedIn: false,
      registering: false,
    });
  }


  render(){
  const {username, wrongLogin, userId, registering, loggedIn} = this.state

    if(loggedIn){
      return(
        <ItemsList
            userId = {userId}
            username = {username}
        />
      )
    }else {
      return (
        <div className="shopping_app_login">
          <Container>
            <Row>
              <Col xs={1} sm={1} md={2} lg={3} xl={4}></Col>

              <Col xs={10} sm={10} md={8} lg={6} xl={4}>
                <img className="w-100 mb-3 mt-1" src={checkmark} alt="check mark" />
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

                <InputGroup className="mb-2">
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

                {registering ?
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1"><i className="fa fa-lock" style={{fontSize:'40px'}}/></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      type="password"
                      placeholder="Ange lösenordet igen"
                      aria-label="Password_2"
                      aria-describedby="basic-addon2"
                      value={this.state.password_2}
                      onChange={this.handlePassword2Change}
                    />
                  </InputGroup>: ""}

                { wrongLogin ?
                  <p style={{color: 'red', fontSize: '12px'}}>Fel uppgifter!</p>
                  :
                  ''
                }

                
                
                {registering ?
                  <>
                    <Button variant="primary"  size="lg" className="w-100 mb-2" onClick={this.handleRegister}>Registrera</Button>
                    <Button variant="outline-secondary"  size="lg" className="w-100" onClick={this.changeViewToLogin}>Logga in</Button>
                  </>
                  :
                  <>
                    <Button variant="primary" size="lg" className="mb-2 mt-2 w-100" type="submit" onClick={this.handleLogin}>Logga in</Button>
                    <Button variant="outline-secondary"  size="lg" className="w-100" onClick={this.changeViewToRegister}>Registrera</Button>
                  </>
                }
                
              </Col> 
            </Row>
          </Container>
        </div>
      );
    }
  }
}
export default Login;