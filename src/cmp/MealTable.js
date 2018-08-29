import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { Icon, Button, Table } from 'semantic-ui-react'

import MealFoodTable from './MealFoodTable'
import dataservice from '../srv/dataservice'
import tablestyles from '../styles/tablestyles'
import {
  setActiveMeal,
  setActiveMealUpdated,
  resetActiveMealUpdated,
  addNewMeal,
  saveNewMeal,
  removeMeal,
  updateMeal
} from '../rdc/reducer'

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
    this.props.setActiveMealUpdated({
      foodid: foodid,
      amount: parseInt(e.target.value)
    })
  }

  handleSavebutton = () => {
    const meal = this.props.meals.find(
      meal => meal.meal_id === this.props.activeMeal
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

  handleDeletebutton = async (id) => {
    const result = await dataservice.deleteMeal(id, this.props.user.token)
    if (result.status === 204) {
      console.log("removing..")
      this.props.removeMeal(id)
    }
  }

  render() {
    //console.log(this.props.activeMealUpdated)
    //console.log(this.props.activeMeal)
    //console.log(this.props.meals)
    console.log('EXPANDED: ', this.state.expanded)
    return (
      <ReactTable
        collapseOnDataChange={false}
        data={this.props.meals}
        showPagination={false}
        className={'-highlight'}
        getTdProps={() => { return tablestyles.tabledata }}
        getTrProps={(state, rowInfo, column, instance) => {
          return {
            style: {
              backgroundColor: rowInfo
                ? rowInfo.original.meal_id === this.props.activeMeal
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
            Cell: row => (
              <div onClick={() => this.handleRowClick(row.original, row.original.meal_id)}>
                {row.original.name}
              </div>
            ),
            getProps: (state, row) => {
              return { style: { fontWeight: 'bold' } }
            }
          },
          {
            Header: props => 'pvm.',
            sortable: false,
            accessor: 'pvm',
            width: 80,
            Cell: row => (
              <div onClick={() => this.handleRowClick(row.original, row.original.meal_id)}>
                {row.original.pvm}
              </div>
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
                onClick={() => this.handleCopybutton(row.original)}
              >
                <Icon fitted name="copy outline" />
              </Button>
            ),
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
                onClick={() => this.handleDeletebutton(row.original.meal_id)}
              >
                <Icon fitted name="trash alternate" />
              </Button>
            ),
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
          console.log('SUBTABLE: ', row)
          return (
            <div>
              <MealFoodTable foods={row.original} />
              {row.original.notSaved ? (
                <Button
                  positive
                  fluid
                  compact
                  size="mini"
                  onClick={this.handleSavebutton}
                >
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

export default connect(
  mapStateToProps,
  {
    setActiveMeal,
    setActiveMealUpdated,
    resetActiveMealUpdated,
    addNewMeal,
    saveNewMeal,
    removeMeal,
    updateMeal
  }
)(MealTable)
