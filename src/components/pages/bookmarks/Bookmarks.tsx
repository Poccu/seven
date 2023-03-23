import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TransitionGroup } from 'react-transition-group'
import {
  collection,
  query,
  doc,
  onSnapshot,
  DocumentData,
  runTransaction,
  where,
} from 'firebase/firestore'

import { Collapse, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { setBookmarks } from '@reducers/BookmarksSlice'
import { BorderBox } from '@ui/ThemeBox'
import { SkeletonPost } from '@ui/skeletons/SkeletonPost'

import { IPost } from 'src/types/types'
import { BookmarksPost } from './components/BookmarksPost'
import { BookmarksOrderBy } from './components/BookmarksOrderBy'

export const Bookmarks: FC = () => {
  const { t } = useTranslation(['bookmarks'])
  document.title = t('Bookmarks')

  const { db } = useAuth()

  const { uid } = useAppSelector((state) => state.user)
  const { users } = useAppSelector((state) => state.users)
  const { bookmarks } = useAppSelector((state) => state.bookmarks)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('bookmarks', 'array-contains', uid)
    )

    const setPostsFunc = onSnapshot(q, (querySnapshot) => {
      const postsArr: IPost[] = []
      querySnapshot.forEach(async (d: DocumentData) => {
        postsArr.push(d.data())
      })

      dispatch(setBookmarks(postsArr))
    })

    return () => {
      setPostsFunc()
    }
    // eslint-disable-next-line
  }, [db, uid])

  useEffect(() => {
    if (!uid) return
    const curUserRef = doc(db, 'users', uid)

    try {
      runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(curUserRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        transaction.update(curUserRef, {
          bookmarks: [],
        })
      })
    } catch (e) {
      console.log('Delete Bookmark failed: ', e)
    }
  }, [db, uid])

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>{t('Bookmarks')}</b>
        </Typography>
      </BorderBox>
      <BookmarksOrderBy />
      {users.length > 0 ? (
        <TransitionGroup>
          {bookmarks.map((post) => (
            <Collapse key={post.id}>
              <BookmarksPost post={post} />
            </Collapse>
          ))}
        </TransitionGroup>
      ) : (
        [...Array(3).keys()].map((post) => <SkeletonPost key={post} />)
      )}
      {users.length > 0 && bookmarks.length === 0 && (
        <BorderBox sx={{ p: 3, mb: 2 }}>
          <Typography
            variant="h4"
            textAlign="center"
            color="textSecondary"
            sx={{ my: 4 }}
          >
            <b>{t('No bookmarks yet 😞')}</b>
          </Typography>
        </BorderBox>
      )}
    </>
  )
}
