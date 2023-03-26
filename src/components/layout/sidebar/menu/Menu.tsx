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
  Box,
} from '@mui/material'
import { BookmarkBorder, InfoOutlined } from '@mui/icons-material'

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
                <ListItemText primary={t(`title${index}`)} />
              </ListItemButton>
            </ListItem>
          ))}
          <Box
            sx={{ height: '48px', cursor: 'pointer' }}
            onClick={() => navigate('/bookmarks')}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ mr: -2 }}>
                  <BookmarkBorder color="primary" />
                </ListItemIcon>
                <ListItemText primary={t('Bookmarks')} />
              </ListItemButton>
            </ListItem>
            <Badge
              color="primary"
              badgeContent={bookmarks?.length}
              max={99}
              sx={{
                position: 'relative',
                top: '-25px',
                left: '245px',
                display: { md: 'none', lg: 'inline' },
              }}
            />
          </Box>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/about')}>
              <ListItemIcon sx={{ mr: -2 }}>
                <InfoOutlined color="primary" />
              </ListItemIcon>
              <ListItemText primary={t('About')} />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </BorderBox>
  )
}
