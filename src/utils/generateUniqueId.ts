export const generateUniqueId = () => {
  let charList =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  let uniqueId = ''
  let x = 20 // uniqueId length

  while (x > 0) {
    let index = Math.floor(Math.random() * charList.length) // pick random index from charList
    uniqueId += charList[index]
    x--
  }

  return uniqueId
}
