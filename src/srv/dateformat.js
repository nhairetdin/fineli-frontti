export const dateToObj = (date) => {
  const dateObj = {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
    seconds: new Date().getSeconds()
  }
  return dateObj
}