import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Link, Typography } from '@mui/material'
import { Paid } from '@mui/icons-material'

import logo from '@assets/images/logo7.png'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeButton } from '@ui/ThemeButton'

import { builtWithList } from './builtWithList'

export const About: FC = () => {
  const { t } = useTranslation(['about'])
  document.title = t('About')

  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <img
          src={logo}
          alt="Seven"
          height="150px"
          width="150px"
          draggable={false}
        />
      </Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: '400', letterSpacing: 3, mb: 4 }}
        color="primary"
        textAlign="center"
      >
        SEVEN
      </Typography>
      <Typography>{t('content')}</Typography>
      <Typography sx={{ mt: 3 }}>{t('Built with:')}</Typography>
      <ul>
        {builtWithList.map((item, index) => (
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            key={index}
          >
            <li>{item.title}</li>
          </Link>
        ))}
      </ul>
      <Box textAlign="center">
        <ThemeButton
          onClick={() =>
            window.open('https://www.donationalerts.com/r/poccu', '_blank')
          }
          startIcon={<Paid style={{ fontSize: '30px' }} />}
          sx={{ mt: 1 }}
        >
          {t('Support')}
        </ThemeButton>
      </Box>
    </BorderBox>
  )
}
