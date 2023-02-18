import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { Dispatch, SetStateAction } from 'react'

export type TypeSetState<T> = Dispatch<SetStateAction<T>>

export type Theme = {
  light: boolean
  setLight: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IUser {
  bookmarks: IPost[]
  createdAt: string
  displayName: string
  email: string
  emoji: string
  friends: IUser[]
  groups: any[]
  images: string[]
  music: any[]
  password: string
  photoURL: string
  uid: string
  online?: boolean
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
