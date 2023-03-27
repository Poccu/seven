import * as Icons from '@mui/icons-material'

import { IMenuItem } from 'src/types/types'

export const menu: IMenuItem[] = [
  {
    link: '/',
    icon: Icons.Article,
    title: 'News',
  },
  {
    link: '/friends',
    icon: Icons.Group,
    title: 'Friends',
  },
  {
    link: '/bookmarks',
    icon: Icons.BookmarkBorder,
    title: 'Bookmarks',
  },
  {
    link: '/about',
    icon: Icons.InfoOutlined,
    title: 'About',
  },
]
