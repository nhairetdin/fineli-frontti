import dataservice from '../srv/dataservice'

const initialState = {
  filters: {},
  sortCode: 'ENERC',
  components: [],
  componentsOriginalRows: [],
  activetab: 'search',
  basedata: [],
  basedataFilteredBySpecdiet: [],
  basedataFilteredByComponents: [],
  results: [],
  user: false,
  registerModalOpen: false,
  loginModalOpen: false,
  openedFoodItem: null,
  searchKeyword: '',
  foodItemHover: null,
  suggestedAmounts: {},
  specdietRows: [],
  specdietOptions: [],
  specdietOptionsCurrent: []
}

const applySpecdietFilters = (newState) => {
  if (newState.specdietOptionsCurrent.length === 0) {
    return newState.basedata
  }

  let start = window.performance.now()
  let filtered = []
  newState.basedata.forEach(row => {
    let count = 0
    for (let i = 0; i < newState.specdietOptionsCurrent.length; i++) {
      if (!row.specdiet || !row.specdiet.includes(newState.specdietOptionsCurrent[i])) {
        count = 0
        continue
      }
      count++
      if (count === newState.specdietOptionsCurrent.length) {
        filtered = [...filtered, {...row}]
      }
    }
  })

  let end = window.performance.now()
  let time = end - start
  console.log("Specdiet-filter time: " + time, filtered)
  return [...filtered]
}

const applyFilters = (newState) => {
  let start = window.performance.now()
  const filterKeys = Object.keys(newState.filters)
  const data = newState.basedataFilteredBySpecdiet
  const filteredArray = data.filter(food => {
    for (let i = 0; i < filterKeys.length; i++) {
      if (food[filterKeys[i]] < newState.filters[filterKeys[i]]) {
        return false
      }
    }
    return true
  })
  let end = window.performance.now()
  console.log(end - start)
  return filteredArray
    .sort((a, b) => parseFloat(b[newState.sortCode]) - parseFloat(a[newState.sortCode]))
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  	case 'INIT_BASEDATA':
  	  return {
  	    ...state, 
  	  	basedata: action.data,
        components: action.components,
        results: action.data,
        basedataFilteredBySpecdiet: action.data,
        basedataFilteredByComponents: action.data,
  	  	componentsOriginalRows: action.componentsOriginalRows, // untransformed result from db
        suggestedAmounts: action.suggestedAmounts[0],
        specdietOptions: action.specdietOptions
  	  }
  	case 'ADD_FILTER': {
  	  const newState = { ...state }
  	  newState.filters = { ...state.filters, ...action.data }
      newState.sortCode = action.sortCode
      newState.results = applyFilters(newState)
  	  return newState
  	}
  	case 'REMOVE_FILTER': {
	    const newState = { ...state, filters: { ...state.filters } }
	    delete newState.filters[action.data]
      newState.results = applyFilters(newState)
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
      return { ...state, user: action.data }
    }
    case 'SET_OPENED_FOOD_ITEM': {
      return { ...state, openedFoodItem: action.data }
    }
    case 'SET_SEARCHKEYWORD': {
      return { ...state, searchKeyword: action.data }
    }
    case 'SET_FOODITEM_HOVER': {
      return { ...state, foodItemHover: { ...action.data } }
    }
    case 'SET_FOODITEM_HOVER_NULL': {
      return { ...state, foodItemHover: null }
    }
    case 'SET_SUGGESTED_AMOUNTS': {
      return { ...state, suggestedAmounts: action.data}
    }
    case 'UPDATE_SPECDIET_CURRENT': {
      let newState = { ...state, specdietOptionsCurrent: action.data }
      newState.basedataFilteredBySpecdiet = applySpecdietFilters(newState)
      newState.results = applyFilters(newState)
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
    let specdietRows = []
    if (!window.localStorage.getItem('basedata')) {
      console.log("Loading data from the server.")
      window.localStorage.setItem('basedata', JSON.stringify(await dataservice.getBasedata('food')))
      window.localStorage.setItem('components', JSON.stringify(await dataservice.getComponents()))
    }
    basedata = JSON.parse(window.localStorage.getItem('basedata'))
    components = JSON.parse(window.localStorage.getItem('components'))
    specdietRows = await dataservice.getSpecdietRows()
    const specdietOptions = specdietRows.reduce((res, i) => {
      if (res.length === 0) {
        return [{ key: i.thscode, text: i.shortname, value: i.thscode }]
      } else {
        return res.concat({ key: i.thscode, text: i.shortname, value: i.thscode })
      }
    }, [])
    console.log(specdietRows)
    dispatch({
      type: 'INIT_BASEDATA',
      data: basedata,
      components: components.classifiedRows,
      componentsOriginalRows: components.originalRows,
      suggestedAmounts: components.originalRows[1],
      specdietOptions: specdietOptions
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

export const setFoodItemHover = (data) => {
  return {
    type: 'SET_FOODITEM_HOVER',
    data: data
  }
}

export const setFoodItemHoverNull = () => {
  return {
    type: 'SET_FOODITEM_HOVER_NULL'
  }
}

export const setSuggestedAmounts = (data) => {
  return {
    type: 'SET_SUGGESTED_AMOUNTS',
    data: data
  }
}

export const updateSpecdietCurrent = (data) => {
  return {
    type: 'UPDATE_SPECDIET_CURRENT',
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

// const applySpecdietFilters = (newState) => {
//   // let filtered = [...state.basedata]
//   // state.specdietOptionsCurrent.forEach((specdiet) => {

//   // })
//   if (newState.specdietOptionsCurrent.length === 0) {
//     return { ...newState, basedataFilteredBySpecdiet: [...newState.basedata], results: [...newState.basedataFilteredByComponents] }
//   }

//   let start = window.performance.now()
//   let filtered = []
//   const data = newState.basedataFilteredByComponents.length < newState.basedata.length ? [...newState.basedataFilteredByComponents] : [...newState.basedata]
//   data.forEach(row => {
//     let count = 0
//     for (let i = 0; i < newState.specdietOptionsCurrent.length; i++) {
//       if (!row.specdiet || !row.specdiet.includes(newState.specdietOptionsCurrent[i])) {
//         count = 0
//         continue
//       }
//       count++
//       if (count === newState.specdietOptionsCurrent.length) {
//         //console.log("adding")
//         filtered = [...filtered, {...row}]
//       }
//     }
//   })

//   let end = window.performance.now()
//   let time = end - start
//   console.log("Specdiet-filter time: " + time, filtered)
//   return { ...newState, basedataFilteredBySpecdiet: [...filtered], results: [...filtered] }
// }

// const applyFilters = (state, newState) => {
//   let start = window.performance.now()
//   const filterKeys = Object.keys(newState.filters)
//   const data = newState.basedataFilteredBySpecdiet.length < newState.basedata.length ? [...newState.basedataFilteredBySpecdiet] : [...newState.basedata]
//   const filteredArray = data.filter(food => {
//     for (let i = 0; i < filterKeys.length; i++) {
//       if (food[filterKeys[i]] < newState.filters[filterKeys[i]]) {
//         return false
//       }
//     }
//     return true
//   })
//   let end = window.performance.now()
//   console.log(end - start)
//   return filteredArray
//     .sort((a, b) => parseFloat(b[newState.sortCode]) - parseFloat(a[newState.sortCode]))
// }