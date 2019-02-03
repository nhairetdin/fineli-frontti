import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Pin extends Component {
  render() {
    //const pin = this.props.row.original.pinned ? (<Icon disabled name="pin" />) : null
    let pin = null
    const foodrow = this.props.row.original

    if (foodrow.pinned) {
      pin = (<Icon disabled name="pin" onClick={ () => this.props.onClick(this.props.row)} />)
    } else if (this.props.foodItemHover) {
      if (this.props.foodItemHover[0].foodid === foodrow.foodid) {
        pin = (<Icon disabled name="pin" onClick={ () => this.props.onClick(this.props.row)} />)
      }
    }

    return pin
  }
}

const mapStateToProps = (state) => {
  return {
    foodItemHover: state.foodItemHover
  }
}

export default connect(
  mapStateToProps
)(Pin)