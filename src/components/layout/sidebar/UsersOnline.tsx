import { FC } from 'react'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { BorderBox } from '../../ui/ThemeBox'
import { useAuth } from '../../providers/useAuth'
import { ThemeOnlineBadge } from '../../ui/ThemeOnlineBadge'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { useAppSelector } from '../../../hooks/redux'

export const UsersOnline: FC = () => {
  const { usersRdb } = useAuth()

  const { users } = useAppSelector((state) => state.users)

  const onlineUsersList = Object.values(usersRdb).filter(
    (user: any) => user.isOnline === true
  )

  return (
    <BorderBox sx={{ mt: 2, p: 2 }}>
      <Typography variant="body2" color="textSecondary">
        {onlineUsersList.length > 0 ? (
          `Online ${onlineUsersList.length}`
        ) : (
          <Skeleton />
        )}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {onlineUsersList.length > 0
          ? onlineUsersList.map((user: any) => (
              <Box key={user.uid} sx={{ width: '55px', mb: 0 }}>
                <Link to={`/profile/${user.uid}`}>
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
                        width: '55px',
                        height: '55px',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="h5">{user.emoji}</Typography>
                    </ThemeAvatar>
                  </ThemeOnlineBadge>
                  <Typography
                    variant="body2"
                    textAlign="center"
                    fontSize="13px"
                  >
                    {user.displayName.replace(/ .*/, '').length < 8
                      ? user.displayName.replace(/ .*/, '')
                      : user.displayName.replace(/ .*/, '').slice(0, 7) + '…'}
                  </Typography>
                </Link>
              </Box>
            ))
          : [...Array(4).keys()].map((user) => (
              <Box key={user} sx={{ width: '55px', mb: 0 }}>
                <ThemeOnlineBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant="dot"
                >
                  <Skeleton
                    variant="circular"
                    sx={{ width: '55px', height: '55px', mb: 0.5 }}
                  />
                </ThemeOnlineBadge>
                <Typography variant="body2" textAlign="center" fontSize="13px">
                  <Skeleton />
                </Typography>
              </Box>
            ))}
      </Stack>
    </BorderBox>
  )
}
