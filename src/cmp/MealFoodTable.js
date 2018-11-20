import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Input, Form, Button, Icon } from 'semantic-ui-react'
import { changeMealName, removeFoodFromMeal } from '../rdc/reducer'

// This components creates the inner table for user's personal foods, 
// showing all foods inside each meal
class MealFoodTable extends Component {
  constructor(props) {
    super(props)
  }

  // Changes the meal name, does not save anything, only redux store changes
  handleNameChange = event => {
    this.props.changeMealName(event.target.value)
  }

  // Delete, does not save anything, only redux store changes
  handleDeletebutton = (meal_id, foodid) => {
    this.props.removeFoodFromMeal(meal_id, foodid)
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Field inline>
            <label>Nimi:</label>
            <Input fluid placeholder={this.props.foods.name} size="mini" onChange={e => this.handleNameChange(e)} />
          </Form.Field>
        </Form>
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
                    onClick={() => this.handleDeletebutton(this.props.foods.meal_id, food.foodid)}>
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

export default connect(
  mapStateToProps,
  { changeMealName, removeFoodFromMeal }
)(MealFoodTable)
