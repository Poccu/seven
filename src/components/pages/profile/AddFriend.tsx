import { PersonAddAlt1, PersonRemoveAlt1 } from '@mui/icons-material'
import { doc, runTransaction } from 'firebase/firestore'
import { FC } from 'react'
import { IUser } from '../../../types'
import { useAuth } from '../../providers/useAuth'
import { ThemeButton } from '../../ui/ThemeButton'
import { useTranslation } from 'react-i18next'

export const AddFriend: FC = () => {
  const { t } = useTranslation(['profile'])
  const { db, cur, user } = useAuth()
  const profileId = window.location.pathname.replace('/profile/', '')

  const handleAddFriend = async () => {
    const docRef = doc(db, 'users', profileId)
    const curRef = doc(db, 'users', cur.uid)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)
        const sfCurDoc = await transaction.get(curRef)

        if (!sfDoc.exists()) {
          throw 'Document does not exist!'
        }
        if (!sfDoc.data().friends.includes(cur.uid) && user) {
          const newFriendsArr = [
            ...sfDoc.data().friends,
            {
              displayName: cur.displayName,
              photoURL: cur.photoURL,
              uid: cur.uid,
              emoji: user.emoji,
            },
          ]
          transaction.update(docRef, {
            friends: newFriendsArr,
          })
        }

        if (!sfCurDoc.exists()) {
          throw 'Document does not exist!'
        }
        if (!sfCurDoc.data().friends.includes(profileId)) {
          const newFriendsArrCur = [
            ...sfCurDoc.data().friends,
            {
              displayName: sfDoc.data().displayName,
              photoURL: sfDoc.data().photoURL,
              uid: sfDoc.data().uid,
              emoji: sfDoc.data().emoji,
            },
          ]
          transaction.update(curRef, {
            friends: newFriendsArrCur,
          })
        }
      })
    } catch (e) {
      console.log('Add friend failed: ', e)
    }
  }

  const handleRemoveFriend = async () => {
    const docRef = doc(db, 'users', profileId)
    const curRef = doc(db, 'users', cur.uid)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)
        const sfCurDoc = await transaction.get(curRef)

        if (!sfDoc.exists()) {
          throw 'Document does not exist!'
        }
        const newFriendsArr = sfDoc
          .data()
          .friends.filter((x: IUser) => x.uid !== cur.uid)
        transaction.update(docRef, {
          friends: newFriendsArr,
        })

        if (!sfCurDoc.exists()) {
          throw 'Document does not exist!'
        }
        const newFriendsArrCur = sfCurDoc
          .data()
          .friends.filter((x: IUser) => x.uid !== sfDoc.data().uid)
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
      {!user?.friends.some((x) => x.uid === profileId) ? (
        <ThemeButton
          onClick={handleAddFriend}
          startIcon={<PersonAddAlt1 style={{ fontSize: '18px' }} />}
          sx={{ height: 28, fontSize: 15 }}
        >
          <b>{t('button1')}</b>
        </ThemeButton>
      ) : (
        <ThemeButton
          onClick={handleRemoveFriend}
          startIcon={<PersonRemoveAlt1 style={{ fontSize: '18px' }} />}
          sx={{ height: 28, fontSize: 15 }}
        >
          <b>{t('button2')}</b>
        </ThemeButton>
      )}
    </>
  )
}
