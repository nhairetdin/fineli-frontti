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
  components: [],
  activetab: 'search',
  basedata: [],
  user: true
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
      newState.sortCode = action.sortCode
  	  return newState
  	}
  	case 'REMOVE_FILTER': {
	    const newState = { ...state, filters: { ...state.filters } }
	    delete newState.filters[action.data]
	    return newState
  	}
    case 'CHANGE_ACTIVE_TAB': {
      const newState = { ...state }
      newState.activetab = action.data
      return newState
    }
    case 'SET_SORTCODE': {
      return { ...state, sortCode: action.data }
    }
    case 'SET_USER': {
      return { ...state, user: action.data}
    }
    case 'LOGOUT': {
      const newState = { ...state, user: false }
      newState.activetab = action.data
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

export const addFilter = (data, code) => {
  return {
  	type: 'ADD_FILTER',
  	data: data,
    sortCode: code
  }
}

export const removeFilter = (data) => {
  //console.log(data)
  return {
  	type: 'REMOVE_FILTER',
  	data: data
  }
}

export const changeTab = (data) => {
  return {
    type: 'CHANGE_ACTIVE_TAB',
    data: data
  }
}

export const setSortcode = (data) => {
  return {
    type: 'SET_SORTCODE',
    data: data
  }
}

export const logout = (data) => {
  return {
    type: 'LOGOUT',
    data: data
  }
}

export default reducer