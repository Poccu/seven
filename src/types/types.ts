import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

export interface IUser {
  bookmarks: IPost[]
  createdAt: string
  displayName: string
  email?: string
  emoji: string
  friends: IUser[]
  groups: any[]
  images: string[]
  music: any[]
  password?: string
  photoURL: string
  uid: string
  isAuth?: boolean
}

export interface IUserState {
  bookmarks: IPost[] | null
  createdAt: string | null
  displayName: string | null
  email?: string | null
  emoji: string | null
  friends: IUser[] | null
  groups: any[] | null
  images: string[] | null
  music: any[] | null
  password?: string | null
  photoURL: string | null
  uid: string | null
  isAuth?: boolean
}

export interface IGlobalState {
  language: 'en' | 'ru'
  theme: 'light' | 'dark'
  format: 'block' | 'list'
}

export interface IPostsState {
  sortPostsBy: 'newest' | 'oldest' | 'likes' | 'controversial'
  posts: IPost[]
}

export interface IBookmarksState {
  sortBookmarksBy: 'newest' | 'oldest' | 'likes' | 'controversial'
  withPhoto: boolean
  bookmarks: IPost[]
}

export interface IUsersState {
  sortUsersBy: 'newest' | 'oldest' | 'popularity'
  users: IUser[]
}

export interface IUserData {
  displayName: string
  email: string
  password: string
  photoURL: string
}

export interface IPost {
  author: IUser
  createdAt: string
  content: string
  comments: IComment[]
  likes: IUser[]
  bookmarks: string[]
  images: string[]
  views: number
  id: string
}

export interface IComment {
  author: IUser
  content: string
  createdAt: string
  id: string
  likes: IUser[]
  images: string[]
}

export interface IMenuItem {
  link: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
  title: string
}

export interface ISocialsItem {
  link: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
}

export interface IAuthData {
  invalidEmail: boolean
  invalidPassword: boolean
  alreadyInUseEmail: boolean
  wrongPassword: boolean
  userNotFound: boolean
  showPassword: boolean
  isRegForm: boolean
}
