import React, { Component } from 'react'
import { Grid, Table, Input, Button, Icon, Container } from 'semantic-ui-react'
import BarChart from './BarChart'
import SearchOptions from './SearchOptions'
import { connect } from 'react-redux'
import reducer from '../rdc/reducer'
import { addFilter, removeFilter, setSortcode, openFoodItem } from '../rdc/reducer'

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

  onRowClick = (foodid, event) => {
  	event.nativeEvent.stopImmediatePropagation()
  	console.log("row clicked", event, event.bubbles)
  	this.props.openFoodItem(foodid)
  }

  render() {
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={16}>
            <SearchOptions />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={5} className={'leftColumn'}>
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
                      const style = this.props.filters[item.koodi] ? 'activeStyle' : ''
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
                              className={'filterInput ' + style}
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

          <Grid.Column width={11} className={'rightColumn'}>
            <Table compact="very" color={'black'}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Elintarvike</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell>
                    Prot / HH / Rasva
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.results.map(food => (
                  <Table.Row key={food.foodid} className={'resultRow'} onClick={ (event) => this.onRowClick(food.foodid, event) }>
                    <Table.Cell width={9}>{food.foodname.slice(0,45) + '...'}</Table.Cell>
                    <Table.Cell width={2} className="inputCell">
                      { food.foodid === this.props.openedFoodItem ? (
                      	<div className={'rowEditContainer'}>
                      	  <Input size="mini" placeholder="määrä" className={'rowInput'} onClick={ (e) => e.stopPropagation() }/>
                      	  <Button className={'rowButton'} positive size='mini' onClick={ (e) => e.stopPropagation() }>Add</Button>
                      	</div>
                      ) : null}
                    </Table.Cell>
                    <Table.Cell width={5}>
                      <BarChart width={food.PROT} color={'#c2ffc2'} />
                      <BarChart width={food.CHOAVL} color={'#c4c4ff'} />
                      <BarChart width={food.FAT} color={'#ffb7b7'} />
                    </Table.Cell>
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

const applyFilters = (basedata, filters, sortCode, searchKeyword) => {
  const keyword = searchKeyword.toUpperCase()
  const filterKeys = Object.keys(filters)
  const filteredArray = basedata.filter(food => {
  	if (keyword.length > 2) {
  	  if (!food.foodname.includes(keyword)) {
  	  	return false
  	  }
  	}
    for (let i = 0; i < filterKeys.length; i++) {
      // if (food.foodname.toLowerCase().includes(searchKeyword)) {
      // 	console.log(true)
      // }
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
	console.log(state.searchKeyword)
  return {
    storecomponents: state.components,
    filters: state.filters,
    results: applyFilters(state.basedata, state.filters, state.sortCode, state.searchKeyword),
    sortcode: state.sortCode,
    openedFoodItem: state.openedFoodItem
  }
}

export default connect(
  mapStateToProps,
  { addFilter, removeFilter, setSortcode, openFoodItem }
)(Foodsearch)
