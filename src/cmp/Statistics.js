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
  		const d = date.split('-')
  		let final = { pvm: date, dateObj: new Date(parseInt(d[0]), parseInt(d[1] - 1), parseInt(d[2])) }
  		Object.keys(preparedData[date]).forEach(foodComp => {
  			final[foodComp] = Math.round((100 / this.props.suggestions[foodComp]) * preparedData[date][foodComp])
  		})
  		return final
  	}).sort((a, b) => a.dateObj - b.dateObj)
  	//console.log(dataForDiagram)
  	return(
  		<ResponsiveContainer width='100%' aspect={4}>
  		<LineChart data={dataForDiagram}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
	       <XAxis dataKey="pvm"/>
	       <YAxis type="number" domain={[0, 300]}/>
	       <CartesianGrid strokeDasharray="5 5"/>
	       <Tooltip itemSorter={(a, b) => {
	       	return b.value - a.value
	       }}/>
	       <Legend />
	       <ReferenceLine y={100} label="Saantisuositus" stroke="red" strokeWidth="5"/>
	       { Object.keys(this.props.suggestions).map((key, index) => {
	       	   return (<Line type="monotone" dataKey={ key } stroke={colors[index]} strokeDasharray="8 2" key={ key } unit="%"/>)
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

const colors = [
	'#EF5350','#C62828','#7E57C2','#4527A0','#42A5F5','#1565C0',
	'#9CCC65','#558B2F','#D4E157','#9E9D24','#FFA726','#EF6C00',
	'#FF7043','#D84315','#8D6E63','#4E342E','#78909C','#37474F',
	'#66BB6A','#2E7D32','#00E676','#76FF03'
]
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
