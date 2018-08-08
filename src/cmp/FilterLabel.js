import React, { Component } from 'react'
import { connect } from 'react-redux'
import cmprecommendations from '../cmprecommendations'

class FilterLabel extends Component {
  constructor(props) {
  	super(props)
  	//console.log(cmprecommendations.male[props.koodi] + props.koodi)
  }

  // calculatePercentage = (koodi) => {
  // 	//console.log(cmprecommendations.male[koodi], this.props.foodItemHover[koodi])
  // 	if (recs.male[koodi] === null || 
  // 		this.props.foodItemHover[koodi] === null || 
  // 		parseFloat(this.props.foodItemHover[koodi]) === 0) {
  // 		return null
  // 	}
  // 	return Math.floor((100 / cmprecommendations.male[koodi]) * parseFloat(this.props.foodItemHover[koodi]))
  // }
  calculatePercentage = (recommendedvalue, componentvalue) => {
  	if (recommendedvalue === null || componentvalue === null || componentvalue === 0) {
  	  return 0
  	}
  	return Math.floor((100 / recommendedvalue) * parseFloat(componentvalue))
  }

  style = (percent) => {
  	return {
  	  backgroundImage: `-webkit-linear-gradient(left, #efe3af ${percent}%, #ffffff ${percent}%)`
  	}
  }

  render() {
  	let percentage = 0
  	if (this.props.foodItemHover !== null) {
  	  percentage = this.calculatePercentage(cmprecommendations.male[this.props.koodi], this.props.foodItemHover[this.props.koodi])
  	  //console.log(cmprecommendations.male[this.props.koodi] + " - komponentissa: " + this.props.foodItemHover[this.props.koodi])
    }
  	//const percentage = this.calculatePercentage(cmprecommendations.male[this.props.koodi])
  	//console.log(percentage)
  	//console.log(this.props.foodItemHover, cmprecommendations)
  	return (
  	  <div style={ percentage !== 0 ? this.style(percentage) : null }>{ this.props.nimi }</div>
  	)
  }
}

const mapStateToProps = (state) => {
  return {
  	foodItemHover: state.foodItemHover
  }
}

export default connect(
  mapStateToProps
)(FilterLabel)
