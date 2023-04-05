export const showUserNameUsers = (name: string | undefined) => {
  if (!name) return
  return name.length < 25 ? name : name.slice(0, 24) + '…'
}
