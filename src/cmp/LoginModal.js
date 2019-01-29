import React, { Component } from 'react'
import { Button, Modal, Segment, Rail, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { toggleLoginModal, login, setSuggestedAmounts, setUserMeals } from '../rdc/reducer'
import dataservice from '../srv/dataservice'

// Login popup
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

  onChangeHandler = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  // Display error text if login fails
  toggleErrorVisibility = errorMsg => {
    this.setState({ visible: !this.state.visible, errorMsg: errorMsg }, () => {
      setTimeout(() => {
        this.setState({ visible: !this.state.visible, errorMsg: '' })
      }, 3000)
    })
  }

  // Called when login button is clicked
  submit = async () => {
    const user = await dataservice.loginUser({
      email: this.state.email,
      password: this.state.password
    })
    if (!user.error) {
      window.localStorage.setItem('user', JSON.stringify({ token: user.data.token, email: user.data.email }))
      this.props.login()
      const userdata = await dataservice.loadUserdata(user.data.token)
      if (!userdata.error) {
        this.props.setSuggestedAmounts(userdata.data[0])
        this.props.setUserMeals(userdata.data[1])
        this.props.toggleLoginModal()
      } else {
        this.toggleErrorVisibility(userdata.error)
      }
    } else {
      this.toggleErrorVisibility(user.error)
    }
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? '' : 'none' }
    return (
      <Modal size={'small'} open={this.props.open} onClose={this.props.toggleLoginModal} dimmer={'blurring'}>
        <Rail internal attached position="right" size="massive">
          <Segment inverted color="red" tertiary style={hideWhenVisible}>
            <h4>{this.state.errorMsg}</h4>
          </Segment>
        </Rail>
        <Modal.Header>Kirjaudu sisään</Modal.Header>
        <Modal.Content>
          <Form size='large'>
            <Form.Field>
              <label>Sähköposti</label>
              <input name="email" onChange={this.onChangeHandler} placeholder="Sähköposti..." />
            </Form.Field>
            <Form.Field>
              <label>Salasana</label>
              <input name="password" onChange={this.onChangeHandler} type="password" placeholder="Salasana..." />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.props.toggleLoginModal} icon="close" labelPosition="right" content="Sulje" />
          <Button positive onClick={this.submit} icon="checkmark" labelPosition="right" content="Kirjaudu" />
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    open: state.loginModalOpen
  }
}

export default connect(
  mapStateToProps,
  { toggleLoginModal, login, setSuggestedAmounts, setUserMeals }
)(LoginModal)
