import React, { Component } from 'react'
import { Menu, Dropdown, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeTab, logout, toggleRegisterModal, toggleLoginModal } from '../rdc/reducer'
import RegisterModal from './RegisterModal'
import LoginModal from './LoginModal'

class Topmenu extends Component {
  handleItemClick = activetab => {
    this.props.changeTab(activetab)
  }

  handleLogoutClick = activetab => {
    this.props.logout(activetab)
  }

  render() {
    const activeItem = this.props.activetab
    const options = [
      { key: 1, text: 'Kirjaudu', value: 1, onClick: this.props.toggleLoginModal },
      { key: 2, text: 'Uusi tunnus', value: 2, onClick: this.props.toggleRegisterModal }
    ]

    return (
      <Menu stackable tabular mini="true">
        <RegisterModal />
        <LoginModal />
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

const mapStateToProps = state => {
  return {
    activetab: state.activetab,
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { changeTab, logout, toggleRegisterModal, toggleLoginModal }
)(Topmenu)
