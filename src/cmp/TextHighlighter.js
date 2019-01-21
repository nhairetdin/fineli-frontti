import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import { connect } from 'react-redux'

class TextHighlighter extends Component {
  render() {
    return (
      <Highlighter
        searchWords={ [this.props.searchKeyword] }
        autoEscape={ true }
        textToHighlight={ this.props.textToHighlight }
        highlightStyle={
          {
            backgroundColor: '#9cd5f1'
          }
        }
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    searchKeyword: state.searchKeyword
  }
}

export default connect(
  mapStateToProps
)(TextHighlighter)