export const showUserNameLikes = (name: string | undefined) => {
  if (!name) return
  return name.replace(/ .*/, '').length < 12
    ? name.replace(/ .*/, '')
    : name.replace(/ .*/, '').slice(0, 11) + '…'
}
