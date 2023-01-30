import { FC, useEffect, useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import {
  collection,
  doc,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { IUser } from '../../../types'
import { useAuth } from '../../providers/useAuth'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import moment from 'moment'

const FriendList: FC = () => {
  // const [users, setUsers] = useState<IUser[]>([])
  const [friends, setFriends] = useState<IUser[]>([])
  const { db, cur } = useAuth()
  // console.log(cur)

  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', cur.uid), (doc) => {
      const userData = doc.data()
      // console.log(userData)
      setFriends(userData?.friends)
    })

    return () => {
      unsub()
    }
  }, [cur])

  // useEffect(() => {
  //   const q = query(
  //     collection(db, 'users'),
  //     orderBy('createdAt', 'desc'),
  //     limit(3)
  //   )

  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     const usersArr: IUser[] = []
  //     querySnapshot.forEach(async (d: DocumentData) => {
  //       usersArr.push(d.data())
  //     })
  //     setUsers(usersArr)
  //   })

  //   return () => {
  //     unsub()
  //   }
  // }, [])

  return (
    <BorderBox sx={{ mt: 2, p: 2 }}>
      {friends.length > 0 ? (
        <>
          <Typography variant="body2" color="textSecondary">
            Friends {friends.length}
          </Typography>
          <Stack
            // justifyContent="center"
            direction="row"
            sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}
          >
            {friends.map((user) => (
              <Box key={user.uid} sx={{ width: '55px', mb: 0 }}>
                <Link to={`/profile/${user.uid}`}>
                  <ThemeAvatar
                    alt={user.displayName}
                    src={user.photoURL}
                    sx={{
                      width: '55px',
                      height: '55px',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h5">{user.emoji}</Typography>
                  </ThemeAvatar>
                  <Typography
                    variant="body2"
                    textAlign="center"
                    fontSize="13px"
                  >
                    {user.displayName.replace(/ .*/, '')}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Stack>
        </>
      ) : (
        <Typography sx={{ my: 5 }} textAlign="center">
          No friends yet 😞
        </Typography>
      )}
    </BorderBox>
  )
}

export default FriendList
