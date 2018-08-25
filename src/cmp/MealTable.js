import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Icon, Button, Table } from 'semantic-ui-react'

import MealFoodTable from './MealFoodTable'
import dataservice from '../srv/dataservice'
import tablestyles from '../styles/tablestyles'
import { setActiveMeal, setActiveMealUpdated, resetActiveMealUpdated, addNewMeal, saveNewMeal } from '../rdc/reducer'

class MealTable extends Component {
	state = {
		activeMealId: -1,
		expanded: {}
	}

	handleRowClick = (row, id) => {
		//console.log(data)
		this.props.resetActiveMealUpdated()
		this.props.setActiveMeal(id)
	}

	handleInputChange = (e, foodid) => {
		console.log(foodid, parseInt(e.target.value))
		this.props.setActiveMealUpdated({ foodid: foodid, amount: parseInt(e.target.value)})
	}

	handleSavebutton = () => {
		const meal = this.props.meals.find(meal => meal.meal_id === this.props.activeMeal)
		if (meal.meal_id === -1) {
			this.props.saveNewMeal(meal, this.props.user.token)
		}
	}

  render() {
  	//console.log(this.props.activeMealUpdated)
  	//console.log(this.props.activeMeal)
  	//console.log(this.props.meals)
  	console.log("EXPANDED: ", this.state.expanded)
  	return (
  		<ReactTable
  	  	collapseOnDataChange={ false }
  	    data={ this.props.meals }
  	  	showPagination={ false }
  	  	getTdProps={ () => { return tablestyles.tabledata } }
  	  	getTheadThProps={ () => { 
  	  		return  {
  	  			style: { padding: '0px' }
  	  		}
  	  	} }
  	  	getTrProps={ (state, rowInfo, column, instance) => {
  	  		return {
  	  			style: { backgroundColor: rowInfo ? (rowInfo.original.meal_id === this.props.activeMeal ? '#fbbd08' : null) : null  }
  	  		}
  	  	} }
  	  	columns={[
  	  	  {
  	  	  	Header: props => 'Omat ateriat',
  	  	  	accessor: 'name',
  	  	  	Cell: row => (<div onClick={ () => this.handleRowClick(row.original, row.original.meal_id) }>{ row.original.name }</div>),
  	  	  	getProps: (state, row) => { 
  	  	  		return { 
  	  	  			style: { fontWeight: 'bold' }
  	  	  		}
  	  	  	}
  	  	  }, {
  	  	  	Header: props => <Button 
  	  	  		positive 
  	  	  		fluid 
  	  	  		compact 
  	  	  		size='mini' 
  	  	  		onClick={ () => this.props.addNewMeal() }>Uusi +</Button>,
  	  	  	sortable: false,
  	  	  	accessor: 'pvm',
  	  	  	width: 75,
  	  	  	Cell: row => (<div onClick={ () => this.handleRowClick(row.original, row.original.meal_id) }>{ row.original.pvm }</div>),
  	  	  	getProps: (state, row) => { 
  	  	  		return { 
  	  	  			style: { fontWeight: 'bold' }
  	  	  		} 
  	  	  	}
  	  	  }
  	  	]}
  	  	expanded={{ // The nested row indexes on the current page that should appear expanded
			    ...this.state.expanded
			  }}
			  onExpandedChange={(newExpanded, index, event) => {
  	  		this.setState({ expanded: {...newExpanded}} )
  	  	}}
  	  	SubComponent={ row => {
  	  			console.log("SUBTABLE: ", row)
	  	  	  return (
	  	  	  	<div>
		  	  	  	<MealFoodTable foods={ row.original }/>
		  	  	  	{ row.original.notSaved ? (<Button positive fluid compact size="mini" onClick={ this.handleSavebutton }>Tallenna</Button>):null }
	  	  	  	</div>
	  	  	  )
  	  	  }
  	  	}
  	  />
  	)
  }
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		meals: state.meals,
		initialMeal: state.initialMeal,
		activeMeal: state.activeMeal,
		activeMealUpdated: state.activeMealUpdated
	}
}

export default connect(
	mapStateToProps,
	{ setActiveMeal, 
		setActiveMealUpdated, 
		resetActiveMealUpdated, 
		addNewMeal, 
		saveNewMeal }
)(MealTable)
