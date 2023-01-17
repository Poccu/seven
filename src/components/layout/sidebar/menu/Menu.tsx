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
import { InfoOutlined, Login, Logout } from '@mui/icons-material'
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
                <ListItemButton onClick={() => navigate('/about')}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <InfoOutlined color="info" />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItemButton>
              </ListItem>
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
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/auth')}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <Login color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Sign in" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/about')}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <InfoOutlined color="info" />
                  </ListItemIcon>
                  <ListItemText primary="About" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </nav>
    </BorderBox>
  )
}

export default Menu
