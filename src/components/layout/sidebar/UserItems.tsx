import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IUser } from '../../../types'
import { useAuth } from '../../providers/useAuth'

type Props = {}

const usersArr: IUser[] = [
  {
    uid: 'lsm9012je',
    photoURL: 'https://i.pravatar.cc/200?img=52',
    displayName: 'Remy Sharp',
    isInNetwork: true,
  },
  {
    uid: 'lsm901asd2je',
    photoURL: 'https://i.pravatar.cc/200?img=1',
    displayName: 'Lea Sanity',
    isInNetwork: true,
  },
  {
    uid: 'lsm901123412je',
    photoURL: 'https://i.pravatar.cc/200?img=12',
    displayName: 'Alex Black',
    isInNetwork: false,
  },
  {
    uid: 'lsm9512012je',
    photoURL: 'https://i.pravatar.cc/200?img=24',
    displayName: 'Fiona Stars',
    isInNetwork: false,
  },
]

const UserItems = (props: Props) => {
  const [userz, setUserz] = useState<IUser[]>([])
  const { db } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
      // limit(4)
    )

    const unsub = onSnapshot(q, (querySnapshot: any) => {
      const usersArr: any[] = []
      querySnapshot.forEach(async (d: any) => {
        usersArr.push(d.data())
      })
      setUserz(usersArr)
      console.log(usersArr)
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <List>
      {usersArr.map((user, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={() => navigate(`/profile/${user.uid}`)}>
            <ListItemAvatar>
              <Avatar alt={user.displayName} src={user.photoURL} />
            </ListItemAvatar>
            <ListItemText primary={user.displayName} secondary="Jan 9, 2014" />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default UserItems
