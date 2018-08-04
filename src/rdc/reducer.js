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
  user: false,
  registerModalOpen: false,
  loginModalOpen: false,
  openedFoodItem: null,
  searchKeyword: ''
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
    case 'TOGGLE_REGISTERMODAL': {
      return { ...state, registerModalOpen: !state.registerModalOpen }
    }
    case 'TOGGLE_LOGINMODAL': {
      return { ...state, loginModalOpen: !state.loginModalOpen }
    }
    case 'LOGIN_USER': {
      return { ...state, user: action.data}
    }
    case 'SET_OPENED_FOOD_ITEM': {
      return { ...state, openedFoodItem: action.data}
    }
    case 'SET_SEARCHKEYWORD': {
      return { ...state, searchKeyword: action.data}
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
  window.localStorage.removeItem('user')
  return {
    type: 'LOGOUT',
    data: data
  }
}

export const login = () => {
  //window.localStorage.setItem('user', JSON.stringify(data))
  return {
    type: 'SET_USER',
    data: JSON.parse(window.localStorage.getItem('user'))
  }
}

export const toggleRegisterModal = () => {
  return {
    type: 'TOGGLE_REGISTERMODAL'
  }
}

export const toggleLoginModal = () => {
  return {
    type: 'TOGGLE_LOGINMODAL'
  }
}

export const openFoodItem = (data) => {
  return {
    type: 'SET_OPENED_FOOD_ITEM',
    data: data
  }
}

export const setSearchKeyword = (data) => {
  return {
    type: 'SET_SEARCHKEYWORD',
    data: data
  }
}

export const registerUser = (data) => {
  // return async (dispatch) => {
  //   try {
  //     const user = await dataservice.registerUser(data)
  //     console.log(user)
  //     dispatch({
  //       type: 'LOGIN_USER',
  //       data: { email: user.data.email, token: user.data.token }
  //     })
  //   } catch (e) {
  //     //console.log(e)
  //   }
  // }
}

export default reducer