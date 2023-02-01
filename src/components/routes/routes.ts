import About from '../pages/about/About'
import Auth from '../pages/auth/Auth'
import Bookmarks from '../pages/bookmarks/Bookmarks'
import Home from '../pages/home/Home'
import Messenger from '../pages/messenger/Messenger'
import Profile from '../pages/profile/Profile'

export const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
    auth: true,
  },
  {
    path: '/profile/:id',
    exact: false,
    component: Profile,
    auth: true,
  },
  {
    path: '/messages',
    exact: true,
    component: Home,
    auth: true,
  },
  // {
  //   path: '/messenger',
  //   exact: true,
  //   component: Messenger,
  //   auth: true,
  // },
  {
    path: '/friends/:id',
    exact: false,
    component: Home,
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
    auth: false,
  },
]
