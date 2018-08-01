import React, { Component } from 'react'
import { Button, Modal, Input, Segment, Rail } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { toggleLoginModal, login } from '../rdc/reducer'
import dataservice from '../srv/dataservice'

class LoginModal extends Component {
  constructor(props) {
  	super(props)
  	this.state = {
  	  email: '',
  	  password: '',
  	  visible: false,
  	  errorMsg: ''
    }
  }

  onChangeHandler = (event) => {
  	console.log(event.target.name, event.target.value)
  	this.setState({ [event.target.name]: event.target.value })
  }

  toggleErrorVisibility = (errorMsg) => {
  	this.setState({ visible: !this.state.visible, errorMsg: errorMsg}, 
  		() => { setTimeout(() => { this.setState({ visible: !this.state.visible, errorMsg: '' }) }, 3000) }
  	)
  }

  submit = async () => {
  	//this.props.registerUser({ email: this.state.email, password: this.state.password })
  	const res = await dataservice.loginUser({ email: this.state.email, password: this.state.password })
  	if (res.status === 200) {
  	  // success
  	  //this.props.login({ token: res.data.token, email: res.data.email })
      window.localStorage.setItem('user', JSON.stringify({ token: res.data.token, email: res.data.email}))
      this.props.login()
  	  this.props.toggleLoginModal()
  	} else {
  	  // fail
  	  this.toggleErrorVisibility(res.error)
  	  console.log(res)
  	}
  }

  render() {
  	const hideWhenVisible = { display: this.state.visible ? '' : 'none' }
    return (
      <Modal size={'small'} open={ this.props.open } onClose={ this.props.toggleLoginModal } dimmer={'blurring'}>
      	<Rail internal attached position='right' size='massive'>
          <Segment inverted color='red' tertiary style={ hideWhenVisible }>
            <h4>{ this.state.errorMsg }</h4>
          </Segment>
        </Rail>
        <Modal.Header>Kirjaudu sisään</Modal.Header>
        <Modal.Content>
          <h3>Sähköposti:</h3>
          <Input fluid={true} placeholder='Sähköposti' size='large' name='email' onChange={ this.onChangeHandler } />
	        <h3>Salasana</h3>
	        <Input fluid={true} placeholder='Salasana' type='password' size='large' name='password' onChange={ this.onChangeHandler } />
        </Modal.Content>
      	<Modal.Actions>
          <Button negative onClick={ this.props.toggleLoginModal }>Sulje</Button>
          <Button positive onClick={ this.submit } icon='checkmark' labelPosition='right' content='Kirjaudu' />
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  	open: state.loginModalOpen
  }
}

export default connect(
  mapStateToProps,
  { toggleLoginModal, login }
)(LoginModal)