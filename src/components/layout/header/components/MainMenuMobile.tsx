import { FC, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signOut } from 'firebase/auth'
import { ref, onValue, set, onDisconnect } from 'firebase/database'
import { serverTimestamp } from 'firebase/firestore'

import { IconButton, MenuItem, ListItemText, Divider } from '@mui/material'
import { Person, Tune, Logout, Menu } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { removeUser } from '@reducers/UserSlice'
import { removeUsers } from '@reducers/UsersSlice'
import { removePosts } from '@reducers/PostsSlice'
import { removeBookmarks } from '@reducers/BookmarksSlice'
import { menu } from '@layout/sidebar/menu/menuList'
import { StyledMenu } from '@ui/ThemeMenu'

export const MainMenuMobile: FC = () => {
  const { t } = useTranslation(['menu'])
  const { ga, rdb } = useAuth()
  const navigate = useNavigate()

  const { uid } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    const isOnlineRef = ref(rdb, `users/${uid}/isOnline`)
    const lastOnlineRef = ref(rdb, `users/${uid}/lastOnline`)
    const connectedRef = ref(rdb, '.info/connected')

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        set(isOnlineRef, false)
        set(lastOnlineRef, serverTimestamp())

        onDisconnect(lastOnlineRef).set(serverTimestamp())
      }
    })

    setAnchorEl(null)
    signOut(ga)
    dispatch(removeUser())
    dispatch(removeUsers())
    dispatch(removePosts())
    dispatch(removeBookmarks())
    navigate('/')
  }

  return (
    <>
      <IconButton
        color="primary"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ width: '50px ', height: '50px' }}
      >
        <Menu fontSize="inherit" />
      </IconButton>
      <StyledMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem component={Link} to={`/profile/${uid}`} onClick={handleClose}>
          <Person />
          <ListItemText>{t('My profile')}</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          to={'/profile/settings'}
          onClick={handleClose}
        >
          <Tune />
          <ListItemText>{t('Settings')}</ListItemText>
        </MenuItem>
        <Divider />
        {menu.map((item, index) => (
          <MenuItem
            component={Link}
            to={item.link}
            onClick={handleClose}
            key={`menu${index}`}
          >
            <item.icon />
            <ListItemText>{t(item.title)}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem component={Link} to="/" onClick={handleLogout}>
          <Logout />
          <ListItemText>{t('Logout')}</ListItemText>
        </MenuItem>
      </StyledMenu>
    </>
  )
}
