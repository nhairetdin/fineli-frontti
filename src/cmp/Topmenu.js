import React, { Component } from 'react'
import { Menu, Button, Dropdown, Icon } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeTab, logout } from '../rdc/reducer'

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
      { key: 1, text: 'Kirjaudu', value: 1 },
      { key: 2, text: 'Uusi tunnus', value: 2 }
    ]

    return (
      <Menu stackable tabular mini="true">
        <Menu.Item
          name="search"
          active={activeItem === 'search'}
          className={'topmenuitem'}
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
            className={'topmenuitem'}
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
          <Menu.Item position="right" className="loginDropdown">
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
          <Menu.Item position="right">
            <span className="textUser">( email@address.fi )</span>
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
  { changeTab, logout }
)(Topmenu)
