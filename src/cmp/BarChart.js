import React from 'react'

// A simple colored bar chart made with basic html/css.
// Used to display the relative shares between prot/fat/hh
// in the table. Width is simply defined as a css rule.
const BarChart = (props) => {
  let { prot, fat, hh } = Object.keys(props).reduce((res, item) => {
    res[item] = parseFloat(props[item])
    return res
  }, {})
  
  const diff = (prot+fat+hh) - 100
  if (diff > 0) {
    if (prot > 50) {
      prot = prot - diff
    } else if (fat > 50) {
      fat = fat - diff
    } else {
      hh = hh - diff
    }
  }

  const protStyle = {
    width: `${prot}%`,
    height: '10px',
    backgroundColor: '#8ef1ae',
    float: 'left'
  }

  const fatStyle = {
    width: `${fat}%`,
    height: '10px',
    backgroundColor: '#ff8d8d',
    float: 'left'
  }

  const hhStyle = {
    width: `${hh}%`,
    height: '10px',
    backgroundColor: '#a8a8ff',
    float: 'left'
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={protStyle} />
      <div style={fatStyle} />
      <div style={hhStyle} />
    </div>
  )
}

export default BarChart
