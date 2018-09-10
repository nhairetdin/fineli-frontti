import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Checkbox } from 'semantic-ui-react'

import tablestyles from '../styles/tablestyles'
import { setDiagramComponents } from '../rdc/reducer'

class SelectDiagramComponentsTable extends Component {
	handleCheckboxChange = (e) => {
		this.props.setDiagramComponents(e.target.name.toLowerCase())
	}

  render() {
  	return (
  		<div>
  			<h2>Valitse näytettävät</h2>
	  		{ this.props.components.map((group, index) => {
	        return (
	          <ReactTable
	            getTdProps={ () => { return tablestyles.filtertabledata } }
	            minRows={1}
	            defaultPageSize={group.data.length}
	          	key={index}
	            showPagination={false}
	            data={ group.data }
	            columns={[
	              { 
	              	Header: group.data[0].ylempiluokka,
	              	Cell: row => (<div>{ row.original.nimi }</div>)
	              },{ 
	                Cell: row => (
	                	<input 
	                		onChange={ (e) => this.handleCheckboxChange(e) } 
	                		type="checkbox" 
	                		name={ row.original.koodi }
	                		checked={ this.props.diagramComponents[row.original.koodi.toLowerCase()] ? true : false } 
	                	/>
	                ),
	                width: 25
	              }
	            ]}
	          />
	        )
	    	})}
    	</div>
  	)
  }
}

const mapStateToProps = (state) => {
	return {
		components: state.components,
		diagramComponents: state.diagramComponents
	}
}

export default connect(
	mapStateToProps,
	{setDiagramComponents}
)(SelectDiagramComponentsTable)
