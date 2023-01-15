import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

type Props = {}

const users = [
  {
    avatar: 'https://i.pravatar.cc/200?img=52',
    name: 'Remy Sharp',
    isOnline: true,
  },
  {
    avatar: 'https://i.pravatar.cc/200?img=1',
    name: 'Lea Sanity',
    isOnline: true,
  },
  {
    avatar: 'https://i.pravatar.cc/200?img=12',
    name: 'Alex Black',
    isOnline: false,
  },
  {
    avatar: 'https://i.pravatar.cc/200?img=24',
    name: 'Fiona Stars',
    isOnline: false,
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
