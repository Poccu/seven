import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Box } from '@mui/material'

import { Menu } from './components/Menu'
import { UsersOnline } from './components/UsersOnline'
import { ScrollToTopButton } from './components/ScrollToTopButton'
import { ScrollBackButton } from './components/ScrollBackButton'

export const Sidebar: FC = () => {
  const { pathname } = useLocation()

  const [isVisible, setIsVisible] = useState(false)
  const [height, setHeight] = useState(0)
  const [heightBack, setHeightBack] = useState(0)

  useEffect(() => {
    setHeightBack(0)
  }, [pathname])

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = (e: any) => {
    const scrollTop = e.target.documentElement.scrollTop

    if (scrollTop > 1500) {
      setIsVisible(true)
      setHeight(scrollTop)
    } else {
      setIsVisible(false)
    }
  }

  return (
    <>
      <Box sx={{ position: 'sticky', top: '80px', mr: -2 }}>
        <Menu />
        <UsersOnline />
      </Box>
      {isVisible && (
        <ScrollToTopButton height={height} setHeightBack={setHeightBack} />
      )}
      {heightBack > 0 && !isVisible && (
        <ScrollBackButton heightBack={heightBack} />
      )}
    </>
  )
}
