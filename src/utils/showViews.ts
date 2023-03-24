export const showViews = (views: number) => {
  return views < 1000 ? views : Math.floor(views / 100) / 10 + 'K'
}
