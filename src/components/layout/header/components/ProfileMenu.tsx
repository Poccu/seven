import { FC, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signOut } from 'firebase/auth'
import {
  ref,
  onValue,
  set,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database'

import {
  Box,
  ClickAwayListener,
  Divider,
  Grow,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popper,
  Typography,
} from '@mui/material'
import { Logout, Tune, Person } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { removeUser } from '@reducers/UserSlice'
import { removeUsers } from '@reducers/UsersSlice'
import { removePosts } from '@reducers/PostsSlice'
import { removeBookmarks } from '@reducers/BookmarksSlice'
import { MenuBox } from '@ui/ThemeBox'
import { ThemeAvatar } from '@ui/ThemeAvatar'

export const ProfileMenu: FC = () => {
  const { t } = useTranslation(['menu'])
  const { rdb, ga } = useAuth()
  const navigate = useNavigate()

  const { uid, displayName, photoURL, emoji } = useAppSelector(
    (state) => state.user
  )
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
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

    setOpen(false)
    signOut(ga)
    dispatch(removeUser())
    dispatch(removeUsers())
    dispatch(removePosts())
    dispatch(removeBookmarks())
    navigate('/')
  }

  return (
    <Box
      onMouseOver={handleToggle}
      onMouseOut={handleToggle}
      sx={{ display: { xs: 'none', md: 'block' } }}
    >
      <Box
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        component={Link}
        to={`/profile/${uid}`}
      >
        <ThemeAvatar
          alt={displayName || ''}
          src={photoURL || ''}
          sx={{ width: '50px', height: '50px', ml: 1 }}
        >
          {emoji}
        </ThemeAvatar>
      </Box>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
        sx={{ zIndex: 10, pt: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right top',
            }}
          >
            <MenuBox>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    component={Link}
                    to={`/profile/${uid}`}
                    onClick={handleClose}
                  >
                    <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                      <Person color="primary" />
                    </ListItemIcon>
                    <Typography>{t('My profile')}</Typography>
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to={'/profile/settings'}
                    onClick={handleClose}
                  >
                    <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                      <Tune color="primary" />
                    </ListItemIcon>
                    <Typography>{t('Settings')}</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                      <Logout color="primary" />
                    </ListItemIcon>
                    <Typography>{t('Logout')}</Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </MenuBox>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}
