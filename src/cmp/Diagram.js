import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts'

class Diagram extends Component {
  render() {
    const basedataAsObject = this.props.basedata.reduce((res, food) => {
      res[food.foodid] = food
      return res
    }, {})

    const preparedData = this.props.meals.reduce((res, meal) => {
      if (!res[meal.pvm]) {
        res[meal.pvm] = {}
        Object.keys(this.props.suggestions).forEach(
          key => (res[meal.pvm][key] = 0)
        )
      }
      meal.foods.forEach(food => {
        Object.keys(this.props.suggestions).forEach(key => {
          if (basedataAsObject[food.foodid][key.toUpperCase()] !== null) {
            res[meal.pvm][key] =
              Math.round(
                (res[meal.pvm][key] +
                  parseFloat(basedataAsObject[food.foodid][key.toUpperCase()]) *
                    (food.amount / 100)) *
                  100
              ) / 100
          }
        })
      })
      return res
    }, {})

    const dataForDiagram = Object.keys(preparedData)
      .map(date => {
        const d = date.split('-')
        let final = {
          pvm: date,
          dateObj: new Date(parseInt(d[0]), parseInt(d[1] - 1), parseInt(d[2]))
        }
        Object.keys(preparedData[date]).forEach(foodComp => {
          final[foodComp] = Math.round(
            (100 / this.props.suggestions[foodComp]) *
              preparedData[date][foodComp]
          )
        })
        return final
      })
      .sort((a, b) => a.dateObj - b.dateObj)

    return (
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart
          data={dataForDiagram}
          margin={{ top: 5, right: 30, bottom: 5 }}
        >
          <XAxis dataKey="pvm" />
          <YAxis type="number" domain={[0, 300]} />
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip
            itemSorter={(a, b) => {
              return b.value - a.value
            }}
          />
          <Legend />
          <ReferenceLine
            y={100}
            label="Saantisuositus"
            stroke="red"
            strokeWidth="3"
          />
          {Object.keys(this.props.suggestions).map((key, index) => {
            return (
              <Line
                type="monotone"
                dataKey={key}
                stroke={colors[key.toUpperCase()]}
                strokeWidth="2"
                key={key}
                unit="%"
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    basedata: state.basedata,
    //suggestions: state.suggestedAmounts,
    suggestions: Object.keys(state.suggestedAmounts)
      .filter(key => (state.diagramComponents[key] ? true : false))
      .reduce((res, component) => {
        const value = parseFloat(state.suggestedAmounts[component])
        if (value > 0) {
          res[component] = value
        }
        return res
      }, {}),
    meals: state.meals
  }
}

export default connect(mapStateToProps)(Diagram)

const colors = {
  ALC: '#616161',
  ENERC: '#212121',
  CHOAVL: '#651FFF',
  PROT: '#00E676',
  FAT: '#FF3D00',
  VITE: '#FFE0B2',
  VITD: '#FFCC80',
  VITK: '#FFB74D',
  CAROTENS: '#FFA726',
  VITA: '#FF9800',
  NIA: '#FB8C00',
  VITB12: '#F57C00',
  NIAEQ: '#EF6C00',
  VITPYRID: '#E65100',
  RIBF: '#FFD180',
  FOL: '#FFAB40',
  THIA: '#FF9100',
  VITC: '#FF6D00',
  ZN: '#00BFA5',
  FE: '#1DE9B6',
  ID: '#64FFDA',
  SE: '#A7FFEB',
  P: '#004D40',
  K: '#00695C',
  CA: '#00796B',
  MG: '#00897B',
  NA: '#009688',
  NACL: '#B2DFDB',
  FAPU: '#FFCCBC',
  F18D3N3: '#FFAB91',
  FAPUN3: '#FF8A65',
  F20D5N3: '#FF7043',
  FAPUN6: '#FF5722',
  F22D6N3: '#F4511E',
  FASAT: '#E64A19',
  FATRN: '#D84315',
  FAFRE: '#BF360C',
  FAMCIS: '#FF9E80',
  F18D2CN6: '#FF6E40',
  STERT: '#DD2C00',
  CHOLE: '#FBE9E7',
  FIBC: '#E1F5FE',
  FIBINS: '#B3E5FC',
  OA: '#81D4FA',
  SUGOH: '#4FC3F7',
  PSACNCS: '#29B6F6',
  FRUS: '#03A9F4',
  GALS: '#039BE5',
  SUCS: '#0288D1',
  GLUS: '#0277BD',
  SUGAR: '#01579B',
  LACS: '#80D8FF',
  MALS: '#40C4FF',
  STARCH: '#0091EA',
  TRP: '#E040FB'
}
