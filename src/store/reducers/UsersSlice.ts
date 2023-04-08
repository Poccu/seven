import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IUser, IUsersState } from 'src/types/types'

const initialState = {
  sortUsersBy: 'popularity',
  users: [],
} as IUsersState

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<IUser[]>) {
      if (state.sortUsersBy === 'newest') {
        state.users = action.payload.sort((a, b) => +b.createdAt - +a.createdAt)
      }

      if (state.sortUsersBy === 'oldest') {
        state.users = action.payload.sort((a, b) => +a.createdAt - +b.createdAt)
      }

      if (state.sortUsersBy === 'popularity') {
        state.users = action.payload.sort(
          (a, b) => b.friends.length - a.friends.length
        )
      }
    },

    removeUsers(state) {
      state.users = []
    },

    setUsersByNewest(state) {
      state.sortUsersBy = 'newest'
      state.users = state.users.sort((a, b) => +b.createdAt - +a.createdAt)
    },

    setUsersByOldest(state) {
      state.sortUsersBy = 'oldest'
      state.users = state.users.sort((a, b) => +a.createdAt - +b.createdAt)
    },

    setUsersByPopularity(state) {
      state.sortUsersBy = 'popularity'
      state.users = state.users.sort(
        (a, b) => b.friends.length - a.friends.length
      )
    },
  },
})

export const {
  setUsers,
  removeUsers,
  setUsersByNewest,
  setUsersByOldest,
  setUsersByPopularity,
} = usersSlice.actions

export const usersReducer = usersSlice.reducer
