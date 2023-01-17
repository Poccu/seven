import About from '../pages/about/About'
import Auth from '../pages/auth/Auth'
import Home from '../pages/home/Home'
import Profile from '../pages/profile/Profile'

export const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
    auth: true,
  },
  {
    path: '/profile',
    exact: true,
    component: Profile,
    auth: true,
  },
  {
    path: '/messages',
    exact: true,
    component: Home,
    auth: true,
  },
  {
    path: '/message/:id',
    exact: false,
    component: Home,
    auth: true,
  },
  {
    path: '/friends/:id',
    exact: false,
    component: Home,
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
