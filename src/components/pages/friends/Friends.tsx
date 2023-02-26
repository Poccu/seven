import { FC } from 'react'
import { Stack, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { Link } from 'react-router-dom'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { useTranslation } from 'react-i18next'
import { ThemeOnlineBadge } from '../../ui/ThemeOnlineBadge'
import { useAppSelector } from '../../../hooks/redux'

export const Friends: FC = () => {
  const { t } = useTranslation(['friends'])
  const { usersRdb } = useAuth()
  document.title = t('title1')

  const { friends } = useAppSelector((state) => state.user)
  const { users } = useAppSelector((state) => state.users)

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>{t('title1')}</b>
        </Typography>
      </BorderBox>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Stack spacing={3}>
          {friends?.length ? (
            friends.map((x) => (
              <Link to={`/profile/${x.uid}`} key={x.uid}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <ThemeOnlineBadge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    variant={usersRdb[x.uid]?.isOnline ? 'dot' : undefined}
                  >
                    <ThemeAvatar
                      alt={x.displayName}
                      src={users.find((u) => u.uid === x.uid)?.photoURL}
                      sx={{
                        height: '55px',
                        width: '55px',
                      }}
                      draggable="false"
                    >
                      <Typography variant="h5">{x.emoji}</Typography>
                    </ThemeAvatar>
                  </ThemeOnlineBadge>
                  <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
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
