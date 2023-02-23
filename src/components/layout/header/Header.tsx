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
import { Theme } from '../../../types'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { Link as RouterLink } from 'react-router-dom'
import { useAppSelector } from '../../../hooks/redux'
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

export const Header: FC<Theme> = ({ light, setLight }) => {
  const { t, i18n } = useTranslation(['menu'])
  const [lang, setLang] = useState('ru') // set lang
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const navigate = useNavigate()
  const { ga, rdb } = useAuth()
  const { uid } = useAppSelector((state) => state.userReducer)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // localStorage
  useEffect(() => {
    let value = localStorage.getItem('lang')
    if (value !== null) {
      setLang(JSON.parse(value))
    } else {
      const prefLang = navigator.language.slice(0, 2)
      if (prefLang === 'en' || prefLang === 'ru') {
        setLang(prefLang)
      } else setLang('en')
    }
  }, [])

  useEffect(() => {
    if (lang !== null) {
      localStorage.setItem('lang', JSON.stringify(lang))

      i18n.changeLanguage(lang)
      lang === 'en'
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
            monthsShort:
              'янв_фев_мар_апр_мая_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
            calendar: {
              lastDay: '[вчера в] H:mm',
              sameDay: '[сегодня в] H:mm',
              nextDay: '[завтра в] H:mm',
              lastWeek: 'D MMM [в] H:mm',
              nextWeek: 'D MMM [в] H:mm',
              sameElse: 'D MMM YYYY',
            },
          })
    }
    // eslint-disable-next-line
  }, [lang])

  const handleChangeLanguage = () => {
    i18n.language === 'ru' ? setLang('en') : setLang('ru')
  }

  const handleLogout = () => {
    const isOnlineRef = ref(rdb, `users/${uid}/online`)
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
              {uid ? (
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
                  sx={{ mr: 2, fontWeight: '400', letterSpacing: 3 }}
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
              {!light ? (
                <IconButton
                  onClick={() => setLight(true)}
                  color="primary"
                  size="large"
                  title={t('title1', { ns: ['other'] }) || ''}
                  sx={{ width: '50px ', height: '50px' }}
                >
                  <LightModeOutlined fontSize="inherit" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => setLight(false)}
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
