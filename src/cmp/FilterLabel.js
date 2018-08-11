import React, { Component } from 'react'
import { connect } from 'react-redux'
//import cmprecommendations from '../cmprecommendations'

class FilterLabel extends Component {

  calculatePercentage = (recommendedvalue, componentvalue) => {
  	if (recommendedvalue === null || componentvalue === null || componentvalue === 0) {
  	  return 0
  	}
  	return Math.floor((100 / parseFloat(recommendedvalue)) * parseFloat(componentvalue))
  }

  style = (percent) => {
  	return {
  	  backgroundImage: `-webkit-linear-gradient(left, #efe3af ${percent}%, #ffffff ${percent}%)`
  	}
  }

  render() {
  	let percentage = 0
  	if (this.props.foodItemHover !== null) {
      //percentage = this.calculatePercentage(cmprecommendations.male[this.props.koodi], this.props.foodItemHover[this.props.koodi])
  	  percentage = this.calculatePercentage(this.props.suggestions[this.props.koodi.toLowerCase()], this.props.foodItemHover[this.props.koodi])
    }
  	return (
  	  <div style={ percentage !== 0 ? this.style(percentage) : null }>{ this.props.nimi }</div>
  	)
  }
}

const mapStateToProps = (state) => {
  return {
  	foodItemHover: state.foodItemHover,
    suggestions: state.suggestedAmounts//componentsOriginalRows[1][0] // default suggested values returned from server on initial pageload
  }
}

export default connect(
  mapStateToProps
)(FilterLabel)
