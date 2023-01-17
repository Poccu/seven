import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { IUser } from '../../../types'

type Props = {}

const users: IUser[] = [
  {
    _id: 'lsm9012je',
    avatar: 'https://i.pravatar.cc/100?img=52',
    name: 'Remy Sharp',
    isInNetwork: true,
  },
  {
    _id: 'lsm901asd2je',
    avatar: 'https://i.pravatar.cc/100?img=1',
    name: 'Lea Sanity',
    isInNetwork: true,
  },
  {
    _id: 'lsm901123412je',
    avatar: 'https://i.pravatar.cc/100?img=12',
    name: 'Alex Black',
    isInNetwork: false,
  },
  {
    _id: 'lsm9512012je',
    avatar: 'https://i.pravatar.cc/100?img=24',
    name: 'Fiona Stars',
    isInNetwork: false,
  },
]

const UserItems = (props: Props) => {
  const navigate = useNavigate()

  return (
    <List>
      {users.map((user, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={() => navigate('/profile')}>
            <ListItemAvatar>
              <Avatar alt={user.name} src={user.avatar} />
            </ListItemAvatar>
            <ListItemText primary={user.name} secondary="Jan 9, 2014" />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default UserItems
