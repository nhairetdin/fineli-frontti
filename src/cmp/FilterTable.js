import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import FilterLabel from './FilterLabel'
import { addFilter, removeFilter, setSortcode } from '../rdc/reducer'
import tablestyles from '../styles/tablestyles'

class FilterTable extends Component {
  inputChangeListener = (source, event) => {
    const code = source
    const value = parseInt(event.target.value, 10)
    if (!value) {
      this.props.removeFilter(code)
    } else {
      this.props.addFilter({ [code]: value }, code)
    }
  }

  render() {
    return (
      <div>
        {this.props.storecomponents.map((group, index) => {
          return (
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
                  Cell: row => (
                    <FilterLabel
                      nimi={row.original.nimi}
                      foodid={row.original.foodid}
                      koodi={row.original.koodi}
                    />
                  )
                },
                {
                  Header: <Icon disabled name="filter" />,
                  Cell: row => (
                    <input
                      placeholder={row.original.yksikko.toLowerCase()}
                      style={tablestyles.cellinput}
                      onChange={e =>
                        this.inputChangeListener(row.original.koodi, e)
                      }
                      type="number"
                    />
                  ),
                  width: 40
                }
              ]}
            />
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    storecomponents: state.components
  }
}

export default connect(
  mapStateToProps,
  { addFilter, removeFilter, setSortcode }
)(FilterTable)
