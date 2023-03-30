import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Stack, Typography } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'

type Props = {
  heightBack: number
}

export const ScrollBackButton: FC<Props> = ({ heightBack }) => {
  const { t } = useTranslation(['other'])

  const handleScroll = () => {
    window.scrollTo({ top: heightBack, behavior: 'smooth' })
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
      <ExpandMore color="primary" fontSize="large" />
      <Typography color="primary">
        <b>{t('Back')}</b>
      </Typography>
    </Stack>
  )
}
