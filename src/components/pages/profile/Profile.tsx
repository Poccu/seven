import { FC } from 'react'
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { ThemeProfileAvatar } from '../../ui/ThemeAvatar'
import { useParams } from 'react-router-dom'
import { IPost, IUser } from '../../../types'
import { PhotoSettings } from './PhotoSettings'
import { AddFriend } from './AddFriend'
import { FriendList } from './FriendList'
import { TaskAlt } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useAppSelector } from '../../../hooks/redux'

export const Profile: FC = () => {
  const { t } = useTranslation(['profile'])

  const { usersRdb } = useAuth()

  const usersRdbList = Object.values(usersRdb)

  // eslint-disable-next-line
  const { id } = useParams()
  const profileId = window.location.pathname.replace('/profile/', '')

  const { uid } = useAppSelector((state) => state.user)
  const { users } = useAppSelector((state) => state.users)
  const { posts } = useAppSelector((state) => state.posts)

  const user = users.find((user: IUser) => user.uid === profileId)
  const userPosts = posts.filter((post: IPost) => post.author.uid === profileId)

  document.title = user?.displayName || 'Seven'

  return (
    <>
      <BorderBox sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          spacing={3}
        >
          <Box>
            {usersRdbList.length > 0 && user?.uid ? (
              <>
                <ThemeProfileAvatar
                  alt={user.displayName}
                  src={user.photoURL}
                  draggable="false"
                >
                  <Typography variant="h2">{user.emoji}</Typography>
                </ThemeProfileAvatar>
                {uid === profileId && <PhotoSettings />}
              </>
            ) : (
              <Skeleton
                variant="circular"
                sx={{ height: '150px', width: '150px' }}
              />
            )}
          </Box>
          <Stack direction="column" spacing={3.5} sx={{ width: '100%' }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'center', sm: 'flex-start' }}
              spacing={2}
            >
              <Stack alignItems="center" direction="row" spacing={0.7}>
                <Typography variant="h4" sx={{ wordBreak: 'break-word' }}>
                  {usersRdbList.length > 0 && user?.displayName ? (
                    <b>{user.displayName}</b>
                  ) : (
                    <Skeleton width={250} />
                  )}
                </Typography>
                {usersRdbList.length > 0 &&
                  user?.uid === 'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
                    <Tooltip
                      title={t('Admin', { ns: ['other'] })}
                      placement="top"
                    >
                      <TaskAlt
                        color="info"
                        sx={{
                          width: '30px ',
                          height: '30px',
                        }}
                      />
                    </Tooltip>
                  )}
              </Stack>
              <Typography variant="body1" color="textSecondary">
                {usersRdbList.length > 0 &&
                user?.uid &&
                usersRdb[profileId]?.isOnline ? (
                  t('online', { ns: ['other'] })
                ) : usersRdbList.length > 0 &&
                  user?.uid &&
                  usersRdb[profileId]?.lastOnline ? (
                  `${t('last seen', { ns: ['other'] })} ${moment(
                    usersRdb[profileId]?.lastOnline
                  ).calendar()}`
                ) : usersRdbList.length > 0 &&
                  user?.uid &&
                  !usersRdb[profileId]?.isOnline &&
                  !usersRdb[profileId]?.lastOnline ? (
                  t('offline', { ns: ['other'] })
                ) : (
                  <Skeleton width={100} />
                )}
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="center"
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
            >
              <Stack direction="row" spacing={2}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: '55px' }}
                >
                  <Typography variant="h4" color="textSecondary">
                    {usersRdbList.length > 0 && user?.uid ? (
                      <b>{user.friends.length}</b>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Typography>
                  <Typography color="textSecondary">
                    {usersRdbList.length > 0 && user?.uid ? (
                      t('friends')
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Typography>
                </Stack>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: '55px' }}
                >
                  <Typography variant="h4" color="textSecondary">
                    {usersRdbList.length > 0 && user?.uid ? (
                      <b>{userPosts.length}</b>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Typography>
                  <Typography color="textSecondary">
                    {usersRdbList.length > 0 && user?.uid ? (
                      t('posts')
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Typography>
                </Stack>
              </Stack>
              {usersRdbList.length > 0 && uid !== profileId && user?.uid && (
                <AddFriend />
              )}
            </Stack>
          </Stack>
        </Stack>
      </BorderBox>
      <FriendList user={user} />
    </>
  )
}
