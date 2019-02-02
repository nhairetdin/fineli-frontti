import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Button } from 'semantic-ui-react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import dataservice from '../srv/dataservice'
import tablestyles from '../styles/tablestyles'
import { setSuggestedAmounts } from '../rdc/reducer'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // Initialize the state, based on user's personal data (this.props.recommendations)
    // which comes from the redux store, see mapStateToProps at the end of this file.
    Object.keys(this.props.recommendations).forEach(key => {
      if (parseFloat(this.props.recommendations[key]) !== 0) {
        this.state = {
          ...this.state,
          [key]: parseFloat(this.props.recommendations[key])
        }
      } else {
        this.state = { ...this.state, [key]: 0 }
      }
    })
  }

  // Whenever any input value changes, store its "id" and value in components state:
  inputChangeListener = (koodi, event) => {
    event.preventDefault()
    const value = event.target.value
    this.setState({ [koodi.toLowerCase()]: value ? parseFloat(value) : '' })
  }

  // Save values to the database and also update redux state.
  handleSaveRecommendationButton = async () => {
    const response = await dataservice.setRecommendedValuesForUser(
      this.props.user.token,
      this.state
    )
    // setSuggestedAmounts is the dispatch action function imported from reducer (line 9)
    // and it is mapped to a prop in the end of this file, see connect() line 136
    this.props.setSuggestedAmounts(response)
  }

  render() {
    //console.log(this.props.components)
    console.log(this.props.recommendations)
    //console.log(this.state)
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column>
            <h2>Suositusarvot</h2>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          {this.props.components.map((group, index) => {
            return (
              <Grid.Column width={5} key={index + 1000}>
                <ReactTable
                  getTdProps={() => {
                    return tablestyles.filtertabledata
                  }}
                  minRows={1}
                  defaultPageSize={group.data.length}
                  key={index}
                  showPagination={false}
                  data={group.data}
                  columns={[
                    {
                      Header: group.data[0].ylempiluokka,
                      Cell: row => <div>{row.original.nimi}</div>
                    },
                    {
                      Cell: row => (
                        <input
                          placeholder={row.original.yksikko.toLowerCase()}
                          style={
                            this.state[row.original.koodi.toLowerCase()] > 0
                              ? tablestyles.inputRecommendationSet
                              : tablestyles.inputRecommendationNotSet
                          }
                          onChange={e =>
                            this.inputChangeListener(row.original.koodi, e)
                          }
                          type="number"
                          value={this.state[row.original.koodi.toLowerCase()]}
                        />
                      ),
                      width: 40
                    }
                  ]}
                />
              </Grid.Column>
            )
          })}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <Button
              positive
              size="tiny"
              onClick={this.handleSaveRecommendationButton}
            >
              Tallenna
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

// In this React component, we need access to a few state/store properties. This is
// done through mapStateToProps function which we'll feed to connect in the end.
const mapStateToProps = state => {
  return {
    components: state.components, // food components
    recommendations: state.suggestedAmounts,
    user: state.user
  }
}

// Connect is a function that connects our component into redux store.
// It may take up to four parameters, but we only need the first two. First is
// a function (mapStateToProps) where we gain access to certain properties
// in the store (3 in this case), second parameter is an object containing
// the redux action dispatchers we may need, only 1 in this case. The action
// is imported from our reducer (see line 9). This allows us to access the store
// as a prop, for example in line 60. Similarily may call an action dispatch
// as in line 44.
export default connect(
  mapStateToProps,
  { setSuggestedAmounts }
)(Settings)
