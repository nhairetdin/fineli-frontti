import React, { Component } from 'react'
import { Grid, Table, Input, Button, Icon, Container, List } from 'semantic-ui-react'
import BarChart from './BarChart'
import SearchOptions from './SearchOptions'
import SearchResultsTable from './SearchResultsTable'
import FilterTable from './FilterTable'
import { connect } from 'react-redux'
import reducer from '../rdc/reducer'
import { addFilter, removeFilter, setSortcode } from '../rdc/reducer'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import tablestyles from '../styles/tablestyles'

class Foodsearch extends Component {
  onChangeListener = event => {
    const code = event.target.name
    const value = parseInt(event.target.value)
    if (!value) {
      this.props.removeFilter(code)
    } else {
      this.props.addFilter({ [code]: value }, code)
    }
  }

  // firstColumn = {
  // 	Header: 'Elintarvike',
  // 	accessor: 'foodname',
  // 	id: 666
  // }

  // onRowClick = (foodid, event) => {
  // 	event.nativeEvent.stopImmediatePropagation()
  // 	console.log("row clicked", event, event.bubbles)
  // 	this.props.openFoodItem(foodid)
  // }

  tableColumnSortOverride = (a, b) => parseFloat(b) - parseFloat(a)
  
  searchphraseInputchange = (e) => {
  	//this.refs.reactTable.filterColumn(this.refs.reactTable.state.columns[1], e.target.value)
  	//this.refs.reactTable.filterColumn(this.firstColumn, e.target.value)
  	//console.log(this.refs.reactTable)
  	this.refs.searchResultsTable.getWrappedInstance().searchphraseInputchange(e)
  	//this.refs.searchResultsTable.searchphraseInputchange(e)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps, nextState)
  //   console.log(this.props, this.state)
  //   if (nextProps.loginModalOpen !== this.props.loginModalOpen) {
  //     console.log(false)
  //     return false
  //   }
  //   return true
  // }

  render() {
  	console.log("foodsearch")
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={16}>
            <SearchOptions listener={ this.searchphraseInputchange }/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={5} className={'leftColumn'}>
            <FilterTable />
          </Grid.Column>

          <Grid.Column width={11} className={'rightColumn'}>
            <SearchResultsTable ref="searchResultsTable"/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

// const applyFilters = (basedata, filters, sortCode, searchKeyword) => {
//   const keyword = searchKeyword.toUpperCase()
//   const filterKeys = Object.keys(filters)
//   const filteredArray = basedata.filter(food => {
//   	if (keyword.length > 2) {
//   	  if (!food.foodname.includes(keyword)) {
//   	  	return false
//   	  }
//   	}
//     for (let i = 0; i < filterKeys.length; i++) {
//       if (food[filterKeys[i]] < filters[filterKeys[i]]) {
//         return false
//       }
//     }
//     return true
//   })
//   return filteredArray
//     .sort((a, b) => parseFloat(b[sortCode]) - parseFloat(a[sortCode]))
// }

// const mapStateToProps = state => {
//   return {
//     storecomponents: state.components,
//     //componentsOriginalRows: state.componentsOriginalRows,
//     filters: state.filters,
//     basedata: state.basedata, // for react-table
//     //results: applyFilters(state.basedata, state.filters, state.sortCode, state.searchKeyword),
//     sortcode: state.sortCode,
//     loginModalOpen: state.loginModalOpen
//   }
// }

// export default connect(
//   mapStateToProps,
//   { addFilter, removeFilter, setSortcode }
// )(Foodsearch)
export default Foodsearch
