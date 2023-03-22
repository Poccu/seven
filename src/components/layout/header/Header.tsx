import { FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signOut } from 'firebase/auth'
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from 'firebase/database'
import moment from 'moment'

import {
  AppBar,
  Box,
  Container,
  Divider,
  IconButton,
  ListItemText,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
import {
  BookmarkBorder,
  DarkModeOutlined,
  InfoOutlined,
  LightModeOutlined,
  Logout,
  Menu,
  Person,
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import {
  setLangEN,
  setLangRU,
  setThemeDark,
  setThemeLight,
} from '@reducers/GlobalSlice'
import { removeUser } from '@reducers/UserSlice'
import { removeUsers } from '@reducers/UsersSlice'
import { removePosts } from '@reducers/PostsSlice'
import { removeBookmarks } from '@reducers/BookmarksSlice'
import { StyledMenu } from '@ui/ThemeMenu'

import { menu } from '../sidebar/menu/menuList'

export const Header: FC = () => {
  const { t, i18n } = useTranslation(['menu'])
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const navigate = useNavigate()
  const { ga, rdb } = useAuth()

  const { isAuth, uid } = useAppSelector((state) => state.user)
  const { language, theme } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    i18n.changeLanguage(language)

    language === 'en'
      ? moment.updateLocale('en', {
          calendar: {
            lastDay: '[yesterday at] H:mm',
            sameDay: '[today at] H:mm',
            nextDay: '[tomorrow at] H:mm',
            lastWeek: 'D MMM [at] H:mm',
            nextWeek: 'D MMM [at] H:mm',
            sameElse: 'D MMM YYYY',
          },
        })
      : moment.updateLocale('ru', {
          monthsShort: 'янв_фев_мар_апр_мая_июн_июл_авг_сен_окт_ноя_дек'.split(
            '_'
          ),
          calendar: {
            lastDay: '[вчера в] H:mm',
            sameDay: '[сегодня в] H:mm',
            nextDay: '[завтра в] H:mm',
            lastWeek: 'D MMM [в] H:mm',
            nextWeek: 'D MMM [в] H:mm',
            sameElse: 'D MMM YYYY',
          },
        })
    // eslint-disable-next-line
  }, [language])

  const handleChangeLanguage = () => {
    language === 'ru' ? dispatch(setLangEN()) : dispatch(setLangRU())
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
              sx={{ ml: 1, display: { xs: 'flex', md: 'none' } }}
            >
              {isAuth ? (
                <Box>
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
                    <MenuItem
                      component={Link}
                      to={`/profile/${uid}`}
                      onClick={handleClose}
                    >
                      <Person />
                      <ListItemText>{t('My profile')}</ListItemText>
                    </MenuItem>
                    {menu.map((item, index) => (
                      <MenuItem
                        component={Link}
                        to={item.link}
                        onClick={handleClose}
                        key={`menu${index}`}
                      >
                        <item.icon />
                        <ListItemText>{t(`title${index}`)}</ListItemText>
                      </MenuItem>
                    ))}
                    <MenuItem
                      component={Link}
                      to="/bookmarks"
                      onClick={handleClose}
                    >
                      <BookmarkBorder />
                      <ListItemText>{t('Bookmarks')}</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      component={Link}
                      to="/about"
                      onClick={handleClose}
                    >
                      <InfoOutlined />
                      <ListItemText>{t('About')}</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem component={Link} to="/" onClick={handleLogout}>
                      <Logout />
                      <ListItemText>{t('Logout')}</ListItemText>
                    </MenuItem>
                  </StyledMenu>
                </Box>
              ) : (
                <Box sx={{ width: '50px ', height: '50px' }}></Box>
              )}
              <Box sx={{ width: '50px ', height: '50px' }}></Box>
            </Stack>
            <Link to="/">
              <Stack direction="row" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ height: '65px', ml: 1 }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/logo7.png`}
                    alt="Seven"
                    height="50px"
                    width="50px"
                    draggable={false}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    mr: 2,
                    fontWeight: '400',
                    letterSpacing: 3,
                    display: { xs: 'none', sm: 'block' },
                  }}
                  color="primary"
                >
                  SEVEN
                </Typography>
              </Stack>
            </Link>
            <Stack direction="row" sx={{ mr: 1 }}>
              {i18n.language === 'ru' ? (
                <IconButton
                  onClick={handleChangeLanguage}
                  color="primary"
                  size="large"
                  title={t('Сменить язык на EN', { ns: ['other'] }) || ''}
                  sx={{ width: '50px ', height: '50px' }}
                >
                  <Typography>
                    <b>EN</b>
                  </Typography>
                </IconButton>
              ) : (
                <IconButton
                  onClick={handleChangeLanguage}
                  color="primary"
                  size="large"
                  title={t('Change language to RU', { ns: ['other'] }) || ''}
                  sx={{ width: '50px ', height: '50px' }}
                >
                  <Typography>
                    <b>RU</b>
                  </Typography>
                </IconButton>
              )}
              {theme === 'dark' ? (
                <IconButton
                  onClick={() => dispatch(setThemeLight())}
                  color="primary"
                  size="large"
                  title={t('Toggle Light Mode', { ns: ['other'] }) || ''}
                  sx={{ width: '50px ', height: '50px' }}
                >
                  <LightModeOutlined fontSize="inherit" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => dispatch(setThemeDark())}
                  color="primary"
                  size="large"
                  title={t('Toggle Dark Mode', { ns: ['other'] }) || ''}
                  sx={{ width: '50px ', height: '50px' }}
                >
                  <DarkModeOutlined fontSize="inherit" />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Container>
      </AppBar>
    </Box>
  )
}
