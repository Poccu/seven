export const showUserName = (name: string | undefined) => {
  if (!name) return
  return name.replace(/ .*/, '').length < 8
    ? name.replace(/ .*/, '')
    : name.replace(/ .*/, '').slice(0, 7) + '…'
}
