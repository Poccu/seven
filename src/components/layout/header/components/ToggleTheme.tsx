import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { IconButton } from '@mui/material'
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material'

import { useAppSelector, useAppDispatch } from '@hooks/redux'
import { setThemeDark, setThemeLight } from '@reducers/GlobalSlice'

export const ToggleTheme: FC = () => {
  const { t } = useTranslation()

  const { theme } = useAppSelector((state) => state.global)
  const dispatch = useAppDispatch()

  const handleChangeTheme = () => {
    theme === 'dark' ? dispatch(setThemeLight()) : dispatch(setThemeDark())
  }

  return (
    <>
      {theme === 'dark' ? (
        <IconButton
          onClick={handleChangeTheme}
          color="primary"
          size="large"
          title={t('Toggle Light Mode', { ns: ['other'] }) || ''}
          sx={{ width: '50px ', height: '50px' }}
        >
          <LightModeOutlined fontSize="inherit" />
        </IconButton>
      ) : (
        <IconButton
          onClick={handleChangeTheme}
          color="primary"
          size="large"
          title={t('Toggle Dark Mode', { ns: ['other'] }) || ''}
          sx={{ width: '50px ', height: '50px' }}
        >
          <DarkModeOutlined fontSize="inherit" />
        </IconButton>
      )}
    </>
  )
}
