import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Pin extends Component {
  render() {
    const foodrow = this.props.row.original
    const pin = (<Icon disabled name="pin" onClick={ () => this.props.onClick(this.props.row)} />)

    if (foodrow.pinned) {
      return pin
    }

    if (!this.props.foodItemHover || !this.props.foodItemHover[0]){
      return null
    }

    if (this.props.foodItemHover[0].foodid === foodrow.foodid) {
      return pin
    }

    return null
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