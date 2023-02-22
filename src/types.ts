import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

export type Theme = {
  light: boolean
  setLight: React.Dispatch<React.SetStateAction<boolean>>
}

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
  online?: boolean
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
  online?: boolean | null
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
  title: string
  link: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
}

export interface IMessage {
  author: IUser
  createdAt: string
  content: string
  comments: string[]
  images: string[]
  likes: IUser[]
  id: string
}
