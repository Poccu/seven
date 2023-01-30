import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { Dispatch, SetStateAction } from 'react'

export type TypeSetState<T> = Dispatch<SetStateAction<T>>

export type Theme = {
  light: boolean
  setLight: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IUser {
  bookmarks: any[]
  createdAt: string
  displayName: string
  email: string
  emoji: string
  friends: IUser[]
  groups: any[]
  music: any[]
  password: string
  photoURL: string
  photos: string[]
  uid: string
  isInNetwork?: boolean
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
  comments: string[]
  images?: string[]
  likes: IUser[]
  bookmarks: string[]
  views: number
  id: string
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
  images?: string[]
  likes: IUser[]
  id: string
}
