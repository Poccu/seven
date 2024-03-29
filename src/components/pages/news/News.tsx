import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TransitionGroup } from 'react-transition-group'
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

import { Checkbox, Collapse, FormControlLabel, Stack } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { useHandleScroll } from '@hooks/useHandleScroll'
import { setPosts } from '@reducers/PostsSlice'
import { SkeletonPost } from '@ui/skeletons/SkeletonPost'

import { IPost } from 'src/types/types'
import { NewsOrderBy } from './components//NewsOrderBy'
import { NewsPost } from './components//NewsPost'
import { AddPost } from './components/AddPost'

export const News: FC = () => {
  const { t } = useTranslation(['news'])
  const { db } = useAuth()
  document.title = t('News')

  const { posts } = useAppSelector((state) => state.posts)
  const { users } = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()

  const { numberVisiblePosts, setNumberVisiblePosts } = useHandleScroll(4, 1)

  const [editingId, setEditingId] = useState('')
  const [deletedPosts, setDeletedPosts] = useState<IPost[]>([])
  const [withPhoto, setWithPhoto] = useState(false)

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWithPhoto(event.target.checked)
  }

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

      if (withPhoto) {
        dispatch(setPosts(postsArr.filter((post) => post?.images?.length > 0)))
      } else {
        dispatch(setPosts(postsArr))
      }
    })

    return () => {
      incViews()
      setPostsFunc()
    }
    // eslint-disable-next-line
  }, [db, withPhoto])

  return (
    <>
      <AddPost />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ ml: 2, mb: 2 }}
      >
        <NewsOrderBy setNumberVisiblePosts={setNumberVisiblePosts} />
        <FormControlLabel
          control={<Checkbox checked={withPhoto} onChange={handleCheckbox} />}
          label={t('Only with photo')}
        />
      </Stack>
      {users.length > 0 ? (
        <>
          <TransitionGroup>
            {posts.slice(0, numberVisiblePosts).map((post) => (
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
          {numberVisiblePosts < posts.length && <SkeletonPost />}
        </>
      ) : (
        [...Array(3).keys()].map((post) => <SkeletonPost key={post} />)
      )}
    </>
  )
}
