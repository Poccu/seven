import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signOut } from 'firebase/auth'
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from 'firebase/database'

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Box,
} from '@mui/material'
import {
  BookmarkBorder,
  InfoOutlined,
  Logout,
  Person,
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useAuth } from '@providers/useAuth'
import { userSlice } from '@reducers/UserSlice'
import { usersSlice } from '@reducers/UsersSlice'
import { postsSlice } from '@reducers/PostsSlice'
import { bookmarksSlice } from '@reducers/BookmarksSlice'
import { BorderBox } from '@ui/ThemeBox'

import { menu } from './menuList'

export const Menu: FC = () => {
  const { t } = useTranslation(['menu'])
  const { ga, rdb } = useAuth()
  const navigate = useNavigate()

  const { uid, bookmarks } = useAppSelector((state) => state.user)
  const { removeUser } = userSlice.actions
  const { removeUsers } = usersSlice.actions
  const { removePosts } = postsSlice.actions
  const { removeBookmarks } = bookmarksSlice.actions
  const dispatch = useAppDispatch()

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

    signOut(ga)
    dispatch(removeUser())
    dispatch(removeUsers())
    dispatch(removePosts())
    dispatch(removeBookmarks())
    navigate('/')
  }

  return (
    <BorderBox>
      <nav>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/profile/${uid}`)}>
              <ListItemIcon sx={{ mr: -2 }}>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('My profile')} />
            </ListItemButton>
          </ListItem>
          {menu.map((item, index) => (
            <ListItem key={`menu${index}`} disablePadding>
              <ListItemButton onClick={() => navigate(item.link)}>
                <ListItemIcon sx={{ mr: -2 }}>
                  <item.icon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t(`title${index}`)} />
              </ListItemButton>
            </ListItem>
          ))}
          <Box
            sx={{ height: '48px', cursor: 'pointer' }}
            onClick={() => navigate('/bookmarks')}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ mr: -2 }}>
                  <BookmarkBorder color="primary" />
                </ListItemIcon>
                <ListItemText primary={t('Bookmarks')} />
              </ListItemButton>
            </ListItem>
            <Badge
              color="primary"
              badgeContent={bookmarks?.length}
              max={99}
              sx={{
                position: 'relative',
                top: '-25px',
                left: '245px',
                display: { md: 'none', lg: 'inline' },
              }}
            />
          </Box>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/about')}>
              <ListItemIcon sx={{ mr: -2 }}>
                <InfoOutlined color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('About')} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ mr: -2 }}>
                <Logout color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('Logout')} />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </BorderBox>
  )
}
