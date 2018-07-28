import React from 'react'

const BarChart = ({ color, width }) => {
  const style = {
    width: `${width}%`,
    height: '10px',
    backgroundColor: color,
    float: 'left'
  }

  return (
    <div style={style}></div>
  )
}

export default BarChart
