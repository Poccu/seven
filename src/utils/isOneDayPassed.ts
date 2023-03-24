export const isOneDayPassed = (timestamp: number) => {
  return Date.now() - timestamp < 86400000 ? false : true
}
