import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import {
  initBasedata,
  changeTab,
  login,
  setSuggestedAmounts,
  setUserMeals
} from './rdc/reducer'
import dataservice from './srv/dataservice'
import Topmenu from './cmp/Topmenu'
import Foodsearch from './cmp/Foodsearch'
import Statistics from './cmp/Statistics'
import Settings from './cmp/Settings'

class App extends Component {
  componentDidMount = async () => {
    this.props.initBasedata(await this.initialize())

    if (window.localStorage.getItem('user')) {
      // user is logged in
      try {
        const user = JSON.parse(window.localStorage.getItem('user'))
        const userdata = await dataservice.loadUserdata(user.token)
        this.props.setSuggestedAmounts(userdata.data[0])
        this.props.setUserMeals(userdata.data[1])
        this.props.login()
      } catch (e) {
        console.log('failed to load userdata', e)
      }
    }
  }

  initialize = async () => {
    let basedata = JSON.parse(window.localStorage.getItem('basedata'))
    let components = JSON.parse(window.localStorage.getItem('components'))
    let specdietRows = await dataservice.getSpecdietRows()

    if (basedata === null || components === null) {
      basedata = await dataservice.getBasedata('food')
      components = await dataservice.getComponents()
      window.localStorage.setItem('basedata', JSON.stringify(basedata))
      window.localStorage.setItem('components', JSON.stringify(components))
    }

    const specdietOptions = specdietRows.reduce((res, i) => {
      if (res.length === 0) {
        return [{ key: i.thscode, text: i.shortname, value: i.thscode }]
      } else {
        return res.concat({
          key: i.thscode,
          text: i.shortname,
          value: i.thscode
        })
      }
    }, [])

    return {
      data: basedata,
      components: components.classifiedRows,
      componentsOriginalRows: components.originalRows,
      suggestedAmounts: components.originalRows[1],
      specdietOptions: specdietOptions
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

          <Route path="/kuvaaja" render={() => <Statistics />} />

          <Route path="/asetukset" render={() => <Settings />} />
        </Container>
      </Router>
    )
  }
}

export default connect(null, {
  initBasedata,
  changeTab,
  login,
  setSuggestedAmounts,
  setUserMeals
})(App)
