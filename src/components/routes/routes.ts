import { About } from '@pages/about/About'
import { Auth } from '@pages/auth/Auth'
import { Bookmarks } from '@pages/bookmarks/Bookmarks'
import { Friends } from '@pages/friends/Friends'
import { News } from '@pages/news/News'
import { Profile } from '@pages/profile/Profile'

export const routes = [
  {
    path: '/',
    exact: true,
    component: News,
    auth: true,
  },
  {
    path: '/profile/:id',
    exact: false,
    component: Profile,
    auth: true,
  },
  {
    path: '/friends',
    exact: true,
    component: Friends,
    auth: true,
  },
  {
    path: '/bookmarks',
    exact: true,
    component: Bookmarks,
    auth: true,
  },
  {
    path: '/auth',
    exact: false,
    component: Auth,
    auth: false,
  },
  {
    path: '/about',
    exact: true,
    component: About,
    auth: true,
  },
]
