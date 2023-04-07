import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { PersonAddAlt1 } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { showUserName } from '@utils/showUserName'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeAvatar } from '@ui/ThemeAvatar'
import { ThemeOnlineBadge } from '@ui/ThemeOnlineBadge'
import { ThemeSmallButton } from '@ui/ThemeButton'
import { SkeletonUserFriend } from '@ui/skeletons/SkeletonUserFriend'

import { IUser } from 'src/types/types'

type Props = {
  user: IUser | undefined
}

export const FriendList: FC<Props> = ({ user }) => {
  const { t } = useTranslation(['profile'])
  const { usersRdb } = useAuth()
  const navigate = useNavigate()

  const { uid } = useAppSelector((state) => state.user)
  const { users } = useAppSelector((state) => state.users)

  const usersRdbList = Object.values(usersRdb)
  const profileId = window.location.pathname.replace('/profile/', '')

  return (
    <BorderBox sx={{ p: 2, mb: 2 }}>
      {usersRdbList.length > 0 && user?.uid ? (
        <>
          {user.friends.length > 0 ? (
            <>
              <Typography variant="body2" color="textSecondary">
                {`${t('Friends')} ${user.friends.length}`}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {user.friends.map((user: IUser) => (
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
                    <Typography
                      variant="body2"
                      textAlign="center"
                      fontSize="13px"
                    >
                      {showUserName(
                        users.find((u) => u.uid === user.uid)?.displayName
                      )}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </>
          ) : (
            <Stack direction="column" alignItems="center">
              <Typography
                variant="h4"
                textAlign="center"
                color="textSecondary"
                sx={{ my: 4 }}
              >
                <b>{t('No friends yet 😞', { ns: ['friends'] })}</b>
              </Typography>
              {uid === profileId && (
                <ThemeSmallButton
                  onClick={() => navigate('/users')}
                  startIcon={<PersonAddAlt1 />}
                >
                  <b>{t('Add friends')}</b>
                </ThemeSmallButton>
              )}
            </Stack>
          )}
        </>
      ) : (
        <>
          <Typography variant="body2" color="textSecondary">
            <Skeleton width={100} />
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {[...Array(4).keys()].map((user) => (
              <SkeletonUserFriend key={user} />
            ))}
          </Stack>
        </>
      )}
    </BorderBox>
  )
}
