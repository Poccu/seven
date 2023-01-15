import { menu } from './menuList'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material'
import BorderBox from '../../BorderBox'
import { useNavigate } from 'react-router-dom'

type Props = {}

const Menu = (props: Props) => {
  const navigate = useNavigate()

  return (
    <BorderBox>
      <nav>
        <List>
          {menu.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => navigate(item.link)}>
                <ListItemIcon sx={{ mr: -2 }}>
                  <item.icon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </nav>
    </BorderBox>
  )
}

export default Menu
