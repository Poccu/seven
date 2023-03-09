import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPost } from './../../types'

const initialState = {
  sortBookmarksBy: 'newest',
  bookmarks: [] as IPost[],
}

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setBookmarks(state, action: PayloadAction<IPost[]>) {
      if (state.sortBookmarksBy === 'newest') {
        state.bookmarks = action.payload.sort(
          (a, b) => +b.createdAt - +a.createdAt
        )
      } else if (state.sortBookmarksBy === 'oldest') {
        state.bookmarks = action.payload.sort(
          (a, b) => +a.createdAt - +b.createdAt
        )
      } else if (state.sortBookmarksBy === 'popularity') {
        state.bookmarks = action.payload.sort(
          (a, b) => b.likes.length - a.likes.length
        )
      } else if (state.sortBookmarksBy === 'controversial') {
        state.bookmarks = action.payload.sort(
          (a, b) => b.comments.length - a.comments.length
        )
      }
    },
    setBookmarksByNewest(state) {
      state.sortBookmarksBy = 'newest'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => +b.createdAt - +a.createdAt
      )
    },
    setBookmarksByOldest(state) {
      state.sortBookmarksBy = 'oldest'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => +a.createdAt - +b.createdAt
      )
    },
    setBookmarksByPopularity(state) {
      state.sortBookmarksBy = 'popularity'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => b.likes.length - a.likes.length
      )
    },
    setBookmarksByControversial(state) {
      state.sortBookmarksBy = 'controversial'
      state.bookmarks = state.bookmarks.sort(
        (a, b) => b.comments.length - a.comments.length
      )
    },
    removeBookmarks(state) {
      state.bookmarks = []
    },
  },
})

export default bookmarksSlice.reducer
