import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IPost } from 'src/types/types'

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
      }

      if (state.sortBookmarksBy === 'oldest') {
        state.bookmarks = action.payload.sort(
          (a, b) => +a.createdAt - +b.createdAt
        )
      }

      if (state.sortBookmarksBy === 'likes') {
        state.bookmarks = action.payload.sort(
          (a, b) => b.likes.length - a.likes.length
        )
      }

      if (state.sortBookmarksBy === 'controversial') {
        state.bookmarks = action.payload.sort(
          (a, b) => b.comments.length - a.comments.length
        )
      }
    },

    removeBookmarks(state) {
      state.bookmarks = []
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

    setBookmarksByLikes(state) {
      state.sortBookmarksBy = 'likes'
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
  },
})

export const {
  setBookmarks,
  removeBookmarks,
  setBookmarksByNewest,
  setBookmarksByOldest,
  setBookmarksByLikes,
  setBookmarksByControversial,
} = bookmarksSlice.actions

export const bookmarksReducer = bookmarksSlice.reducer
