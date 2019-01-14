import React, { Component } from 'react'
import { Grid, Button, Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import SearchOptions from './SearchOptions'
import SearchResultsTable from './SearchResultsTable'
import FilterTable from './FilterTable'
import MealTable from './MealTable'
import Infoscreen from './Infoscreen'
import { addNewMeal } from '../rdc/reducer'
import 'react-table/react-table.css'

// This class represents the entire search "page"
class Foodsearch extends Component {
  onChangeListener = event => {
    const code = event.target.name
    const value = parseInt(event.target.value, 10)
    if (!value) {
      this.props.removeFilter(code)
    } else {
      this.props.addFilter({ [code]: value }, code)
    }
  }

  tableColumnSortOverride = (a, b) => parseFloat(b) - parseFloat(a)

  searchphraseInputchange = e => {
    this.refs.searchResultsTable.getWrappedInstance().searchphraseInputchange(e)
  }

  render() {
    //console.log('foodsearch')
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={16}>
            <SearchOptions listener={this.searchphraseInputchange} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={5} className={'leftColumn'} verticalAlign='middle'>
            <Container>
              Prosenttia saantisuosituksesta (<b>100g</b>):
            </Container>
          </Grid.Column>
          <Grid.Column width={8} className={'middleColumn'} verticalAlign='middle'>
            <Infoscreen />
          </Grid.Column>
          {this.props.user ? (
            <Grid.Column width={3} className={'rightColumn'}>
              <Button onClick={this.props.addNewMeal} size="mini" fluid compact positive>
                Uusi ateria +
              </Button>
            </Grid.Column>
          ) : null}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={5} className={'leftColumn'}>
            <FilterTable />
          </Grid.Column>
          <Grid.Column width={8} className={'middleColumn'}>
            <SearchResultsTable ref="searchResultsTable" />
          </Grid.Column>
          {this.props.user ? (
            <Grid.Column width={3} className={'rightColumn'}>
              <MealTable />
            </Grid.Column>
          ) : null}
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { addNewMeal }
)(Foodsearch)
