import React, { Component } from 'react'
import { Grid, Container, List, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import tablestyles from '../styles/tablestyles'
import BarChart from './BarChart'
import TextHighlighter from './TextHighlighter'
import Pin from './Pin'
import Sum from './Sum'
import {
  setFoodItemHover,
  setFoodItemHoverNull,
  addFoodForMeal,
  setSearchKeyword,
  pinFood,
  unpinFood
} from '../rdc/reducer'

class SearchResultsTable extends Component {
  mouseoverFoodnameColumn = row => this.props.setFoodItemHover(row)
  mouseLeaveTable = e => this.props.setFoodItemHoverNull()
  togglePin = row => {
    if (row.original.pinned) {
      this.props.unpinFood(row.original.foodid)
    } else {
      this.props.pinFood(row.original.foodid)
    }
  }

  firstColumn = {
    Header: 'Elintarvike',
    accessor: 'foodname',
    id: 666,
    Cell: row => (
      <div
        onClick={() => {
          this.togglePin(row)
        }}>
        <TextHighlighter textToHighlight={row.original.foodname} />
      </div>
    )
  }

  tableColumnSortOverride = (a, b) => parseFloat(b) - parseFloat(a)

  searchphraseInputchange = e => {
    e.target.value !== undefined
      ? this.props.setSearchKeyword(e.target.value)
      : null
    this.refs.reactTable.filterColumn(this.firstColumn, e.target.value)
  }

  handleEnter = (row, e) => {
    if (e.which === 13) {
      //console.log(row)
      this.props.addFoodForMeal({
        foodid: row.foodid,
        foodname: row.foodname,
        amount: parseInt(e.target.value, 10)
      })
    }
  }

  render() {
    console.log('RENDER resultstable')
    return (
      <ReactTable
        getProps={() => {
          return { style: tablestyles.stickyTable }
        }}
        getTableProps={() => {
          return { onMouseLeave: e => this.mouseLeaveTable(e) }
        }}
        ref="reactTable"
        data={[...this.props.basedataPinned, ...this.props.basedata]}
        columns={[
          this.firstColumn,
          {
            width: 30,
            Cell: row => <Pin row={row} onClick={this.togglePin} />,
            style: tablestyles.cellCenterContent
          },
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
            Header: row => <Sum row={row.original} header={true} />,
            width: 60,
            Cell: row => <Sum row={row.original} />
          },
          {
            Header: 'Jakauma (prot, fat, hh)',
            Cell: row => (
              <BarChart
                prot={row.original.PROT}
                fat={row.original.FAT}
                hh={row.original.CHOAVL}
              />
            )
          },
          {
            Header: <Icon disabled name="add circle" />,
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
        getTrProps={(state, row, column) => {
          let trProps = {
            onMouseEnter: () => this.props.setFoodItemHover(row.original)
          }

          if (row === undefined) {
            return trProps
          }
          if (row.original.pinned) {
            return {
              style: { background: 'lightcyan', fontWeight: 'bold' },
              ...trProps
            }
          } else {
            return {
              ...trProps
            }
          }
        }}
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
        sortable={false}
        defaultFilterMethod={(filter, row) => {
          return (
            String(row[filter.id]).includes(filter.value.toUpperCase()) ||
            row._original.pinned === true
          )
        }}
        SubComponent={row => {
          // Simply print out the food data when food row is expanded
          return (
            <Container fluid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <List
                    style={tablestyles.list}
                    items={this.props.componentsOriginalRows[0].map(
                      component => {
                        return (
                          component.nimi +
                          ': ' +
                          row.original[component.koodi] +
                          ' (' +
                          row.original[component.koodi] +
                          ')'
                        )
                      }
                    )}
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
    user: state.user,
    basedataPinned: state.basedataPinned
  }
}

export default connect(
  mapStateToProps,
  {
    setFoodItemHover,
    setFoodItemHoverNull,
    addFoodForMeal,
    setSearchKeyword,
    pinFood,
    unpinFood
  },
  null,
  { withRef: true }
)(SearchResultsTable)
