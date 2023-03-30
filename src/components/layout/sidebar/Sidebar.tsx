import { FC, useEffect, useState } from 'react'

import { Box } from '@mui/material'

import { Menu } from './components/Menu'
import { UsersOnline } from './components/UsersOnline'
import { ScrollToTopButton } from './components/ScrollToTopButton'

export const Sidebar: FC = () => {
  const [isVisible, setIsVisible] = useState(false)

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
      {isVisible && <ScrollToTopButton />}
    </>
  )
}
