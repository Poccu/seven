import { FC } from 'react'
import { Box, Link, Typography } from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import { builtWithList } from './builtWithList'
import { useTranslation } from 'react-i18next'

export const About: FC = () => {
  const { t } = useTranslation(['about'])
  document.title = t('title1')

  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/logo7.png`}
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
      <Typography>{t('line1')}</Typography>
      <Typography sx={{ mt: 3 }}>{t('line2')}</Typography>
      <ul>
        {builtWithList.map((x, index) => (
          <Link
            href={x.url}
            target="_blank"
            rel="noopener"
            underline="none"
            key={index}
          >
            <li>{x.title}</li>
          </Link>
        ))}
      </ul>
    </BorderBox>
  )
}
