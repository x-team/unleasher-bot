export const dateToday = () => {
  return new Date()
}

export const dateNextWeek = () => {
  return new Date(dateToday().getTime() + 7 * 24 * 60 * 60 * 1000)
}

export const dateNextWeekISO = () => {
  return dateNextWeek().toISOString()
}
