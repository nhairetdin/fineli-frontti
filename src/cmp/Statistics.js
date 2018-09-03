import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts'

class Statistics extends Component {
  render() {
  	//console.log(this.props.meals)
  	const basedataAsObject = this.props.basedata.reduce((res, food) => {
  		res[food.foodid] = food
  		return res
  	}, {})
  	// console.log(basedataAsObject)
  	// console.log(this.props.suggestions)
  	const preparedData = this.props.meals.reduce((res, meal) => {
  		if (!res[meal.pvm]) {
  			res[meal.pvm] = {}
  			Object.keys(this.props.suggestions).forEach(key => res[meal.pvm][key] = 0)
  		}
  		meal.foods.forEach(food => {
  			Object.keys(this.props.suggestions).forEach(key => {
  				if (basedataAsObject[food.foodid][key.toUpperCase()] !== null) {
  					res[meal.pvm][key] = Math.round(
  						(res[meal.pvm][key] + (parseFloat(
  							basedataAsObject[food.foodid][key.toUpperCase()]
  						) * (food.amount / 100))) * 100
  					) / 100
  				}
  			})
  		})
  		return res
  	}, {})
  	const dataForDiagram = Object.keys(preparedData).map(date => {
  		let final = { pvm: date }
  		Object.keys(preparedData[date]).forEach(foodComp => {
  			final[foodComp] = Math.round((100 / this.props.suggestions[foodComp]) * preparedData[date][foodComp])
  		})
  		return final
  	})
  	//console.log(dataForDiagram)
  	return(
  		<ResponsiveContainer width='100%' aspect={4}>
  		<LineChart data={dataForDiagram}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
	       <XAxis dataKey="pvm"/>
	       <YAxis type="number" domain={[0, 300]}/>
	       <CartesianGrid strokeDasharray="3 3"/>
	       <Tooltip/>
	       <Legend />
	       <ReferenceLine y={100} label="Saantisuositus" stroke="red"/>
	       { Object.keys(this.props.suggestions).map(key => {
	       	   return (<Line type="monotone" dataKey={ key } stroke="#82ca9d" key={ key } unit="%"/>)
	       }) }
      </LineChart>
      </ResponsiveContainer>
  	)
  }
}

const mapStateToProps = (state) => {
	return {
		basedata: state.basedata,
		//suggestions: state.suggestedAmounts,
		suggestions: Object.keys(state.suggestedAmounts).reduce((res, component) => {
			const value = parseFloat(state.suggestedAmounts[component])
			if (value > 0) {
				res[component] = value
			}
			return res
		}, {}),
		meals: state.meals
	}
}

export default connect(
	mapStateToProps
)(Statistics)

// const dataForDiagram = this.props.meals.reduce((res, meal) => {
  	// 	if (res[meal.pvm]) {
  	// 		res[meal.pvm].foods = res[meal.pvm].foods.concat([...meal.foods])
  	// 	} else {
  	// 		res[meal.pvm] = {foods: [...meal.foods]}
  	// 	}
  	// 	return res
  	// 	//return res[meal.pvm] ? {...res,res[meal.pvm].foods.concat(meal.foods.map(food => {foodid: food.foodid, amount: food.amount}))} : { [meal.pvm]: {foods: meal.foods.map(food => {foodid: food.foodid, amount: food.amount})} }
  	// }, {})
  	// const dataForDiagram = this.props.meals.map((meal) => {
  	// 	let tmp = {}
  	// 	meal.foods.forEach(food => {
  	// 	  if (!tmp[food.foodid]) {
  	// 	  	tmp[food.foodid] = {...food}
  	// 	  } else {
  	// 	  	tmp[food.foodid] = {...tmp[food.foodid], amount: tmp[food.foodid].amount + food.amount}
  	// 	  }
  	// 	})
  	// 	return { pvm: meal.pvm, ...tmp }
  		//return res[meal.pvm] ? {...res,res[meal.pvm].foods.concat(meal.foods.map(food => {foodid: food.foodid, amount: food.amount}))} : { [meal.pvm]: {foods: meal.foods.map(food => {foodid: food.foodid, amount: food.amount})} }
  	//})
