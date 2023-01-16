import { menu } from './menuList'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import BorderBox from '../../../ui/BorderBox'
import { useNavigate } from 'react-router-dom'
import { Key, Logout } from '@mui/icons-material'
import { useAuth } from '../../../providers/useAuth'
import { signOut } from 'firebase/auth'

type Props = {}

const Menu = (props: Props) => {
  const { user, ga } = useAuth()
  const navigate = useNavigate()

  return (
    <BorderBox>
      <nav>
        <List>
          {user ? (
            <>
              {menu.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => navigate(item.link)}>
                    <ListItemIcon sx={{ mr: -2 }}>
                      <item.icon color="info" />
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton onClick={() => signOut(ga)}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <Logout color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/auth')}>
                <ListItemIcon sx={{ mr: -2 }}>
                  <Key color="error" />
                </ListItemIcon>
                <ListItemText primary="Auth" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </nav>
    </BorderBox>
  )
}

export default Menu
