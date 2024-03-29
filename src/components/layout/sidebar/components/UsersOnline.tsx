import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Box, Skeleton, Stack, Typography } from '@mui/material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { showUserName } from '@utils/showUserName'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeAvatar } from '@ui/ThemeAvatar'
import { ThemeOnlineBadge } from '@ui/ThemeOnlineBadge'
import { SkeletonUserOnline } from '@ui/skeletons/SkeletonUserOnline'

export const UsersOnline: FC = () => {
  const { usersRdb } = useAuth()

  const { users } = useAppSelector((state) => state.users)

  const usersRdbList = Object.values(usersRdb)

  const onlineUsersList = Object.values(usersRdb).filter(
    (user: any) => user.isOnline === true
  )

  return (
    <BorderBox sx={{ p: 2, mb: 2 }}>
      <Typography variant="body2" color="textSecondary">
        {usersRdbList.length > 0 ? (
          `Online ${onlineUsersList.length}`
        ) : (
          <Skeleton width={100} />
        )}
      </Typography>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {usersRdbList.length > 0 && onlineUsersList.length > 0
          ? onlineUsersList.map((user: any) => (
              <Box
                key={user.uid}
                sx={{ width: '55px' }}
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
                      width: '55px',
                      height: '55px',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h5">{user.emoji}</Typography>
                  </ThemeAvatar>
                </ThemeOnlineBadge>
                <Typography variant="body2" textAlign="center" fontSize="13px">
                  {showUserName(user.displayName)}
                </Typography>
              </Box>
            ))
          : [...Array(4).keys()].map((user) => (
              <SkeletonUserOnline key={user} />
            ))}
      </Stack>
    </BorderBox>
  )
}
