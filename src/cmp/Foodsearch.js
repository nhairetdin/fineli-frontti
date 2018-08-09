import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import SearchOptions from './SearchOptions'
import SearchResultsTable from './SearchResultsTable'
import FilterTable from './FilterTable'
import 'react-table/react-table.css'

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
  
  searchphraseInputchange = (e) => {
  	this.refs.searchResultsTable.getWrappedInstance().searchphraseInputchange(e)
  }

  render() {
  	console.log("foodsearch")
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={16}>
            <SearchOptions listener={ this.searchphraseInputchange }/>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={5} className={'leftColumn'}>
            <FilterTable />
          </Grid.Column>

          <Grid.Column width={11} className={'rightColumn'}>
            <SearchResultsTable ref="searchResultsTable"/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Foodsearch
