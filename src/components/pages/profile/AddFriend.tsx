import { PersonAddAlt1, PersonRemoveAlt1 } from '@mui/icons-material'
import { doc, runTransaction } from 'firebase/firestore'
import { FC } from 'react'
import { IUser } from '../../../types'
import { useAuth } from '../../providers/useAuth'
import { ThemeButton } from '../../ui/ThemeButton'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../../hooks/redux'

export const AddFriend: FC = () => {
  const { t } = useTranslation(['profile'])

  const { db } = useAuth()

  const profileId = window.location.pathname.replace('/profile/', '')

  const { emoji, uid, displayName, photoURL, friends } = useAppSelector(
    (state) => state.user
  )

  const handleAddFriend = async () => {
    if (!uid) return
    const docRef = doc(db, 'users', profileId)
    const curRef = doc(db, 'users', uid)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)
        const sfCurDoc = await transaction.get(curRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newFriendsArr = [
          ...new Map(
            [
              ...sfDoc.data().friends,
              { displayName, photoURL, uid, emoji },
            ].map((user) => [user['uid'], user])
          ).values(),
        ]

        transaction.update(docRef, {
          friends: newFriendsArr,
        })

        if (!sfCurDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newFriendsArrCur = [
          ...new Map(
            [
              ...sfCurDoc.data().friends,
              {
                displayName: sfDoc.data().displayName,
                photoURL: sfDoc.data().photoURL,
                uid: sfDoc.data().uid,
                emoji: sfDoc.data().emoji,
              },
            ].map((user) => [user['uid'], user])
          ).values(),
        ]

        transaction.update(curRef, {
          friends: newFriendsArrCur,
        })
      })
    } catch (e) {
      console.log('Add friend failed: ', e)
    }
  }

  const handleRemoveFriend = async () => {
    if (!uid) return
    const docRef = doc(db, 'users', profileId)
    const curRef = doc(db, 'users', uid)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)
        const sfCurDoc = await transaction.get(curRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newFriendsArr = sfDoc
          .data()
          .friends.filter((user: IUser) => user.uid !== uid)

        transaction.update(docRef, {
          friends: newFriendsArr,
        })

        if (!sfCurDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newFriendsArrCur = sfCurDoc
          .data()
          .friends.filter((user: IUser) => user.uid !== sfDoc.data().uid)

        transaction.update(curRef, {
          friends: newFriendsArrCur,
        })
      })
    } catch (e) {
      console.log('Remove friend failed: ', e)
    }
  }

  return (
    <>
      {!friends?.some((user) => user.uid === profileId) ? (
        <ThemeButton
          onClick={handleAddFriend}
          startIcon={<PersonAddAlt1 style={{ fontSize: '18px' }} />}
          sx={{ height: 28, fontSize: 15 }}
        >
          <b>{t('Add friend')}</b>
        </ThemeButton>
      ) : (
        <ThemeButton
          onClick={handleRemoveFriend}
          startIcon={<PersonRemoveAlt1 style={{ fontSize: '18px' }} />}
          sx={{ height: 28, fontSize: 15 }}
        >
          <b>{t('Delete friend')}</b>
        </ThemeButton>
      )}
    </>
  )
}
