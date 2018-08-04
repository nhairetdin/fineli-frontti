import React from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setSearchKeyword } from '../rdc/reducer'

class SearchOptions extends React.Component {
  onChange = (event) => {
    this.props.setSearchKeyword(event.target.value)
  }

  render() {
    return (
      <Form>
        <Form.Group inline>
          <Form.Input placeholder='Hakusana' onChange={ this.onChange } />
          <Form.Checkbox label='Laktoositon' />
          <Form.Checkbox label='Kolesteroliton' />
          <Form.Checkbox label='Gluteeniton' />
          <Form.Checkbox label='Rasvaton' />
          <Form.Checkbox label='Munaton' />
          <Form.Checkbox label='Munaton' />
          <Form.Checkbox label='Munaton' />
          <Form.Checkbox label='Munaton' />
          <Form.Checkbox label='Munaton' />
        </Form.Group>
      </Form>
    )
  }
}

export default connect(
  null,
  { setSearchKeyword }
)(SearchOptions)