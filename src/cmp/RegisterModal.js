import React, { Component } from 'react'
import { Button, Icon, Modal, Input, Segment, Rail } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { toggleRegisterModal, registerUser, login } from '../rdc/reducer'
import dataservice from '../srv/dataservice'

class RegisterModal extends Component {
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
  	const res = await dataservice.registerUser({ email: this.state.email, password: this.state.password })
  	if (res.status === 200) {
  	  // success
  	  window.localStorage.setItem('user', JSON.stringify({ token: res.data.token, email: res.data.email}))
  	  this.props.login()
  	  this.props.toggleRegisterModal()
  	} else {
  	  // fail
  	  this.toggleErrorVisibility(res.error)
  	  console.log(res)
  	}
  }

  render() {
  	const hideWhenVisible = { display: this.state.visible ? '' : 'none' }
    return (
      <Modal size={'small'} open={ this.props.open } onClose={ this.props.toggleRegisterModal } dimmer={'blurring'}>
      	<Rail internal attached position='right' size='massive'>
          <Segment inverted color='red' tertiary style={ hideWhenVisible }>
            <h4>{ this.state.errorMsg }</h4>
          </Segment>
        </Rail>
        <Modal.Header>Uusi käyttäjätunnus</Modal.Header>
        <Modal.Content>
          <h3>Sähköposti:</h3>
          <Input fluid={true} iconPosition='left' placeholder='Sähköposti' size='large' name='email' onChange={ this.onChangeHandler }>
	        <Icon name='at' />
	        <input />
	      </Input>
	      <h3>Salasana: 6 - 60 merkkiä</h3>
	      <Input fluid={true} placeholder='Salasana' type='password' size='large' name='password' onChange={ this.onChangeHandler } />
        </Modal.Content>
      	<Modal.Actions>
          <Button negative onClick={ this.props.toggleRegisterModal }>Sulje</Button>
          <Button positive onClick={ this.submit } icon='checkmark' labelPosition='right' content='Lähetä' />
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  	open: state.registerModalOpen
  }
}

export default connect(
  mapStateToProps,
  { toggleRegisterModal, registerUser, login }
)(RegisterModal)