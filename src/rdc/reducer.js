import dataservice from '../srv/dataservice'

const initialState = {
  priorities: {
    'Hiilihydraattifraktiot': 4,
    'Kivennäis- ja hivenaineet': 2,
    'Perusravintoaineet': 6,
    'Rasva': 3,
    'Typpiyhdisteet': 1,
    'Vitamiinit': 5
  },
  filters: {},
  sortCode: 'ENERC',
  components: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  	case 'INIT_BASEDATA':
  	  return {
  	    ...state, 
  	  	basedata: action.data,
  	  	components: action.components 
  	  }
  	case 'ADD_FILTER': {
  	  //const filters = { ...state.filters, action.data }
  	  const newState = { ...state }
  	  newState.filters = { ...state.filters, ...action.data }
  	  return newState
  	}
  	case 'REMOVE_FILTER': {
	  const newState = { ...state }
	  delete newState.filters[action.data]
	  return newState
  	}
  	default:
      return state
  }
}

export const initBasedata = () => {
  return async (dispatch) => {
    let basedata = []
    let components = []
    if (!window.localStorage.getItem('basedata')) {
      console.log("Loading data from the server.")
      window.localStorage.setItem('basedata', JSON.stringify(await dataservice.getBasedata('food')))
      window.localStorage.setItem('components', JSON.stringify(await dataservice.getBasedata('components')))
    }
    basedata = JSON.parse(window.localStorage.getItem('basedata'))
    components = JSON.parse(window.localStorage.getItem('components'))

    dispatch({
      type: 'INIT_BASEDATA',
      data: basedata,
      components: components
    })
  }
}

export const addFilter = (data) => {
  return {
  	type: 'ADD_FILTER',
  	data: data
  }
}

export const removeFilter = (data) => {
  return {
  	type: 'REMOVE_FILTER',
  	data: data
  }
}

export default reducer