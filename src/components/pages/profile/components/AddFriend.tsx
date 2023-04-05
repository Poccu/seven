import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { doc, runTransaction } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import { PersonAddAlt1, PersonRemoveAlt1 } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { ThemeSmallButton } from '@ui/ThemeButton'

import { IUser } from 'src/types/types'

export const AddFriend: FC = () => {
  const { t } = useTranslation(['profile'])
  const { db } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const { emoji, uid, displayName, photoURL, friends } = useAppSelector(
    (state) => state.user
  )

  const profileId = window.location.pathname.replace('/profile/', '')

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

        enqueueSnackbar(t('User added to Friends'), {
          preventDuplicate: true,
          variant: 'success',
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

        enqueueSnackbar(t('User removed from Friends'), {
          preventDuplicate: true,
          variant: 'error',
        })
      })
    } catch (e) {
      console.log('Remove friend failed: ', e)
    }
  }

  return (
    <>
      {!friends?.some((user) => user.uid === profileId) ? (
        <ThemeSmallButton
          onClick={handleAddFriend}
          startIcon={<PersonAddAlt1 />}
        >
          <b>{t('Add friend')}</b>
        </ThemeSmallButton>
      ) : (
        <ThemeSmallButton
          onClick={handleRemoveFriend}
          startIcon={<PersonRemoveAlt1 />}
        >
          <b>{t('Delete friend')}</b>
        </ThemeSmallButton>
      )}
    </>
  )
}
