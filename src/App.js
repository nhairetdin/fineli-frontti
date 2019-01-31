import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import { initBasedata, changeTab, login, setSuggestedAmounts, setUserMeals } from './rdc/reducer'
import dataservice from './srv/dataservice'
import Topmenu from './cmp/Topmenu'
import Foodsearch from './cmp/Foodsearch'
import Statistics from './cmp/Statistics'
import Settings from './cmp/Settings'

// This is the root component of everything,
// it basically just defines the structure
// inside Container. In the return-function
// everything is wrapped in <Router />, it allows
// us to read and write the browsers address bar
// and make desicions based on that.
class App extends Component {
  // when the app mounts, we check if localStorage has key user, and
  // if it does, it means that user is logged in. Since user is logged in,
  // we may load user's personal data from the database and set it into redux store.
  componentDidMount = async () => {
    this.props.initBasedata()
    if(window.localStorage.getItem('user')) {
      // user is logged in
      try {
        const user = JSON.parse(window.localStorage.getItem('user'))
        //console.log(user.token)
        const userdata = await dataservice.loadUserdata(user.token)
        console.log('App.js:31 - RECOMMENDATIONS:', userdata.data[0])
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
            path="/kuvaaja"
            render={() => <Statistics />}
          />

          <Route
            path="/asetukset"
            render={() => <Settings />}
          />
        </Container>
      </Router>
    )
  }
}

// Export this class, is wrapped in connect-function, see better explanation at Settings.js
export default connect(
  null,
  { initBasedata, changeTab, login, setSuggestedAmounts, setUserMeals }
)(App)
