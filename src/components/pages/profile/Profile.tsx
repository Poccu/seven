import { FC, useEffect, useState } from 'react'
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { ThemeProfileAvatar } from '../../ui/ThemeAvatar'
import { useParams } from 'react-router-dom'
import {
  collection,
  doc,
  DocumentData,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
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
  const { db, usersRdb } = useAuth()
  const { id } = useParams()
  const profileId = window.location.pathname.replace('/profile/', '')
  const { uid } = useAppSelector((state) => state.user)

  const [user, setUser] = useState<DocumentData | undefined>({} as IUser)
  // console.log('user', user)

  const [userPosts, setUserPosts] = useState<IPost[]>([])
  // console.log('userPosts', userPosts)

  document.title = user?.displayName

  useEffect(() => {
    if (!uid) return
    const unsub = onSnapshot(doc(db, 'users', id || uid), (doc) => {
      const userData: DocumentData | undefined = doc.data()
      setUser(userData)
    })

    // Find user posts
    const q = query(
      collection(db, 'posts'),
      where('author.uid', '==', id || uid)
    )

    const setPostsFunc = onSnapshot(q, (querySnapshot) => {
      const postsArr: IPost[] = []
      querySnapshot.forEach(async (d: DocumentData) => {
        // console.log('AUTHOR HERE', d.data())
        postsArr.push(d.data())
      })
      setUserPosts(postsArr)
    })

    return () => {
      unsub()
      setPostsFunc()
    }
  }, [db, uid, id])

  return (
    <>
      <BorderBox sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          spacing={3}
        >
          <Box>
            {user?.uid ? (
              <>
                <ThemeProfileAvatar
                  alt={user?.displayName}
                  src={user?.photoURL}
                  draggable="false"
                >
                  <Typography variant="h2">{user?.emoji}</Typography>
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
                  {user?.displayName ? (
                    <b>{user.displayName}</b>
                  ) : (
                    <Skeleton width={250} />
                  )}
                </Typography>
                {user?.uid === 'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
                  <Tooltip
                    title={t('title3', { ns: ['other'] })}
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
                {user?.uid && usersRdb[profileId]?.isOnline ? (
                  t('line1', { ns: ['other'] })
                ) : user?.uid && usersRdb[profileId]?.lastOnline ? (
                  `${t('line2', { ns: ['other'] })} ${moment(
                    usersRdb[profileId]?.lastOnline
                  ).calendar()}`
                ) : user?.uid &&
                  !usersRdb[profileId]?.isOnline &&
                  !usersRdb[profileId]?.lastOnline ? (
                  t('line3', { ns: ['other'] })
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
                    {user?.uid ? (
                      <b>{user?.friends?.length}</b>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Typography>
                  <Typography color="textSecondary">
                    {user?.uid ? t('line1') : <Skeleton width={50} />}
                  </Typography>
                </Stack>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{ width: '55px' }}
                >
                  <Typography variant="h4" color="textSecondary">
                    {user?.uid ? (
                      <b>{userPosts.length}</b>
                    ) : (
                      <Skeleton width={50} />
                    )}
                  </Typography>
                  <Typography color="textSecondary">
                    {user?.uid ? t('line2') : <Skeleton width={50} />}
                  </Typography>
                </Stack>
              </Stack>
              {uid !== profileId && user?.uid && <AddFriend />}
            </Stack>
          </Stack>
        </Stack>
      </BorderBox>
      <FriendList user={user} />
    </>
  )
}
