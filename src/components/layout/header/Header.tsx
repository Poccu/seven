import { FC, useEffect, useState } from 'react'
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
import MenuIcon from '@mui/icons-material/Menu'
import {
  BookmarkBorder,
  InfoOutlined,
  Logout,
  Person,
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Link as RouterLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { menu } from '../sidebar/menu/menuList'
import {
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
} from 'firebase/database'
import { signOut } from 'firebase/auth'
import { useAuth } from '../../providers/useAuth'
import { StyledMenu } from '../../ui/ThemeMenu'
import { globalSlice } from '../../../store/reducers/GlobalSlice'
import { userSlice } from '../../../store/reducers/UserSlice'
import { usersSlice } from '../../../store/reducers/UsersSlice'
import { postsSlice } from '../../../store/reducers/PostsSlice'
import { bookmarksSlice } from '../../../store/reducers/BookmarksSlice'

export const Header: FC = () => {
  const { t, i18n } = useTranslation(['menu'])
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const navigate = useNavigate()
  const { ga, rdb } = useAuth()

  const { isAuth, uid } = useAppSelector((state) => state.user)
  const { language, theme } = useAppSelector((state) => state.global)
  const { setLangRU, setLangEN, setThemeLight, setThemeDark } =
    globalSlice.actions
  const { removeUser } = userSlice.actions
  const { removeUsers } = usersSlice.actions
  const { removePosts } = postsSlice.actions
  const { removeBookmarks } = bookmarksSlice.actions
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
                    <MenuIcon fontSize="inherit" />
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
                      component={RouterLink}
                      to={`/profile/${uid}`}
                      onClick={handleClose}
                    >
                      <Person />
                      <ListItemText>{t('title10')}</ListItemText>
                    </MenuItem>
                    {menu.map((item, index) => (
                      <MenuItem
                        component={RouterLink}
                        to={item.link}
                        onClick={handleClose}
                        key={`menu${index}`}
                      >
                        <item.icon />
                        <ListItemText>{t(`title${index}`)}</ListItemText>
                      </MenuItem>
                    ))}
                    <MenuItem
                      component={RouterLink}
                      to="/bookmarks"
                      onClick={handleClose}
                    >
                      <BookmarkBorder />
                      <ListItemText>{t('title6')}</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      component={RouterLink}
                      to="/about"
                      onClick={handleClose}
                    >
                      <InfoOutlined />
                      <ListItemText>{t('title7')}</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      component={RouterLink}
                      to="/"
                      onClick={handleLogout}
                    >
                      <Logout />
                      <ListItemText>{t('title8')}</ListItemText>
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
                  title={t('title4', { ns: ['other'] }) || ''}
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
                  title={t('title4', { ns: ['other'] }) || ''}
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
                  title={t('title1', { ns: ['other'] }) || ''}
                  sx={{ width: '50px ', height: '50px' }}
                >
                  <LightModeOutlined fontSize="inherit" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => dispatch(setThemeDark())}
                  color="primary"
                  size="large"
                  title={t('title2', { ns: ['other'] }) || ''}
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
