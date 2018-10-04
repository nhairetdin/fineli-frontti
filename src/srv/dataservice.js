import axios from 'axios'

const url = 'http://fineli.dy.fi:3002/'
const cfg = token => {
  return {
    headers: { authorization: `bearer ${token}` }
  }
}

const getBasedata = async endpoint => {
  const data = await axios.get(`${url}basedata/${endpoint}`)
  const copy = [...data.data].sort(
    (a, b) => parseFloat(b.ENERC) - parseFloat(a.ENERC)
  )
  return copy //.data.sort((a, b) => parseFloat(a['ENERC']) > parseFloat(b['ENERC']))
}

const getComponents = async () => {
  const data = await axios.get(`${url}basedata/components`)
  console.log(data)
  return data.data
}

const getSpecdietRows = async () => {
  const data = await axios.get(`${url}basedata/specdiet`)
  console.log(data)
  return data.data
}

const registerUser = async user => {
  try {
    const data = await axios.post(`${url}user`, user)
    return data
  } catch (e) {
    console.log(e, e.response)
    return e.response.data
  }
}

const loginUser = async user => {
  try {
    const data = await axios.post(`${url}user/session`, user)
    return data
  } catch (e) {
    return e.response.data
  }
}

const loadUserdata = async token => {
  try {
    const data = await axios.post(`${url}user/profile`, null, cfg(token))
    return data
  } catch (e) {
    return e.response.data
  }
}

const saveNewMeal = async (meal, token) => {
  try {
    const data = await axios.post(`${url}meal`, meal, cfg(token))
    return data
  } catch (e) {
    return e.response.data
  }
}

const deleteMeal = async (meal_id, token) => {
  try {
    const data = await axios.delete(`${url}meal/${meal_id}`, cfg(token))
    return data
  } catch (e) {
    return e.response.data
  }
}

const updateMeal = async (meal, token) => {
  const response = await axios.put(`${url}meal`, meal, cfg(token))
  return response
}

const setRecommendedValuesForUser = async (token, data) => {
  const response = await axios.post(`${url}user/settings`, data, cfg(token))
  return response.data
}

const getMealForUser = async token => {
  // let data
  // token = 'bearer ' + token
  // const config = {
  //   headers: { 'authorization': token }
  // }
  // try {
  //   data = await axios.get(`${url}meal`, cfg(token))
  // } catch (e) {
  //   data = e.response.data
  // }
  //return await axios.get(`${url}meal`, cfg(token))
}

export default {
  getBasedata,
  getComponents,
  registerUser,
  loginUser,
  loadUserdata,
  getSpecdietRows,
  getMealForUser,
  saveNewMeal,
  deleteMeal,
  updateMeal,
  setRecommendedValuesForUser
}
