import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Badge,
} from '@mui/material'

import { useAppSelector } from '@hooks/redux'
import { BorderBox } from '@ui/ThemeBox'

import { menu } from './menuList'

export const Menu: FC = () => {
  const { t } = useTranslation(['menu'])
  const navigate = useNavigate()

  const { bookmarks } = useAppSelector((state) => state.user)

  return (
    <BorderBox sx={{ mb: 2 }}>
      <nav>
        <List>
          {menu.map((item, index) => (
            <ListItem key={`menu${index}`} disablePadding>
              <ListItemButton onClick={() => navigate(item.link)}>
                <ListItemIcon sx={{ mr: -2 }}>
                  <item.icon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t(item.title)} />
              </ListItemButton>
            </ListItem>
          ))}
          <Badge
            color="primary"
            badgeContent={bookmarks?.length}
            max={99}
            onClick={() => navigate('/bookmarks')}
            sx={{
              position: 'absolute',
              top: '128px',
              left: '245px',
              cursor: 'pointer',
              display: { md: 'none', lg: 'inline' },
            }}
          />
        </List>
      </nav>
    </BorderBox>
  )
}
