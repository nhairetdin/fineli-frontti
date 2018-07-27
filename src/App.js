import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initBasedata } from './rdc/reducer'

class App extends Component {
  componentDidMount() {
    this.props.initBasedata()
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <h1>Nothing yet..</h1>
        { this.props.storecomponents.map((cmp, index) => <div key={ index }>{ cmp.data[0].ylempiluokka }</div>) }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    storecomponents: state.components
  }
}

export default connect(
  mapStateToProps,
  { initBasedata }
)(App)
