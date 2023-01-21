import { FC, useEffect, useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import BorderBox from '../../ui/BorderBox'
import {
  collection,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { IUser } from '../../../types'
import { useAuth } from '../../providers/useAuth'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import moment from 'moment'

const UserItems: FC = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const { db, cur } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'asc'),
      limit(3)
    )

    const unsub = onSnapshot(q, (querySnapshot) => {
      const usersArr: IUser[] = []
      querySnapshot.forEach(async (d: DocumentData) => {
        usersArr.push(d.data())
      })
      setUsers(usersArr)
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <Box sx={{ mb: 2 }}>
      <BorderBox>
        <List>
          {users.map((user, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(`/profile/${user.uid}`)}>
                <ListItemAvatar>
                  <ThemeAvatar alt={user.displayName} src={user.photoURL}>
                    {user?.displayName?.match(/[\p{Emoji}\u200d]+/gu)}
                  </ThemeAvatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user?.displayName?.replace(
                    /[\p{Emoji}\u200d]+/gu,
                    ''
                  )}
                  secondary={moment(+user.createdAt).format('DD MMM - HH:mm')}
                  // secondary={user.createdAt}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </BorderBox>
    </Box>
  )
}

export default UserItems
