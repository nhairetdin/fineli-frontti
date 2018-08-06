import axios from 'axios'

const url = 'http://localhost:3002/'

const getBasedata = async (endpoint) => {
  //console.log("fetching..")
  const data = await axios.get(`${url}basedata/${endpoint}`)
  //console.log("done..", data.data)
  const copy = [...data.data].sort((a, b) => parseFloat(b.ENERC) - parseFloat(a.ENERC))
  //console.log(copy)
  return copy//.data.sort((a, b) => parseFloat(a['ENERC']) > parseFloat(b['ENERC']))
}

const getComponents = async () => {
  const data = await axios.get(`${url}basedata/components`)
  console.log(data)
  return data.data
}

const registerUser = async (user) => {
  let data
  try {
    data = await axios.post(`${url}user`, user)
  } catch (e) {
    console.log(e, e.response)
    data = e.response.data
  }
  return data
}

const loginUser = async (user) => {
  let data
  try {
    data = await axios.post(`${url}user/session`, user)
  } catch (e) {
    data = e.response.data
  }
  return data
}

export default { getBasedata, getComponents, registerUser, loginUser }