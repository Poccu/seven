import { useEffect, useState } from 'react'

export const useHandleScroll = (start: number, count: number) => {
  const [numberVisiblePosts, setNumberVisiblePosts] = useState(start)

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line
  }, [])

  const handleScroll = (): void => {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop
    const innerHeight = window.innerHeight

    if (scrollHeight - (scrollTop + innerHeight) < 100) {
      setNumberVisiblePosts((prev) => prev + count)
    }
  }

  return { numberVisiblePosts, setNumberVisiblePosts }
}
