import { FC } from 'react'
import { Stack, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { Link } from 'react-router-dom'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { useTranslation } from 'react-i18next'

const Friends: FC = () => {
  const { t } = useTranslation(['friends'])
  const { user } = useAuth()
  document.title = t('title1')

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>{t('title1')}</b>
        </Typography>
      </BorderBox>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Stack spacing={3}>
          {user && user?.friends?.length > 0 ? (
            user?.friends.map((x) => (
              <Link to={`/profile/${x.uid}`} key={x.uid}>
                <Stack direction="row" spacing={4} alignItems="center">
                  <ThemeAvatar
                    alt={x.displayName}
                    src={x.photoURL}
                    sx={{
                      height: '80px',
                      width: '80px',
                    }}
                    draggable="false"
                  >
                    <Typography variant="h4">{x.emoji}</Typography>
                  </ThemeAvatar>
                  <Typography variant="h5">
                    <b>{x.displayName}</b>
                  </Typography>
                </Stack>
              </Link>
            ))
          ) : (
            <Typography
              variant="h4"
              textAlign="center"
              color="textSecondary"
              sx={{ my: 4 }}
            >
              <b>{t('line1')}</b>
            </Typography>
          )}
        </Stack>
      </BorderBox>
    </>
  )
}

export default Friends