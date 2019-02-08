import React, { Component } from 'react'
import { connect } from 'react-redux'

class Sum extends Component {
  render() {
    if (this.props.componentItemHover === null) {
      return null
    }

    let result = 0

    if (!this.props.header) {
      result = this.props.row[this.props.componentItemHover.code]
      result = result === null ? 0 : result
    } else {
      result = this.props.componentItemHover.code.toLowerCase()
    }

    return (
      <div style={{ textAlign: 'right' }}>
        { result }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    componentItemHover: state.componentItemHover
  }
}

export default connect(
  mapStateToProps
)(Sum)