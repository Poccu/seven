export const generateUniqueId = () => {
  let charList =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

  let idDb = ''

  if (charList) {
    let x = 20
    while (x > 0) {
      let index = Math.floor(Math.random() * charList.length) // pick random index from charList
      idDb += charList[index]
      x--
    }
  }

  return idDb
}
