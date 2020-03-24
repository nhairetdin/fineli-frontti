import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

import Diagram from './Diagram'
import SelectDiagramComponentsTable from './SelectDiagramComponentsTable'

class Statistics extends Component {
  render() {
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column widescreen={3} largeScreen={3} computer={4}>
            <SelectDiagramComponentsTable />
          </Grid.Column>

          <Grid.Column widescreen={13} largeScreen={13} computer={12}>
            <Diagram />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Statistics
