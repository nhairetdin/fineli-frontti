import React from 'react'
import { Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setSearchKeyword } from '../rdc/reducer'

class SearchOptions extends React.Component {

  onChange = (event) => {
    this.props.setSearchKeyword(event.target.value)
  }

  render() {
    console.log("SearchOptions render")
    return (
      <Form>
        <Form.Group inline>
          <Form.Input placeholder='Hakusana' onChange={ this.props.listener } />
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