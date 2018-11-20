import React, { Component } from 'react'
import { Grid, Container, List, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import tablestyles from '../styles/tablestyles'
import BarChart from './BarChart'
import { setFoodItemHover, setFoodItemHoverNull, addFoodForMeal } from '../rdc/reducer'

// This component creates the react-table for displaying the search results, foods
class SearchResultsTable extends Component {
  // When foodname is mouse hovered, set it's data in state so that it
  // can be accessed by other components and set null when leave
  mouseoverFoodnameColumn = row => this.props.setFoodItemHover(row)
  mouseLeaveTable = e => this.props.setFoodItemHoverNull()

  // First column needs a little special treatment, other columns are defined
  // in <ReactTable columns={}... in return()
  firstColumn = {
    Header: 'Elintarvike',
    accessor: 'foodname',
    id: 666,
    Cell: row => (
      <div
        onMouseOver={() => {
          return this.mouseoverFoodnameColumn(row.original)
        }}>
        {row.original.foodname}
      </div>
    )
  }

  tableColumnSortOverride = (a, b) => parseFloat(b) - parseFloat(a)

  // react-table has built in functionality for text search including an input field,
  // but I'm using custom input field for search, so I need a reference to the
  // react-table's built-in searchfield, and since the search is based on foodname (elintarvike)
  // I need to pass in a ref of that, which is the firstColumn.
  searchphraseInputchange = e => {
    this.refs.reactTable.filterColumn(this.firstColumn, e.target.value)
  }

  // Called from inputfield's onKeyDown listener, if
  // enter is hit, add this food and amount for users
  // selected meal. The selected meal is figured out in
  // the action handler
  handleEnter = (row, e) => {
    if (e.which === 13) {
      //console.log(row)
      this.props.addFoodForMeal({
        foodid: row.foodid,
        foodname: row.foodname,
        amount: parseInt(e.target.value)
      })
    }
  }

  render() {
    return (
      <ReactTable
        getTableProps={() => {
          return {
            onMouseLeave: e => this.mouseLeaveTable(e)
          }
        }}
        ref="reactTable"
        data={this.props.basedata}
        columns={[
          this.firstColumn,
          {
            Header: 'prot',
            accessor: 'PROT',
            width: 40,
            sortMethod: this.tableColumnSortOverride,
            style: { backgroundColor: '#93FFBF' }
          },
          {
            Header: 'fat',
            accessor: 'FAT',
            width: 40,
            sortMethod: this.tableColumnSortOverride,
            style: { backgroundColor: '#FF9198' }
          },
          {
            Header: 'hh',
            accessor: 'CHOAVL',
            width: 40,
            sortMethod: this.tableColumnSortOverride,
            style: { backgroundColor: '#B4B6FF' }
          },
          {
            Header: 'kcal',
            accessor: 'ENERC',
            width: 40,
            sortMethod: this.tableColumnSortOverride,
            Cell: row => <div>{Math.round(0.2388 * parseFloat(row.value))}</div>
          },
          {
            Header: 'Jakauma (prot, fat, hh)',
            Cell: row => <BarChart prot={row.original.PROT} fat={row.original.FAT} hh={row.original.CHOAVL} />
          },
          {
            Header: <Icon disabled name="add to cart" />,
            width: 40,
            Cell: row => (
              <input
                placeholder="g"
                style={tablestyles.cellinput}
                onKeyDown={e => this.handleEnter(row.original, e)}
                type="number"
                disabled={this.props.user ? false : true}
              />
            )
          }
        ]}
        getTdProps={() => {
          return tablestyles.tabledata
        }}
        getTheadFilterProps={() => {
          return tablestyles.filterrow
        }}
        getPaginationProps={() => {
          return tablestyles.pagination
        }}
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
        SubComponent={row => { // Simply print out the food data when food row is expanded
          return (
            <Container fluid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <List
                    style={tablestyles.list}
                    items={this.props.componentsOriginalRows[0].map(component => {
                      return (
                        component.nimi +
                        ': ' +
                        row.original[component.koodi] +
                        ' (' +
                        row.original[component.koodi] +
                        ')'
                      )
                    })}
                  />
                </Grid.Column>
              </Grid.Row>
            </Container>
          )
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    basedata: state.results,
    storecomponents: state.components,
    componentsOriginalRows: state.componentsOriginalRows,
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { setFoodItemHover, setFoodItemHoverNull, addFoodForMeal },
  null,
  { withRef: true }
)(SearchResultsTable)
