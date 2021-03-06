import dataservice from '../srv/dataservice'
import cloneDeep from '../clonedeep'
import {
  applySpecdietFilters,
  applyFilters,
  sortResult,
  sortMeals
} from './helperfunctions'

const initialState = {
  filters: {},
  sortCode: 'ENERC',
  sortOrderDecreasing: true,
  components: [],
  componentItemHover: null,
  componentsOriginalRows: [],
  activetab: 'search',
  basedata: [],
  basedataFilteredBySpecdiet: [],
  basedataFilteredByComponents: [],
  basedataPinned: [],
  results: [],
  user: false,
  registerModalOpen: false,
  loginModalOpen: false,
  openedFoodItem: null,
  searchKeyword: '',
  foodItemHover: null,
  suggestedAmounts: {},
  diagramComponents: {},
  specdietRows: [],
  specdietOptions: [],
  specdietOptionsCurrent: [],
  meals: [],
  activeMeal: {
    meal_id: -1
  },
  activeMealUpdated: {},
  initialMeal: {
    name: 'Uusi ateria',
    meal_id: -1,
    foods: []
  },
  errorMessage: null
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
      //newState.sortCode = action.sortCode
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
      return { ...state, activetab: action.data }
    }
    case 'SET_SORTCODE': {
      let sortOrderDecreasing
      if (action.data === state.sortCode) {
        // if user clicked same component, reverse sort ordering
        sortOrderDecreasing = !state.sortOrderDecreasing
        console.log(sortOrderDecreasing)
      } else {
        // else decreasing
        sortOrderDecreasing = true
      }
      return {
        ...state,
        sortCode: action.data, // action.data is the new sortcode
        sortOrderDecreasing: sortOrderDecreasing,
        results: [
          ...sortResult(state.results, action.data, sortOrderDecreasing)
        ]
      } // also give the sort order
    }
    case 'SET_USER': {
      return { ...state, user: action.data }
    }
    case 'LOGOUT': {
      const newState = { ...state, user: false, activeMeal: -1 }
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
      return { ...state, foodItemHover: [{ ...action.data }] }
    }
    case 'SET_FOODITEM_HOVER_FROM_MEAL': {
      const hoverFoods = action.data.map(food => {
        for (let i = 0; i < state.basedata.length; i++) {
          if (state.basedata[i].foodid === food.foodid) {
            return { ...state.basedata[i], amount: food.amount }
          }
        }
      })
      return { ...state, foodItemHover: [...hoverFoods] }
    }
    case 'SET_FOODITEM_HOVER_NULL': {
      return { ...state, foodItemHover: null }
    }
    case 'SET_SUGGESTED_AMOUNTS': {
      return { ...state, suggestedAmounts: { ...action.data } }
    }
    case 'SET_DIAGRAM_COMPONENTS': {
      return {
        ...state,
        diagramComponents: {
          ...state.diagramComponents,
          [action.data]:
            state.diagramComponents[action.data] === true ? false : true
        }
      }
    }
    case 'UPDATE_SPECDIET_CURRENT': {
      let newState = { ...state, specdietOptionsCurrent: action.data }
      newState.basedataFilteredBySpecdiet = applySpecdietFilters(newState)
      newState.results = sortResult(applyFilters(newState), state.sortCode)
      return newState
    }
    case 'SET_USER_MEALS': {
      //const meals = action.data.sort((a, b) => b.meal_id - a.meal_id)
      const meals = sortMeals(action.data)
      const activeMeal =
        meals.length > 0
          ? { ...meals[0], foods: [...meals[0].foods] }
          : { meal_id: -1 } // set active meal to be 'meal_id' of last element (newest meal) or initial (-1) if empty
      return { ...state, meals: [...meals], activeMeal: activeMeal }
    }
    case 'SET_ACTIVE_MEAL': {
      return {
        ...state,
        activeMeal: { ...action.data, foods: [...action.data.foods] }
      }
    }
    case 'UPDATE_ACTIVE_MEAL_UPDATED': {
      return {
        ...state,
        activeMealUpdated: {
          ...state.activeMealUpdated,
          [action.data.foodid]: action.data.amount
        }
      }
    }
    case 'RESET_ACTIVE_MEAL_UPDATED': {
      return { ...state, activeMealUpdated: {} }
    }
    case 'ADD_FOOD_FOR_MEAL': {
      let foods
      let index
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].meal_id === state.activeMeal.meal_id) {
          foods = [
            ...state.meals[i].foods.filter(
              food => food.foodid !== action.data.foodid
            ),
            { ...action.data }
          ]
          index = i
          break
        }
      }
      const newState = { ...state, meals: cloneDeep(state.meals) }
      newState.meals[index] = {
        ...newState.meals[index],
        foods: foods,
        notSaved: true
      }
      return newState
    }
    case 'ADD_NEW_MEAL': {
      return {
        ...state,
        meals: [{ ...state.initialMeal }, ...state.meals],
        activeMeal: { meal_id: -1 }
      }
    }
    case 'CHANGE_MEAL_NAME': {
      if (action.data === state.activeMeal.name) {
        return state
      }

      let index
      let newState = { ...state, meals: [...state.meals] }
      for (let i = 0; i < state.meals.length; i++) {
        if (state.meals[i].meal_id === state.activeMeal.meal_id) {
          index = i
          break
        }
      }
      //console.log("newState.meals[index].name", newState.meals[index].name)
      // if (newState.meals[index].name === action.data) {
      //   return state // don't change unless the name is actually different, fix this later
      // }

      newState.meals[index] = {
        ...newState.meals[index],
        name: action.data,
        notSaved: true
      }
      return { ...newState }
    }
    case 'ADD_NEW_SAVED_MEAL': {
      let added = false
      let meals = cloneDeep(state.meals).map(meal => {
        if (meal.meal_id === -1) {
          added = true
          return action.data
        } else {
          return meal
        }
      })
      if (action.data.meal_id > 0 && !added) {
        meals = [action.data].concat(meals)
      }
      return { ...state, meals: meals, activeMeal: action.data }
    }
    case 'SET_ERROR_MESSAGE': {
      return { ...state, errorMessage: action.data }
    }
    case 'REMOVE_MEAL': {
      const meals = [
        ...state.meals.filter(meal => meal.meal_id !== action.data)
      ]
      const highestMealId = meals.reduce((max, meal) => {
        return max > meal.meal_id ? max : meal.meal_id
      }, 0)
      return { ...state, meals: meals, activeMeal: { meal_id: highestMealId } }
    }
    case 'ADD_UPDATED_MEAL': {
      return {
        ...state,
        activeMeal: action.data,
        meals: [
          ...state.meals.map(meal => {
            return meal.meal_id === action.data.meal_id
              ? { ...action.data }
              : { ...meal }
          })
        ]
      }
    }
    case 'REMOVE_FOOD_FROM_MEAL': {
      //console.log(action.data)
      return {
        ...state,
        meals: [
          ...state.meals.map(meal => {
            return {
              ...meal,
              foods: [
                ...meal.foods.filter(food => {
                  //food.foodid !== action.data.foodid && meal.meal_id !== action.data.meal_id)], notSaved: meal.meal_id === action.data.meal_id ? true : false }
                  if (meal.meal_id !== action.data.meal_id) {
                    return true
                  }
                  if (food.foodid !== action.data.foodid) {
                    return true
                  }
                  return false
                })
              ],
              notSaved:
                meal.meal_id === action.data.meal_id || meal.notSaved === true
                  ? true
                  : false
            }
          })
        ]
      }
    }
    case 'PIN_FOOD': {
      let pinnedFood
      for (let i = 0; i < state.basedata.length; i++) {
        if (state.basedata[i].foodid === action.data) {
          pinnedFood = { ...state.basedata[i], pinned: true }
          break
        }
      }
      return {
        ...state,
        basedataPinned: [...state.basedataPinned, { ...pinnedFood }]
      }
    }
    case 'UNPIN_FOOD': {
      return {
        ...state,
        basedataPinned: [
          ...state.basedataPinned.filter(item => {
            return item.foodid !== action.data
          })
        ]
      }
    }
    case 'SET_COMPONENT_ITEM_HOVER': {
      return { ...state, componentItemHover: action.data }
    }
    case 'SET_MEAL_DATE': {
      let meals = state.meals.map(meal => {
        if (meal.meal_id !== action.data.meal_id) {
          return meal
        }
        return {
          ...meal,
          pvm: action.data.dateString
        }
      })

      meals = sortMeals(meals)

      return { ...state, meals: meals }
    }
    default:
      return state
  }
}

