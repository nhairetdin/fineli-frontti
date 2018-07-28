import React, { Component } from 'react'
import { Menu, Button } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeTab } from '../rdc/reducer'

class Topmenu extends Component {
  handleItemClick = (activetab) => {
    this.props.changeTab(activetab)
  }

  render() {
  	const activeItem = this.props.activetab

  	return (
  	  <Menu stackable tabular mini='true'>
  	    <Menu.Item
          name='search'
          active={activeItem === 'search'}
          className={'topmenuitem'}
        >
          <Link to="/" onClick={ () => this.handleItemClick('search')}>Search</Link> &nbsp;
        </Menu.Item>

        <Menu.Item
          name='ruokapaivakirja'
          active={activeItem === 'ruokapaivakirja'}
          className={'topmenuitem'}
        >
          <Link to="/ruokapaivakirja" onClick={ () => this.handleItemClick('ruokapaivakirja')}>Ruokapaivakirja</Link> &nbsp;
        </Menu.Item>
  	  </Menu>
  	)
  }
}

const mapStateToProps = (state) => {
  return {
  	activetab: state.activetab
  }
}

export default connect(
  mapStateToProps,
  { changeTab }
)(Topmenu)
