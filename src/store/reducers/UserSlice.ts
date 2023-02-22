import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, IUserState } from '../../types'

const initialState = {
  bookmarks: null,
  createdAt: null,
  displayName: null,
  emoji: null,
  friends: null,
  groups: null,
  music: null,
  photoURL: null,
  images: null,
  uid: null,
} as IUserState

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.bookmarks = action.payload.bookmarks
      state.createdAt = action.payload.createdAt
      state.displayName = action.payload.displayName
      state.emoji = action.payload.emoji
      state.friends = action.payload.friends
      state.groups = action.payload.groups
      state.music = action.payload.music
      state.photoURL = action.payload.photoURL
      state.images = action.payload.images
      state.uid = action.payload.uid
    },
    removeUser(state) {
      state.bookmarks = null
      state.createdAt = null
      state.displayName = null
      state.email = null
      state.friends = null
      state.groups = null
      state.music = null
      state.photoURL = null
      state.images = null
      state.uid = null
    },
  },
})

export default userSlice.reducer