// Action creators:

export const initBasedata = data => {
  return {
    type: 'INIT_BASEDATA',
    ...data
  }
}

export const addFilter = (data, code) => {
  return {
    type: 'ADD_FILTER',
    data: data,
    sortCode: code
  }
}

export const removeFilter = data => {
  //console.log(data)
  return {
    type: 'REMOVE_FILTER',
    data: data
  }
}

export const changeTab = data => {
  return {
    type: 'CHANGE_ACTIVE_TAB',
    data: data
  }
}

export const setSortcode = data => {
  return {
    type: 'SET_SORTCODE',
    data: data
  }
}

export const logout = data => {
  window.localStorage.removeItem('user')
  return {
    type: 'LOGOUT',
    data: data
  }
}

export const login = () => {
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

export const openFoodItem = data => {
  return {
    type: 'SET_OPENED_FOOD_ITEM',
    data: data
  }
}

export const setSearchKeyword = data => {
  return {
    type: 'SET_SEARCHKEYWORD',
    data: data
  }
}

export const setFoodItemHover = data => {
  return {
    type: 'SET_FOODITEM_HOVER',
    data: data
  }
}

export const setFoodItemHoverFromMeal = foodidArray => {
  return {
    type: 'SET_FOODITEM_HOVER_FROM_MEAL',
    data: foodidArray
  }
}

export const setFoodItemHoverNull = () => {
  return {
    type: 'SET_FOODITEM_HOVER_NULL'
  }
}

export const setSuggestedAmounts = data => {
  return {
    type: 'SET_SUGGESTED_AMOUNTS',
    data: data
  }
}

export const setDiagramComponents = data => {
  return {
    type: 'SET_DIAGRAM_COMPONENTS',
    data: data
  }
}

export const updateSpecdietCurrent = data => {
  return {
    type: 'UPDATE_SPECDIET_CURRENT',
    data: data
  }
}

export const setUserMeals = data => {
  return {
    type: 'SET_USER_MEALS',
    data: data
  }
}

export const setActiveMeal = data => {
  console.log(data)
  return {
    type: 'SET_ACTIVE_MEAL',
    data: data
  }
}

export const setActiveMealUpdated = data => {
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

export const addFoodForMeal = data => {
  //console.log(data)
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

export const changeMealName = data => {
  return {
    type: 'CHANGE_MEAL_NAME',
    data: data
  }
}

// export const registerUser = data => {}

export const saveNewMeal = (meal, token) => {
  return async dispatch => {
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

export const removeMeal = meal_id => {
  return {
    type: 'REMOVE_MEAL',
    data: meal_id
  }
}

export const updateMeal = (meal, token) => {
  return async dispatch => {
    const response = await dataservice.updateMeal(meal, token)
    if (response.msg) {
      dispatch({
        type: 'SET_ERROR_MESSAGE',
        data: response
      })
    } else {
      dispatch({
        type: 'ADD_UPDATED_MEAL',
        data: response.data
      })
    }
  }
}

export const removeFoodFromMeal = (meal_id, foodid) => {
  return {
    type: 'REMOVE_FOOD_FROM_MEAL',
    data: {
      meal_id: meal_id,
      foodid: foodid
    }
  }
}

export const pinFood = foodid => {
  return {
    type: 'PIN_FOOD',
    data: foodid
  }
}

export const unpinFood = foodid => {
  return {
    type: 'UNPIN_FOOD',
    data: foodid
  }
}

export const setComponentItemHover = code => {
  return {
    type: 'SET_COMPONENT_ITEM_HOVER',
    data: code
  }
}

export const setMealDate = (meal_id, dateString) => {
  return {
    type: 'SET_MEAL_DATE',
    data: {
      meal_id: meal_id,
      dateString: dateString
    }
  }
}

export default reducer
