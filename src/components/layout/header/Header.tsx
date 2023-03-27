import { FC } from 'react'

import { AppBar, Box, Container, Stack } from '@mui/material'

import { useAppSelector } from '@hooks/redux'

import { MainMenuMobile } from './components/MainMenuMobile'
import { Logo } from './components/Logo'
import { ToggleLanguage } from './components/ToggleLanguage'
import { ToggleTheme } from './components/ToggleTheme'
import { ProfileMenu } from './components/ProfileMenu'

export const Header: FC = () => {
  const { isAuth } = useAppSelector((state) => state.user)

  return (
    <Box component="header">
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ boxShadow: 3 }}
        component="div"
      >
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              sx={{ width: '100px', display: { xs: 'flex', md: 'none' } }}
            >
              {isAuth && <MainMenuMobile />}
            </Stack>
            <Logo />
            <Stack direction="row" sx={{ mr: 1 }}>
              <ToggleLanguage />
              <ToggleTheme />
              {isAuth && <ProfileMenu />}
            </Stack>
          </Stack>
        </Container>
      </AppBar>
    </Box>
  )
}
