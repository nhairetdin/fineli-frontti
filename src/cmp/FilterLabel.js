import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Popup } from 'semantic-ui-react'
import suistyles from '../styles/suistyles'
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
  	  backgroundImage: `-webkit-linear-gradient(left, rgba(251, 189, 9, 0.4) ${percent}%, #ffffff ${percent}%)`
  	}
  }

  render() {
    //console.log(this.props.suggestions)
  	let percentage = 0
  	if (this.props.foodItemHover !== null) {
      //percentage = this.calculatePercentage(cmprecommendations.male[this.props.koodi], this.props.foodItemHover[this.props.koodi])
  	  percentage = this.calculatePercentage(this.props.suggestions[this.props.koodi.toLowerCase()], this.props.foodItemHover[this.props.koodi])
    }
  	return (
      <Popup
        trigger={<div style={ percentage !== 0 ? this.style(percentage) : null }>{ this.props.nimi }</div>}
        content={ this.props.nimi }
        on='click'
        hoverable={ true }
      />
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
