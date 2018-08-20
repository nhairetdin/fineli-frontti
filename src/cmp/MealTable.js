import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Icon, Button } from 'semantic-ui-react'
import dataservice from '../srv/dataservice'

import tablestyles from '../styles/tablestyles'

const data = [
  {
  	name: "Uusi ateria"
  }
]

class MealTable extends Component {

  render() {
  	console.log(this.props.meals)
  	return (
  	  <ReactTable
  	    data={ this.props.meals }
  	  	showPagination={ false }
  	  	getTdProps={ () => { return tablestyles.tabledata } }
  	  	columns={[
  	  	  {
  	  	  	Header: 'Omat ateriat',
  	  	  	accessor: 'name',
  	  	  	getProps: () => { return { style: { fontWeight: 'bold' }} }
  	  	  }, {
  	  	  	Cell: (<Icon color="green" disabled name="clone"/>),
  	  	  	width: 35
  	  	  }, {
  	  	  	Cell: (<Icon color="red" disabled name="delete"/>),
  	  	  	width: 35
  	  	  }
  	  	]}
  	  	SubComponent={ row => {
	  	  	  return (
	  	  	  	<div>
	  	  	  	<ReactTable
	  	  	  		data={ row.original.foods }
	  	  	  		defaultPageSize={ row.original.foods.length }
	  	  	  		showPagination={ false }
  	  					getTdProps={ () => { return tablestyles.tabledata } }
  	  					getTheadThProps={ () => { return tablestyles.tableheaderInvisible } }
  	  					columns={[
  	  						{
  	  							//Header: 'Elintarvike',
  	  							Cell: row => (<div>{ row.original.foodname.toLowerCase() }</div>),
  	  							getProps: () => { return tablestyles.mealTableSubRow }
  	  						}, {
  	  							Cell: row => (<input 
						      		placeholder={ row.original.amount } 
						      		style={tablestyles.cellinput}
						      		type="number" />),
  	  							width: 50
  	  						}
  	  					]} 
  	  				/>
		  	  	  <Button fluid positive size="tiny">Tallenna</Button>
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
		meals: state.meals
	}
}

export default connect(
	mapStateToProps
)(MealTable)
