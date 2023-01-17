import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { Dispatch, SetStateAction } from 'react'

export type TypeSetState<T> = Dispatch<SetStateAction<T>>

export interface IUser {
  _id: string
  avatar: string
  name: string
  isInNetwork?: boolean
}

export interface IUserData {
  email: string
  password: string
  name: string
  avatar: string
}

export interface IPost {
  author: IUser
  avatar?: string
  createdAt: string
  content: string
  images?: string[]
}

export interface IMenuItem {
  title: string
  link: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
}
