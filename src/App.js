import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import { initBasedata, changeTab, login, setSuggestedAmounts, setUserMeals } from './rdc/reducer'
import dataservice from './srv/dataservice'
import Topmenu from './cmp/Topmenu'
import Foodsearch from './cmp/Foodsearch'

class App extends Component {
  componentDidMount = async () => {
    this.props.initBasedata()
    if(window.localStorage.getItem('user')) {
      // user is logged in
      try {
        const user = JSON.parse(window.localStorage.getItem('user'))
        //console.log(user.token)
        const userdata = await dataservice.loadUserdata(user.token)
        this.props.setSuggestedAmounts(userdata.data[0])
        this.props.setUserMeals(userdata.data[1])
        this.props.login()
        console.log(userdata.data[0])
      } catch (e) {
        console.log("failed to load userdata", e)
      }
      //this.props.login()
    }
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

export default connect(
  null,
  { initBasedata, changeTab, login, setSuggestedAmounts, setUserMeals }
)(App)
