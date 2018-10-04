import React from 'react'
import { Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { setSearchKeyword } from '../rdc/reducer'
import SpecdietDropdown from './SpecdietDropdown'
import suistyles from '../styles/suistyles'

class SearchOptions extends React.Component {
  onChange = event => {
    this.props.setSearchKeyword(event.target.value)
  }

  render() {
    console.log('SearchOptions render')
    return (
      <Form>
        <Form.Group inline style={suistyles.searchOptions}>
          <Form.Input placeholder="Hakusana" onChange={this.props.listener} />
          <SpecdietDropdown />
        </Form.Group>
      </Form>
    )
  }
}

export default connect(
  null,
  { setSearchKeyword }
)(SearchOptions)
