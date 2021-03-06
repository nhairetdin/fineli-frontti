import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Input, Form, Button, Icon } from 'semantic-ui-react'
import { removeFoodFromMeal } from '../rdc/reducer'

class MealFoodTable extends Component {
  handleNameChange = event => {
    this.props.changeMealName(event.target.value)
  }

  handleDeletebutton = (meal_id, foodid) => {
    this.props.removeFoodFromMeal(meal_id, foodid)
  }

  render() {
    return (
      <div>
        <Table size="small" compact="very" striped>
          <Table.Body>
            {this.props.foods.foods.map(food => (
              <Table.Row key={food.foodid}>
                <Table.Cell>{food.foodname}</Table.Cell>
                <Table.Cell collapsing textAlign="right">
                  {food.amount + 'g'}
                </Table.Cell>
                <Table.Cell collapsing textAlign="right">
                  <Button
                    fluid
                    compact
                    size="small"
                    color="red"
                    style={{ maxHeight: '1rem', padding: '2px' }}
                    onClick={() =>
                      this.handleDeletebutton(
                        this.props.foods.meal_id,
                        food.foodid
                      )
                    }>
                    <Icon fitted size="small" name="trash alternate" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeMeal: state.activeMeal
  }
}

export default connect(mapStateToProps, { removeFoodFromMeal })(MealFoodTable)
