import * as Icons from '@mui/icons-material'
import { IMenuItem } from '../../../../types'

export const menu: IMenuItem[] = [
  {
    title: 'News',
    link: '/',
    icon: Icons.Article,
  },
  {
    title: 'Messenger',
    link: '/messenger',
    icon: Icons.Forum,
  },
  {
    title: 'Friends',
    link: '/friends',
    icon: Icons.Group,
  },
  {
    title: 'Communities',
    link: '/groups',
    icon: Icons.Groups,
  },
  {
    title: 'Photos',
    link: '/photos',
    icon: Icons.Photo,
  },
  {
    title: 'Music',
    link: '/music',
    icon: Icons.MusicNote,
  },
]
