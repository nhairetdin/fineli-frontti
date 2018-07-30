import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import { initBasedata, changeTab } from './rdc/reducer'
import Topmenu from './cmp/Topmenu'
import Foodsearch from './cmp/Foodsearch'

class App extends Component {
  componentDidMount() {
    this.props.initBasedata()
  }

  clickListener = () => {
    this.props.changeTab('testi')
  }

  render() {
    //console.log(this.props)
    return (
      <Router>
        <Container fluid>
          <Topmenu />

          <Route exact path="/" render={() => <Foodsearch />} />

          <Route
            path="/ruokapaivakirja"
            render={() => <h1>Ruokapaivakirja</h1>}
          />
        </Container>
      </Router>
    )
  }
}

const mapStateToProps = state => {
  return {
    storecomponents: state.components
  }
}

export default connect(
  mapStateToProps,
  { initBasedata, changeTab }
)(App)
