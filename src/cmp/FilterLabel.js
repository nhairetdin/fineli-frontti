import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react'

// This is the component that displays a yellow bar and %-value of a
// selected items relative share for each foodcomponent (enerc, prot, fat and so on)
// on the left, the filters area
class FilterLabel extends Component {
  calculatePercentage = (recommendedvalue, componentvalue) => {
    if (recommendedvalue === null || componentvalue === null || componentvalue === 0 || recommendedvalue === 0) {
      return null
    }
    return Math.floor((100 / recommendedvalue) * componentvalue)
  }

  // A function that returns a single css rule for given input (%), this defines
  // the width of the yellow bar.
  style = percent => {
    return {
      backgroundImage: `-webkit-linear-gradient(left, rgba(251, 189, 9, 0.4) ${percent}%, #ffffff ${percent}%)`
    }
  }

  render() {
    let percentage = null
    if (this.props.foodItemHover !== null) {
      let recommendedvalue =
        this.props.suggestions[this.props.koodi.toLowerCase()] !== null
          ? parseFloat(this.props.suggestions[this.props.koodi.toLowerCase()])
          : 0
      let componentvalue = this.props.foodItemHover.reduce((res, food) => {
        let val = food[this.props.koodi] !== null ? parseFloat(food[this.props.koodi]) : 0
        let amount = food.amount || 100 // if no amount given, use default (100g)
        return res + val * (amount / 100)
      }, 0)
      percentage = this.calculatePercentage(recommendedvalue, componentvalue)
    }
    return (
      <Popup
        trigger={
          <div style={percentage !== null ? this.style(percentage) : null}>
            {this.props.nimi}{' '}
            {percentage === null ? (
              ''
            ) : (
              <span style={{ color: 'red' }}>
                ({percentage}
                %)
              </span>
            )}
          </div>
        }
        content={this.props.nimi}
        on="click"
        hoverable={true}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    foodItemHover: state.foodItemHover,
    suggestions: state.suggestedAmounts //componentsOriginalRows[1][0] // default suggested values returned from server on initial pageload
  }
}

export default connect(mapStateToProps)(FilterLabel)
