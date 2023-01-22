import { FC, useEffect, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { useParams } from 'react-router-dom'
import { doc, DocumentData, onSnapshot } from 'firebase/firestore'
import { IUser } from '../../../types'
import PhotoSettings from './PhotoSettings'

const Profile: FC = () => {
  const { db, cur } = useAuth()
  const { id } = useParams()
  const profileId = window.location.pathname.replace('/profile/', '')
  // console.log('cur', cur)

  const [user, setUser] = useState<DocumentData | undefined>({} as IUser)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', id || cur.uid), (doc) => {
      const userData: DocumentData | undefined = doc.data()
      setUser(userData)
    })

    return () => {
      unsub()
    }
  }, [id])

  return (
    <BorderBox>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <ThemeAvatar
              alt={user?.displayName}
              src={user?.photoURL}
              sx={{
                height: '150px',
                width: '150px',
                // border: '3px solid',
                // borderColor: '#b59261',
              }}
              draggable="false"
            >
              <Typography variant="h2">
                {user?.displayName?.match(/[\p{Emoji}\u200d]+/gu)}
              </Typography>
            </ThemeAvatar>
            {cur.uid === profileId && <PhotoSettings />}
          </Box>
          <Box
            justifyContent="left"
            //  alignItems="center"
            display="flex"
          >
            <Typography variant="h4">
              <b>
                {user?.displayName?.replace(/[\p{Emoji}\u200d]+/gu, '')}
                {user?.uid === 'HgxGhdMZc6TcrYNf80IfzoURccH2' && '⭐'}
              </b>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </BorderBox>
  )
}

export default Profile
