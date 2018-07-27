import axios from 'axios'

const url = 'http://localhost:3002/'

const getBasedata = async (endpoint) => {
  console.log("fetching..")
  const data = await axios.get(`${url}basedata/${endpoint}`)
  console.log("done..", data.data)
  const copy = [...data.data].sort((a, b) => parseFloat(b.ENERC) - parseFloat(a.ENERC))
  //const copy2 = [...copy].sort((a, b) => b.ENERC - a.ENERC)
  //.sort((a, b) => a.foodid < b.foodid)
  console.log(copy)
  // if (data.data.length === 2000) {
  //   //console.log(data.data)
  //   console.log("copy:",copy)
  //   setTimeout(function() {
  //     const sorted = copy.sort((a, b) => {return (+a['ENERC']) - (+b['ENERC'])})
  //     console.log("sorted", sorted)
  //     //sorted.forEach(i => console.log(i.ENERC))
  //   }, 4000)
  // }
  return copy//.data.sort((a, b) => parseFloat(a['ENERC']) > parseFloat(b['ENERC']))
}

export default { getBasedata }