import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Skeleton, Stack, Typography } from '@mui/material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeAvatar } from '@ui/ThemeAvatar'
import { ThemeOnlineBadge } from '@ui/ThemeOnlineBadge'

export const Friends: FC = () => {
  const { t } = useTranslation(['friends'])
  const { usersRdb } = useAuth()
  document.title = t('Friends')

  const { friends } = useAppSelector((state) => state.user)
  const { users } = useAppSelector((state) => state.users)

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>{t('Friends')}</b>
        </Typography>
      </BorderBox>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Stack spacing={3}>
          {users.length > 0 ? (
            <>
              {friends?.length ? (
                friends.map((user) => (
                  <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    key={user.uid}
                    component={Link}
                    to={`/profile/${user.uid}`}
                  >
                    <ThemeOnlineBadge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      variant={usersRdb[user.uid]?.isOnline ? 'dot' : undefined}
                    >
                      <ThemeAvatar
                        alt={user.displayName}
                        src={users.find((u) => u.uid === user.uid)?.photoURL}
                        sx={{
                          height: '55px',
                          width: '55px',
                        }}
                        draggable="false"
                      >
                        <Typography variant="h5">{user.emoji}</Typography>
                      </ThemeAvatar>
                    </ThemeOnlineBadge>
                    <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                      <b>
                        {users.find((u) => u.uid === user.uid)?.displayName}
                      </b>
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Typography
                  variant="h4"
                  textAlign="center"
                  color="textSecondary"
                  sx={{ my: 4 }}
                >
                  <b>{t('No friends yet 😞')}</b>
                </Typography>
              )}
            </>
          ) : (
            <>
              {[...Array(4).keys()].map((user) => (
                <Stack
                  direction="row"
                  spacing={3}
                  alignItems="center"
                  key={user}
                >
                  <Skeleton
                    variant="circular"
                    sx={{ width: '55px', height: '55px' }}
                  />
                  <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                    <Skeleton width={200} />
                  </Typography>
                </Stack>
              ))}
            </>
          )}
        </Stack>
      </BorderBox>
    </>
  )
}
