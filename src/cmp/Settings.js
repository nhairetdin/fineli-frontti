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

  inputChangeListener = (koodi, event) => {
    event.preventDefault()
    const value = event.target.value
    this.setState({ [koodi.toLowerCase()]: value ? parseFloat(value) : '' })
  }

  handleSaveRecommendationButton = async () => {
    const response = await dataservice.setRecommendedValuesForUser(
      this.props.user.token,
      this.state
    )
    this.props.setSuggestedAmounts(response)
  }

  render() {
    console.log(this.props.components)
    console.log(this.props.recommendations)
    console.log(this.state)
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

const mapStateToProps = state => {
  return {
    components: state.components,
    recommendations: state.suggestedAmounts,
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { setSuggestedAmounts }
)(Settings)
