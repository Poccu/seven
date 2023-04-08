import { useEffect, useState } from 'react'

const useHandleScroll = () => {
  const [numberVisiblePosts, setNumberVisiblePosts] = useState(4)
  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = (): void => {
    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = document.documentElement.scrollTop
    const innerHeight = window.innerHeight

    if (scrollHeight - (scrollTop + innerHeight) < 100) {
      setNumberVisiblePosts((prev) => prev + 1)
    }
  }
  return { numberVisiblePosts, setNumberVisiblePosts }
}

export default useHandleScroll
