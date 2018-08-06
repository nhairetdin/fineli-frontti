import React, { Component } from 'react'
import { Grid, Table, Input, Button, Icon, Container, List } from 'semantic-ui-react'
import BarChart from './BarChart'
import SearchOptions from './SearchOptions'
import { connect } from 'react-redux'
import reducer from '../rdc/reducer'
import { addFilter, removeFilter, setSortcode, openFoodItem } from '../rdc/reducer'
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

  firstColumn = {
  	Header: 'Elintarvike',
  	accessor: 'foodname',
  	id: 666
  }

  onRowClick = (foodid, event) => {
  	event.nativeEvent.stopImmediatePropagation()
  	console.log("row clicked", event, event.bubbles)
  	this.props.openFoodItem(foodid)
  }

  tableColumnSortOverride = (a, b) => parseFloat(b) - parseFloat(a)
  
  searchphraseInputchange = (e) => {
  	//this.refs.reactTable.filterColumn(this.refs.reactTable.state.columns[1], e.target.value)
  	this.refs.reactTable.filterColumn(this.firstColumn, e.target.value)
  	//console.log(this.refs.reactTable)
  }

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
            {this.props.storecomponents.map((group, index) => {
              return (
                <Table compact="very" color="black" key={index}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        {group.data[0].ylempiluokka}
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {group.data.map(item => {
                      const style = this.props.filters[item.koodi] ? 'activeStyle' : ''
                      return (
                        <Table.Row key={item.koodi}>
                          <Table.Cell>
                            <Input
                              label={{ basic: true, content: item.nimi }}
                              placeholder={item.yksikko.toLowerCase()}
                              size="mini"
                              name={item.koodi}
                              type="number"
                              onChange={this.onChangeListener}
                              className={'filterInput ' + style}
                            />
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
              )
            })}
          </Grid.Column>

          <Grid.Column width={11} className={'rightColumn'}>
            <ReactTable
              ref="reactTable"
              data={ this.props.results }
              columns={[this.firstColumn, {
              	Header: 'prot',
              	accessor: 'PROT',
              	width: 50,
              	sortMethod: this.tableColumnSortOverride
              },{
              	Header: 'fat',
              	accessor: 'FAT',
              	width: 50,
              	sortMethod: this.tableColumnSortOverride
              },{
              	Header: 'hh',
              	accessor: 'CHOAVL',
              	width: 50,
              	sortMethod: this.tableColumnSortOverride
              },{
              	Header: 'kcal',
              	accessor: 'ENERC',
              	width: 50,
              	sortMethod: this.tableColumnSortOverride,
              	Cell: row => (<div>{ Math.round(0.2388 * parseFloat(row.value)) }</div>)
              }, {
              	Header: 'Jakauma (prot, fat, hh)',
              	Cell: row => (<BarChart prot={ row.original.PROT } fat={ row.original.FAT } hh={ row.original.CHOAVL }/>)
              }]}
              getTdProps={ () => { return tablestyles.tabledata } }
              getTheadFilterProps={ () => { return tablestyles.filterrow } }
              previousText={'Edellinen'}
        	  nextText={'Seuraava'}
        	  pageText={'Sivu'}
       		  rowsText={'riviä'}
        	  ofText={'...'}
        	  pageSizeOptions={[20, 25, 30, 35, 40, 45, 50, 100, 200]}
        	  defaultPageSize={35}
        	  className={'-highlight'}
        	  filterable
        	  defaultFilterMethod={(filter, row) => String(row[filter.id]).includes(filter.value.toUpperCase())}
        	  SubComponent={row => {
        	  	return (
        	  	  <Container fluid>
        	  	    <Grid.Row>
        	  	      <Grid.Column width={16}>
	        	  	    <List style={ tablestyles.list } items={ this.props.componentsOriginalRows.map((component) => {
	        	  	      return component.nimi + ": " + row.original[component.koodi] + " (" + row.original[component.koodi] + ")"
	        	  	    }) }/>
        	  	      </Grid.Column>
        	  	    </Grid.Row>
        	  	  </Container>
        	  	)
        	  }}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const applyFilters = (basedata, filters, sortCode, searchKeyword) => {
  const keyword = searchKeyword.toUpperCase()
  const filterKeys = Object.keys(filters)
  const filteredArray = basedata.filter(food => {
  	if (keyword.length > 2) {
  	  if (!food.foodname.includes(keyword)) {
  	  	return false
  	  }
  	}
    for (let i = 0; i < filterKeys.length; i++) {
      // if (food.foodname.toLowerCase().includes(searchKeyword)) {
      // 	console.log(true)
      // }
      if (food[filterKeys[i]] < filters[filterKeys[i]]) {
        return false
      }
    }
    return true
  })
  return filteredArray
    .sort((a, b) => parseFloat(b[sortCode]) - parseFloat(a[sortCode]))
}

const mapStateToProps = state => {
  return {
    storecomponents: state.components,
    componentsOriginalRows: state.componentsOriginalRows,
    filters: state.filters,
    basedata: state.basedata, // for react-table
    results: applyFilters(state.basedata, state.filters, state.sortCode, state.searchKeyword),
    sortcode: state.sortCode,
    openedFoodItem: state.openedFoodItem
  }
}

export default connect(
  mapStateToProps,
  { addFilter, removeFilter, setSortcode, openFoodItem }
)(Foodsearch)
