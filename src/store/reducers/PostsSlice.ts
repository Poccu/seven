import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPost } from 'src/types'

const initialState = {
  sortPostsBy: 'newest',
  posts: [] as IPost[],
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<IPost[]>) {
      if (state.sortPostsBy === 'newest') {
        state.posts = action.payload.sort((a, b) => +b.createdAt - +a.createdAt)
      } else if (state.sortPostsBy === 'oldest') {
        state.posts = action.payload.sort((a, b) => +a.createdAt - +b.createdAt)
      } else if (state.sortPostsBy === 'popularity') {
        state.posts = action.payload.sort(
          (a, b) => b.likes.length - a.likes.length
        )
      } else if (state.sortPostsBy === 'controversial') {
        state.posts = action.payload.sort(
          (a, b) => b.comments.length - a.comments.length
        )
      }
    },
    setPostsByNewest(state) {
      state.sortPostsBy = 'newest'
      state.posts = state.posts.sort((a, b) => +b.createdAt - +a.createdAt)
    },
    setPostsByOldest(state) {
      state.sortPostsBy = 'oldest'
      state.posts = state.posts.sort((a, b) => +a.createdAt - +b.createdAt)
    },
    setPostsByPopularity(state) {
      state.sortPostsBy = 'popularity'
      state.posts = state.posts.sort((a, b) => b.likes.length - a.likes.length)
    },
    setPostsByControversial(state) {
      state.sortPostsBy = 'controversial'
      state.posts = state.posts.sort(
        (a, b) => b.comments.length - a.comments.length
      )
    },
    removePosts(state) {
      state.posts = []
    },
  },
})

export default postsSlice.reducer
