import React, { Component } from 'react'
import { Grid, Table, Input } from 'semantic-ui-react'
import BarChart from './BarChart'
//import Filtergroup from './Filtergroup'
import { connect } from 'react-redux'
import reducer from '../rdc/reducer'
import { addFilter, removeFilter, setSortcode } from '../rdc/reducer'

class Foodsearch extends Component {
  onChangeListener = event => {
    const code = event.target.name
    const value = parseInt(event.target.value)
    if (!value) {
      this.props.removeFilter(code)
    } else {
      this.props.addFilter({ [code]: value }, code)
    }
  }

  render() {
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={5}>
            {this.props.storecomponents.map((group, index) => {
              return (
                <Table compact="very" color="black" key={index}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>
                        {group.data[0].ylempiluokka}
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {group.data.map(item => {
                      return (
                        <Table.Row key={item.koodi}>
                          <Table.Cell>
                            <Input
                              label={{ basic: true, content: item.nimi }}
                              placeholder={item.yksikko.toLowerCase()}
                              size="mini"
                              name={item.koodi}
                              type="number"
                              onChange={this.onChangeListener}
                            />
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
              )
            })}
          </Grid.Column>

          <Grid.Column width={11}>
            <Table compact="very" color={'black'}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Elintarvike</Table.HeaderCell>
                  <Table.HeaderCell width={4}>
                    Prot / HH / Rasva
                  </Table.HeaderCell>
                  <Table.HeaderCell>Notes</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.results.map(food => (
                  <Table.Row key={food.foodid}>
                    <Table.Cell>{food.foodname}</Table.Cell>
                    <Table.Cell>
                      <BarChart width={food.PROT} color={'#c2ffc2'} />
                      <BarChart width={food.CHOAVL} color={'#c4c4ff'} />
                      <BarChart width={food.FAT} color={'#ffb7b7'} />
                    </Table.Cell>
                    <Table.Cell>{food[this.props.sortcode]}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const applyFilters = (basedata, filters, sortCode) => {
  const filterKeys = Object.keys(filters)
  const filteredArray = basedata.filter(food => {
    for (let i = 0; i < filterKeys.length; i++) {
      if (food[filterKeys[i]] < filters[filterKeys[i]]) {
        return false
      }
    }
    return true
  })
  return filteredArray
    .sort((a, b) => parseFloat(b[sortCode]) - parseFloat(a[sortCode]))
    .slice(0, 50)
}

const mapStateToProps = state => {
  return {
    storecomponents: state.components,
    filters: state.filters,
    results: applyFilters(state.basedata, state.filters, state.sortCode),
    sortcode: state.sortCode
  }
}

export default connect(
  mapStateToProps,
  { addFilter, removeFilter, setSortcode }
)(Foodsearch)
