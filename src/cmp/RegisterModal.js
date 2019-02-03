import React, { Component } from 'react'
import { Button, Modal, Segment, Rail, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { toggleRegisterModal, login, setSuggestedAmounts, setUserMeals } from '../rdc/reducer'
import dataservice from '../srv/dataservice'

// Modal screen for register
class RegisterModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      gender: 'male', // Male set as default
      visible: false,
      errorMsg: '',
      options: [
        { key: 'm', text: 'Mies', value: 'male' },
        { key: 'f', text: 'Nainen', value: 'female' }
      ]
    }
  }

  // Update state when input field contents change
  onChangeHandler = event => {
    this.setState({ [event.target.name]: event.target.value })
  }
  // Is user Male/Female, store selection in state
  onSelectChange = (e, { value }) => this.setState({ gender: value })

  // Error will be displayed if server returns error (bad email / pass or backend fail)
  toggleErrorVisibility = errorMsg => {
    this.setState({ visible: !this.state.visible, errorMsg: errorMsg }, () => {
      setTimeout(() => {
        this.setState({ visible: !this.state.visible, errorMsg: '' })
      }, 3000)
    })
  }

  // On submit, if no error is returned, set user token and email in localStorage,
  // then make another request for downloading users personal data and pass token in.
  // If userdata is successfully received, set it in application state (redux store in this case).
  // Also display appropriate error messages if needed
  submit = async () => {
    const user = await dataservice.registerUser({
      email: this.state.email,
      password: this.state.password,
      gender: this.state.gender
    })
    if (!user.error) {
      window.localStorage.setItem('user', JSON.stringify({ token: user.data.token, email: user.data.email }))
      this.props.login()
      const userdata = await dataservice.loadUserdata(user.data.token)
      if (!userdata.error) {
        this.props.setSuggestedAmounts(userdata.data[0])
        this.props.setUserMeals(userdata.data[1])
        this.props.toggleRegisterModal()
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
      <Modal size={'small'} open={this.props.open} onClose={this.props.toggleRegisterModal} dimmer={'blurring'}>
        <Rail internal attached position="right" size="massive">
          <Segment inverted color="red" tertiary style={hideWhenVisible}>
            <h4>{this.state.errorMsg}</h4>
          </Segment>
        </Rail>
        <Modal.Header>Uusi käyttäjätunnus</Modal.Header>
        <Segment inverted color="red" secondary>
          <h4>Kehitysvaiheessa, tietokanta nollataan ennen lopullista versiota.</h4>
        </Segment>
        <Modal.Content>
          <Form size='large'>
            <Form.Field>
              <label>Sähköposti</label>
              <input name="email" onChange={ this.onChangeHandler } placeholder='Sähköposti...' />
            </Form.Field>
            <Form.Field>
              <label>Salasana</label>
              <input name="password" onChange={ this.onChangeHandler } type="password" placeholder='Salasana...' />
            </Form.Field>
            <Form.Select 
              fluid label='Sukupuoli' 
              options={this.state.options} 
              placeholder='Mies' 
              onChange={ this.onSelectChange } 
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.props.toggleRegisterModal} icon="close" labelPosition="right" content="Sulje" />
          <Button positive onClick={this.submit} icon="checkmark" labelPosition="right" content="Lähetä" />
        </Modal.Actions>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    open: state.registerModalOpen
  }
}

export default connect(
  mapStateToProps,
  {
    toggleRegisterModal,
    login,
    setSuggestedAmounts,
    setUserMeals
  }
)(RegisterModal)
