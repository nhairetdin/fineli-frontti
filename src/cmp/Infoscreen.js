import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Infoscreen extends Component {
  render() {
    return (
      <Container fluid>
        <b>Järjestys: </b>
        {this.props.components[this.props.sortCode]}, ({this.props.ordering})
      </Container>
    )
  }
}

const mapComponentCodesToNames = components => {
  return components.reduce((res, cmp) => {
    cmp.data.forEach(el => {
      res = { ...res, [el.koodi]: el.nimi }
    })
    return res
  }, {})
}

const mapStateToProps = state => {
  return {
    components: mapComponentCodesToNames(state.components),
    sortCode: state.sortCode,
    ordering: state.sortOrderDecreasing === true ? 'eniten' : 'vähiten'
  }
}

export default connect(mapStateToProps)(Infoscreen)
