import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'

class Infoscreen extends Component {
  render() {
    return (
      <Container fluid>
        <b>
          Järjestys: 
          <span style={{ color: 'red' }}> {this.props.components[this.props.sortCode]}</span>
        </b>, ({this.props.ordering})
        <br/>
        Muuta järjestystä klikkaamalla ravintotekijöitä vasemmalla, toinen klikkaus kääntää järjestyksen
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
