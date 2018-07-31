import React, { Component } from 'react'
import { Menu, Button, Dropdown, Icon, Modal } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeTab, logout, toggleRegisterModal } from '../rdc/reducer'
import RegisterModal from './RegisterModal'

class Topmenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }
  }
  handleItemClick = activetab => {
    this.props.changeTab(activetab)
  }

  handleLogoutClick = activetab => {
    this.props.logout(activetab)
  }

  modalSignInToggle = () => {
    console.log("test")
    this.setState({ modal: !this.state.modal })
  }

  render() {
    const activeItem = this.props.activetab
    const options = [
      { key: 1, text: 'Kirjaudu', value: 1 },
      { key: 2, text: 'Uusi tunnus', value: 2, onClick: this.props.toggleRegisterModal }
    ]

    return (
      <Menu stackable tabular mini="true">
        <SignInModal open={ this.state.modal } onClose={ this.modalSignInToggle } />
        <RegisterModal />
        <Menu.Item
          name="search"
          active={activeItem === 'search'}
          className={'topmenuitem clearTopBorder'}
        >
          <Link to="/" onClick={() => this.handleItemClick('search')}>
            Search
          </Link>{' '}
          &nbsp;
        </Menu.Item>
        {this.props.user ? (
          <Menu.Item
            name="ruokapaivakirja"
            active={activeItem === 'ruokapaivakirja'}
            className={'topmenuitem clearTopBorder'}
          >
            <Link
              to="/ruokapaivakirja"
              onClick={() => this.handleItemClick('ruokapaivakirja')}
            >
              Ruokapaivakirja
            </Link>{' '}
            &nbsp;
          </Menu.Item>
        ) : null}

        {!this.props.user ? (
          <Menu.Item position="right" className="loginDropdown clearTopBorder">
            <Dropdown
              options={options}
              trigger={
                <span>
                  <Icon name="user" />
                  Kirjaudu
                </span>
              }
            />
          </Menu.Item>
        ) : (
          <Menu.Item position="right" className="clearTopBorder">
            <span className="textUser">({ this.props.user.email })</span>
            <Link to="/" onClick={() => this.handleLogoutClick('search')}>
              Kirjaudu ulos
            </Link>{' '}
            &nbsp;
          </Menu.Item>
        )}
      </Menu>
    )
  }
}

const SignInModal = ({ open, onClose }) => (
  <Modal open={ open } onClose={ onClose } dimmer={'blurring'}>
    <Modal.Content>
      <h1>Modali, h1</h1>
    </Modal.Content>
  </Modal>
)

const mapStateToProps = state => {
  return {
    activetab: state.activetab,
    user: state.user,
    registerModalOpen: state.registerModalOpen
  }
}

export default connect(
  mapStateToProps,
  { changeTab, logout, toggleRegisterModal }
)(Topmenu)
