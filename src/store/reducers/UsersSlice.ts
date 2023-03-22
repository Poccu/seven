import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IUser } from 'src/types/types'

const initialState = {
  users: [] as IUser[],
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload
    },

    removeUsers(state) {
      state.users = []
    },
  },
})

export const { setUsers, removeUsers } = usersSlice.actions

export const usersReducer = usersSlice.reducer
