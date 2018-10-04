import React from 'react'

const BarChart = ({ prot, fat, hh }) => {
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
