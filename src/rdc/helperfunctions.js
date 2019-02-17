export const applySpecdietFilters = newState => {
  if (newState.specdietOptionsCurrent.length === 0) {
    return newState.basedata
  }

  let filtered = []
  newState.basedata.forEach(row => {
    let count = 0
    for (let i = 0; i < newState.specdietOptionsCurrent.length; i++) {
      if (
        !row.specdiet ||
        !row.specdiet.includes(newState.specdietOptionsCurrent[i])
      ) {
        count = 0
        continue
      }
      count++
      if (count === newState.specdietOptionsCurrent.length) {
        filtered = [...filtered, { ...row }]
      }
    }
  })
  return [...filtered]
}

export const applyFilters = newState => {
  //let start = window.performance.now()
  const filterKeys = Object.keys(newState.filters)
  const data = newState.basedataFilteredBySpecdiet
  const filteredArray = data.filter(food => {
    for (let i = 0; i < filterKeys.length; i++) {
      if (food[filterKeys[i]] < newState.filters[filterKeys[i]]) {
        return false
      }
    }
    return true
  })
  return filteredArray
}

export const sortResult = (data, sortCode, sortOrderDecreasing) => {
  return data.sort((a, b) => {
    a = a[sortCode]
    b = b[sortCode]
    a = (a === null || a === undefined) ? 0 : a
    b = (b === null || b === undefined) ? 0 : b

    if (!sortOrderDecreasing) {
      return parseFloat(b) < parseFloat(a) ? 1 : -1
    } else {
      return parseFloat(b) < parseFloat(a) ? -1 : 1
    }
  })
}

export const sortMeals = (meals) => {
  let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})
  return meals.sort((a, b) => {
    return collator.compare(b.pvm, a.pvm)
  })
}