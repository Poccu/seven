export const moveFocusAtEnd = (e: any) => {
  let temp_value = e.target.value
  e.target.value = ''
  e.target.value = temp_value
}
