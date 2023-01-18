import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { Dispatch, SetStateAction } from 'react'

export type TypeSetState<T> = Dispatch<SetStateAction<T>>

export interface IUser {
  uid: string
  photoURL: string
  displayName: string
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
  likes: string[]
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
  likes: string[]
  id: string
}
