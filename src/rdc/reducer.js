import dataservice from '../srv/dataservice'
import deepcopy from 'deepcopy'

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
  specdietOptionsCurrent: [],
  meals: [],
  activeMeal: -1,
  activeMealUpdated: {},
  initialMeal: {
    name: "Uusi ateria",
    meal_id: -1,
    foods: []
  },
  errorMessage: null
  
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
    case 'SET_USER_MEALS': {
      return { ...state, meals: [...action.data]}
    }
    case 'SET_ACTIVE_MEAL': {
      //return {...state, activeMeal: {...action.data, foods: [...action.data.foods]}}
      return {...state, activeMeal: action.data}
    }
    case 'UPDATE_ACTIVE_MEAL_UPDATED': {
      return {...state, activeMealUpdated: {...state.activeMealUpdated, [action.data.foodid]: action.data.amount}}
    }
    case 'RESET_ACTIVE_MEAL_UPDATED': {
      return {...state, activeMealUpdated: {}}
    }
    case 'ADD_FOOD_FOR_MEAL': {
      let foods
      let index
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].meal_id === state.activeMeal) {
          foods = [...state.meals[i].foods, { ...action.data }]
          index = i
          break
        }
      }
      const newState = {...state, meals: deepcopy(state.meals)}
      //newState.meals[index].foods = foods
      newState.meals[index] = {...newState.meals[index], foods: foods, notSaved: true}
      return newState
      // let newMeals = [...state.meals]
      // newMeals[index].foods = [...foods]
      // console.log("OLD MEALS:", state.meals)
      // console.log("NEW MEALS", newMeals)
      // return {...state, meals: [...newMeals]}
    }
    case 'ADD_NEW_MEAL': {
      return {...state, meals: [...state.meals, {...state.initialMeal}]}
    }
    case 'CHANGE_MEAL_NAME': {
      let index
      let newState = { ...state, meals: [...state.meals] }
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].meal_id === state.activeMeal) {
          index = i
          break
        }
      }
      //console.log(action.data, index)
      //newState.meals[index].name = action.data
      newState.meals[index] = {...newState.meals[index], name: action.data, notSaved: true }

      console.log("OLD NAME: ", state.meals[index].name)
      console.log("NEW NAME: ", newState.meals[index].name)
      return {...newState}
    }
    case 'ADD_NEW_SAVED_MEAL': {
      const meals = deepcopy(state.meals).map(meal => {
        return meal.meal_id === -1 ? action.data : meal
      })
      return { ...state, meals: meals }
    }
    case 'SET_ERROR_MESSAGE': {
      return { ...state, errorMessage: action.data }
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

export const setUserMeals = (data) => {
  return {
    type: 'SET_USER_MEALS',
    data: data
  }
}

export const setActiveMeal = (data) => {
  return {
    type: 'SET_ACTIVE_MEAL',
    data: data
  }
}

export const setActiveMealUpdated = (data) => {
  return {
    type: 'UPDATE_ACTIVE_MEAL_UPDATED',
    data: data
  }
}

export const resetActiveMealUpdated = () => {
  return {
    type: 'RESET_ACTIVE_MEAL_UPDATED'
  }
}

export const addFoodForMeal = (data) => {
  console.log(data)
  return {
    type: 'ADD_FOOD_FOR_MEAL',
    data: data
  }
}

export const addNewMeal = () => {
  return {
    type: 'ADD_NEW_MEAL'
  }
}

export const changeMealName = (data) => {
  return {
    type: 'CHANGE_MEAL_NAME',
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

export const saveNewMeal = (meal, token) => {
  return async (dispatch) => {
    const response = await dataservice.saveNewMeal(meal, token)
    if (response.msg) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        data: response
      })
    } else {
      dispatch({
        type: 'ADD_NEW_SAVED_MEAL',
        data: response.data
      })
    }
    // dispatch({
    //   type: 'ADD_NEW_SAVED_MEAL',
    //   data: meal
    // })
  }
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