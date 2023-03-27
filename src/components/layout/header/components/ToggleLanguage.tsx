import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { IconButton, Typography } from '@mui/material'

import { enLocaleSpec } from '@assets/locales/en'
import { ruLocaleSpec } from '@assets/locales/ru'
import { useAppSelector, useAppDispatch } from '@hooks/redux'
import { setLangEN, setLangRU } from '@reducers/GlobalSlice'

export const ToggleLanguage: FC = () => {
  const { i18n } = useTranslation()

  const { language } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()

  useEffect(() => {
    i18n.changeLanguage(language)

    language === 'en'
      ? moment.updateLocale('en', enLocaleSpec)
      : moment.updateLocale('ru', ruLocaleSpec)
    // eslint-disable-next-line
  }, [language])

  const handleChangeLanguage = () => {
    language === 'ru' ? dispatch(setLangEN()) : dispatch(setLangRU())
  }

  return (
    <>
      {i18n.language === 'ru' ? (
        <IconButton
          onClick={handleChangeLanguage}
          color="primary"
          size="large"
          title="Сменить язык на EN"
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
    </>
  )
}
