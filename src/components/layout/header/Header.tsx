import { FC, useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material'
import { Theme } from '../../../types'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

export const Header: FC<Theme> = ({ light, setLight }) => {
  const { t, i18n } = useTranslation(['other'])
  const [lang, setLang] = useState('ru') // set lang

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
  }, [lang])

  const handleChangeLanguage = () => {
    i18n.language === 'ru' ? setLang('en') : setLang('ru')
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
                  title="Change language to EN"
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
                  title="Change language to RU"
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
                  title={t('title1') || ''}
                  sx={{ width: '50px ', height: '50px' }}
                >
                  <LightModeOutlined fontSize="inherit" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => setLight(false)}
                  color="primary"
                  size="large"
                  title={t('title2') || ''}
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
