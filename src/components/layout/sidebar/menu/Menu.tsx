import { FC } from 'react'
import { menu } from './menuList'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import { BorderBox } from '../../../ui/ThemeBox'
import { useNavigate } from 'react-router-dom'
import { InfoOutlined, Login, Logout, Person } from '@mui/icons-material'
import { useAuth } from '../../../providers/useAuth'
import { signOut } from 'firebase/auth'

const Menu: FC = () => {
  const { cur, ga } = useAuth()
  const navigate = useNavigate()

  const logoutHandler = () => {
    signOut(ga)
    navigate('/')
  }

  return (
    <BorderBox>
      <nav>
        <List>
          {cur ? (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/profile/${cur.uid}`)}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="My profile" />
                </ListItemButton>
              </ListItem>
              {menu.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => navigate(item.link)}>
                    <ListItemIcon sx={{ mr: -2 }}>
                      <item.icon color="primary" />
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
                <ListItemButton onClick={logoutHandler}>
                  <ListItemIcon sx={{ mr: -2 }}>
                    <Logout color="primary" />
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
                    <Login color="primary" />
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
