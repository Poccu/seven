import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Stack, Typography } from '@mui/material'
import { ExpandLess } from '@mui/icons-material'

type Props = {
  height: number
  setHeightBack: React.Dispatch<React.SetStateAction<number>>
}

export const ScrollToTopButton: FC<Props> = ({ height, setHeightBack }) => {
  const { t } = useTranslation(['other'])

  const handleScroll = () => {
    setHeightBack(height)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'fixed',
        bottom: 0,
        right: '0.9rem',
        width: 200,
        height: 200,
        cursor: 'pointer',
        display: { xs: 'none', xl: 'flex' },
      }}
      onClick={handleScroll}
    >
      <ExpandLess color="primary" fontSize="large" />
      <Typography color="primary">
        <b>{t('Up')}</b>
      </Typography>
    </Stack>
  )
}
