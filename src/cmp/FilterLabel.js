import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setSortcode } from '../rdc/reducer'

// This is the component that displays a yellow bar and %-value of a
// selected items relative share for each foodcomponent (enerc, prot, fat and so on)
// on the left, the filters area
class FilterLabel extends Component {
  state = {
    hovered: false
  }

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

  formatName = (name, len) => {
    const formattedName = name.slice(0,len)
    return name.length > len ? formattedName + ".." : formattedName
  }

  render() {
    let percentage = null
    let componentvalue = 0
    if (this.props.foodItemHover !== null) {
      let recommendedvalue =
        this.props.suggestions[this.props.koodi.toLowerCase()] !== null
          ? parseFloat(this.props.suggestions[this.props.koodi.toLowerCase()])
          : 0
      componentvalue = this.props.foodItemHover.reduce((res, food) => {
        let val = food[this.props.koodi] !== null ? parseFloat(food[this.props.koodi]) : 0
        let amount = food.amount || 100 // if no amount given, use default (100g)
        return res + val * (amount / 100)
      }, 0)
      percentage = this.calculatePercentage(recommendedvalue, componentvalue)
    }
    return (
      <div
        style={percentage !== null ? this.style(percentage) : null}
        onClick={() => this.props.setSortcode(this.props.koodi)}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}>
        {this.formatName(this.props.nimi, 22)}{' '}
        {percentage === null ? (
          <span style={{float: 'right'}}>{componentvalue.toFixed(1)}</span>
        ) : (
          <span>
            <span style={{ color: 'red' }}>({percentage}%)</span>
            <span style={{float: 'right'}}>{componentvalue.toFixed(1)}</span>
          </span>
        )}
        {this.state.hovered ? <span style={{ color: 'red' }}>{String.fromCharCode(8661)}</span> : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    foodItemHover: state.foodItemHover,
    suggestions: state.suggestedAmounts //componentsOriginalRows[1][0] // default suggested values returned from server on initial pageload
  }
}

export default connect(
  mapStateToProps,
  { setSortcode }
)(FilterLabel)
