import { FC, useEffect, useState } from 'react'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
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
import PhotoSettings from './PhotoSettings'
import { TaskAlt } from '@mui/icons-material'
import AddFriend from './AddFriend'
import FriendList from './FriendList'
import { useTranslation } from 'react-i18next'

const Profile: FC = () => {
  const { t } = useTranslation(['profile'])
  const { db, cur } = useAuth()
  const { id } = useParams()
  const profileId = window.location.pathname.replace('/profile/', '')
  // console.log('cur', cur)

  const [user, setUser] = useState<DocumentData | undefined>({} as IUser)
  // console.log('user', user)

  const [userPosts, setUserPosts] = useState<IPost[]>([])
  // console.log('userPosts', userPosts)

  document.title = user?.displayName

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', id || cur.uid), (doc) => {
      const userData: DocumentData | undefined = doc.data()
      setUser(userData)
    })

    // Find user posts
    const q = query(
      collection(db, 'posts'),
      where('author.uid', '==', id || cur.uid)
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
  }, [id])

  return (
    <>
      <BorderBox sx={{ p: 3 }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <ThemeAvatar
              alt={user?.displayName}
              src={user?.photoURL}
              sx={{
                height: '150px',
                width: '150px',
                border: '3px solid',
                borderColor: '#b59261',
              }}
              draggable="false"
            >
              <Typography variant="h2">{user?.emoji}</Typography>
            </ThemeAvatar>
            {cur.uid === profileId && <PhotoSettings />}
          </Box>
          <Stack direction="column" spacing={3.5}>
            <Box justifyContent="left" alignItems="baseline" display="flex">
              <Stack alignItems="center" direction="row" spacing={0.7}>
                <Typography variant="h4">
                  <b>{user?.displayName}</b>
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
            </Box>
            <Stack direction="row" spacing={2} sx={{ pl: 1 }}>
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ width: '55px' }}
              >
                <Typography variant="h4" color="textSecondary">
                  <b>{user?.friends?.length}</b>
                </Typography>
                <Typography color="textSecondary">{t('line1')}</Typography>
              </Stack>
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ width: '55px' }}
              >
                <Typography variant="h4" color="textSecondary">
                  <b>{userPosts.length}</b>
                </Typography>
                <Typography color="textSecondary">{t('line2')}</Typography>
              </Stack>
              {cur.uid !== profileId && <AddFriend />}
            </Stack>
          </Stack>
        </Stack>
      </BorderBox>
      <FriendList user={user} />
    </>
  )
}

export default Profile
