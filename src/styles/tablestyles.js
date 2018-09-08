const tabledata = {
  style: {
  	paddingTop: '2px',
  	paddingBottom: '2px',
  	fontSize: '0.85rem',
  	lineHeight: '1rem'
  }
}

const filtertabledata = {
  style: {
    paddingTop: '2px',
    paddingBottom: '2px',
    fontSize: '0.85rem',
    lineHeight: '1rem',
    fontWeight: 'bold'
  }
}

const tableheader = {
  style: { 
    fontWeight: 'bold',
    color: 'red' 
  }
}

const tableheaderInvisible = {
  style: {
    display: 'none'
  }
}

const filterrow = {
  style: {
  	visibility: 'hidden',
  	maxHeight: '0px'
  }
}

const pagination = {
  style: {
    maxHeight: '2.3rem',
    fontSize: '0.9rem'
  }
}

const headerrow = {
  style: {
    fontStyle: 'bold'
  }
}

const list = { 
  fontSize: '0.85em',
  paddingLeft: '3rem'
}

const cellinput = {
  maxWidth: '30px',
  maxHeight: '1rem',
  lineHeight: '1',
  border: '1px solid #cecece'
}

const filterlabel = {
  // backgroundColor: 'lightgray',
  // padding: '0px'
}

const mealTableSubRow = {
  style: {
    paddingLeft: '3rem'
  }
}

const activeMeal = {
  style: {
    backgroundColor: 'red'
  }
}

const inputRecommendationSet = {
  backgroundColor: '#93FFBF',
  maxWidth: '30px',
  maxHeight: '1rem',
  lineHeight: '1',
  border: '1px solid #cecece'
}

const inputRecommendationNotSet = {
  backgroundColor: '#FF9198',
  maxWidth: '30px',
  maxHeight: '1rem',
  lineHeight: '1',
  border: '1px solid #cecece'
}

export default { 
  tabledata, 
  filtertabledata, 
  filterrow, 
  list, 
  pagination, 
  headerrow, 
  cellinput, 
  filterlabel, 
  tableheaderInvisible, 
  mealTableSubRow,
  activeMeal,
  inputRecommendationSet,
  inputRecommendationNotSet }
