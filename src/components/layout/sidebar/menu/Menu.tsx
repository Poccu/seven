import { FC } from 'react'
import { menu } from './menuList'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
  Box,
} from '@mui/material'
import { BorderBox } from '../../../ui/ThemeBox'
import { useNavigate } from 'react-router-dom'
import {
  BookmarkBorder,
  InfoOutlined,
  Login,
  Logout,
  Person,
} from '@mui/icons-material'
import { useAuth } from '../../../providers/useAuth'
import { signOut } from 'firebase/auth'
import { useTranslation } from 'react-i18next'
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from 'firebase/database'

export const Menu: FC = () => {
  const { t } = useTranslation(['menu'])
  const { cur, ga, user, rdb } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (user) {
      const isOnlineRef = ref(rdb, `users/${user.uid}/online`)
      const lastOnlineRef = ref(rdb, `users/${user.uid}/lastOnline`)
      const connectedRef = ref(rdb, '.info/connected')
      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          set(isOnlineRef, false)
          set(lastOnlineRef, serverTimestamp())

          onDisconnect(lastOnlineRef).set(serverTimestamp())
        }
      })
    }
    signOut(ga)
    navigate('/')
  }

  return (
    <BorderBox>
      <nav>
        <List>
          {cur ? (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/profile/${cur.uid}`)}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={t('title10')} />
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
                    <ListItemText primary={t('title6')} />
                  </ListItemButton>
                </ListItem>
                <Badge
                  color="primary"
                  badgeContent={user?.bookmarks.length}
                  max={99}
                  sx={{
                    position: 'relative',
                    top: '-37px',
                    left: '245px',
                  }}
                />
              </Box>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/about')}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <InfoOutlined color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={t('title7')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <Logout color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={t('title8')} />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/auth')}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <Login color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={t('title9')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/about')}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <InfoOutlined color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={t('title7')} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </nav>
    </BorderBox>
  )
}
