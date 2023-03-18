import { FC, useEffect, useState } from 'react'
import { Collapse } from '@mui/material'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  increment,
  getDocs,
  DocumentData,
} from 'firebase/firestore'
import { TransitionGroup } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { postsSlice } from '../../../store/reducers/PostsSlice'
import { NewsOrderBy } from './NewsOrderBy'
import { SkeletonPost } from '../../ui/skeletons/SkeletonPost'
import { NewsPost } from './NewsPost'
import { AddPost } from './AddPost'
import { useAuth } from '../../providers/useAuth'
import { IPost } from '../../../types'

export const News: FC = () => {
  const { t } = useTranslation(['news'])
  document.title = t('News')

  const { db } = useAuth()

  const [editingId, setEditingId] = useState('')
  const [deletedPosts, setDeletedPosts] = useState<IPost[]>([])

  const { posts } = useAppSelector((state) => state.posts)
  const { users } = useAppSelector((state) => state.users)
  const { setPosts } = postsSlice.actions
  const dispatch = useAppDispatch()

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))

    const incViews = async () => {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(async (d) => {
        const docRef = doc(db, 'posts', d.id)
        await setDoc(docRef, { views: increment(1) }, { merge: true })
      })
    }

    const setPostsFunc = onSnapshot(q, (querySnapshot) => {
      const postsArr: IPost[] = []
      querySnapshot.forEach(async (d: DocumentData) => {
        postsArr.push(d.data())
      })

      dispatch(setPosts(postsArr))
    })

    return () => {
      incViews()
      setPostsFunc()
    }
    // eslint-disable-next-line
  }, [db])

  return (
    <>
      <AddPost />
      <NewsOrderBy />
      {users.length > 0 ? (
        <TransitionGroup>
          {posts.map((post) => (
            <Collapse key={post.id}>
              <NewsPost
                post={post}
                deletedPosts={deletedPosts}
                setDeletedPosts={setDeletedPosts}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      ) : (
        [...Array(3).keys()].map((post) => <SkeletonPost key={post} />)
      )}
    </>
  )
}
