import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Icon, Button } from 'semantic-ui-react'

import MealFoodTable from './MealFoodTable'
import dataservice from '../srv/dataservice'
import { dateToObj } from '../srv/dateformat'
import tablestyles from '../styles/tablestyles'
import {
  setActiveMeal,
  setActiveMealUpdated,
  resetActiveMealUpdated,
  addNewMeal,
  saveNewMeal,
  removeMeal,
  updateMeal,
  setFoodItemHoverFromMeal,
  changeMealName,
  setMealDate
} from '../rdc/reducer'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
class MealTable extends Component {
  state = {
    activeMealId: -1,
    expanded: {}
  }

  // Functions for click events
  handleRowClick = meal => {
    this.props.resetActiveMealUpdated()
    this.props.setActiveMeal(meal)
  }

  onDateChange = async (row, date) => {
    const dateObj = dateToObj(date)
    const response = await dataservice.changeMealDate(row.meal_id, dateObj)
    if (response.status === 200) {
      const dateString = response.data.dateString
      this.props.setMealDate(row.meal_id, dateString)
    } else {
      console.log('failed to update')
    }
  }

  handleMouseOver = foods => {
    this.props.setFoodItemHoverFromMeal(foods)
  }

  handleInputChange = (e, foodid) => {
    //console.log(foodid, parseInt(e.target.value))
    this.props.setActiveMealUpdated({
      foodid: foodid,
      amount: parseInt(e.target.value, 10)
    })
  }

  handleSavebutton = meal_id => {
    const meal = this.props.meals.find(
      meal => meal.meal_id === meal_id //this.props.activeMeal
    )
    if (meal.meal_id === -1) {
      this.props.saveNewMeal(meal, this.props.user.token)
    } else {
      this.props.updateMeal(meal, this.props.user.token)
    }
  }

  handleCopybutton = meal => {
    if (meal.meal_id !== -1) {
      this.props.saveNewMeal(meal, this.props.user.token)
    }
  }

  handleDeletebutton = async id => {
    const result = await dataservice.deleteMeal(id, this.props.user.token)
    if (result.status === 204) {
      //console.log('removing..')
      this.props.removeMeal(id)
    }
  }

  renderEditable = cellInfo => {
    return (
      <div
        onKeyPress={e => {
          if (e.which === 13) {
            e.preventDefault()
          }
        }}
        onPaste={e => {
          e.preventDefault()
        }}
        spellCheck={false}
        onClick={() =>
          this.handleRowClick(cellInfo.original, cellInfo.original.meal_id)
        }
        onMouseOver={() => this.handleMouseOver(cellInfo.original.foods)}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          //const regexp = new RegExp(String.fromCharCode(160), "g")
          let value = e.target.innerHTML
          value = value.replace(/\&nbsp;|;/g, '')
          const data = [...this.props.meals]
          //data[cellInfo.index][cellInfo.column.id] = value
          console.log(value)
          this.props.changeMealName(value)
        }}
        dangerouslySetInnerHTML={{
          __html: this.props.meals[cellInfo.index][cellInfo.column.id]
        }}
      />
    )
  }

  render() {
    //console.log('EXPANDED: ', this.state.expanded)
    console.log('render mealtable')
    return (
      <ReactTable
        collapseOnDataChange={false}
        data={this.props.meals}
        defaultPageSize={33}
        filterable
        showPageSizeOptions={false}
        className={'-highlight'}
        defaultFilterMethod={(filter, row) => {
          return String(row[filter.id])
            .toLowerCase()
            .includes(filter.value.toLowerCase())
        }}
        getProps={() => {
          return { style: tablestyles.stickyTable }
        }}
        getPaginationProps={() => {
          return tablestyles.pagination
        }}
        getTdProps={() => {
          return tablestyles.tabledata
        }}
        getTrProps={(state, rowInfo, column, instance) => {
          return {
            style: {
              backgroundColor: rowInfo
                ? rowInfo.original.meal_id === this.props.activeMeal.meal_id
                  ? '#fbbd08'
                  : null
                : null
            }
          }
        }}
        columns={[
          {
            Header: props => 'Omat ateriat',
            accessor: 'name',
            sortable: false,
            Cell: this.renderEditable,
            // Cell: row => (
            //   <div
            //     onClick={() => this.handleRowClick(row.original, row.original.meal_id)}
            //     onMouseOver={() => this.handleMouseOver(row.original.foods)}>
            //     {row.original.name}
            //   </div>
            // ),
            getProps: (state, row) => {
              return { style: { fontWeight: 'bold' } }
            }
          },
          {
            Header: props => 'pvm.',
            accessor: 'pvm',
            sortable: false,
            width: 80,
            Cell: row => (
              <DatePicker
                selected={new Date()}
                onChange={date => this.onDateChange(row.original, date)}
                customInput={<div>{row.original.pvm}</div>}
                popperModifiers={{
                  preventOverflow: {
                    enabled: true,
                    escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                    boundariesElement: 'viewport'
                  }
                }}
              />
            ),
            getProps: (state, row) => {
              return { style: { fontWeight: 'bold' } }
            }
          },
          {
            Cell: row => (
              <Button
                fluid
                compact
                size="mini"
                color="blue"
                style={{ maxHeight: '1rem', padding: '2px' }}
                onClick={() => this.handleCopybutton(row.original)}>
                <Icon fitted name="copy outline" />
              </Button>
            ),
            filterable: false,
            sortable: false,
            width: 25,
            getProps: (state, row) => {
              return {
                style: { paddingLeft: '2px', paddingRight: '2px' }
              }
            }
          },
          {
            Cell: row => (
              <Button
                fluid
                compact
                size="small"
                color="red"
                style={{ maxHeight: '1rem', padding: '2px' }}
                onClick={() => this.handleDeletebutton(row.original.meal_id)}>
                <Icon fitted name="trash alternate" />
              </Button>
            ),
            filterable: false,
            sortable: false,
            width: 25,
            getProps: (state, row) => {
              return {
                style: { paddingLeft: '2px', paddingRight: '2px' }
              }
            }
          }
        ]}
        expanded={{
          // The nested row indexes on the current page that should appear expanded
          ...this.state.expanded
        }}
        onExpandedChange={(newExpanded, index, event) => {
          this.setState({ expanded: { ...newExpanded } })
        }}
        SubComponent={row => {
          //console.log('SUBTABLE: ', row)
          return (
            <div>
              <MealFoodTable foods={row.original} />
              {row.original.notSaved ? (
                <Button
                  positive
                  fluid
                  compact
                  size="mini"
                  onClick={() => this.handleSavebutton(row.original.meal_id)}>
                  Tallenna
                </Button>
              ) : null}
            </div>
          )
        }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    meals: state.meals,
    initialMeal: state.initialMeal,
    activeMeal: state.activeMeal,
    activeMealUpdated: state.activeMealUpdated
  }
}

export default connect(mapStateToProps, {
  setActiveMeal,
  setActiveMealUpdated,
  resetActiveMealUpdated,
  addNewMeal,
  saveNewMeal,
  removeMeal,
  updateMeal,
  setFoodItemHoverFromMeal,
  changeMealName,
  setMealDate
})(MealTable)
