import { PersonAddAlt1, PersonRemoveAlt1 } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { doc, runTransaction } from 'firebase/firestore'
import { FC, useState } from 'react'
import { IUser } from '../../../types'
import { useAuth } from '../../providers/useAuth'
import { ThemeButton } from '../../ui/ThemeButton'

const AddFriend: FC = () => {
  const { db, cur, user } = useAuth()
  const profileId = window.location.pathname.replace('/profile/', '')
  // console.log(cur)

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
          // console.log(newFriendsArrCur)
          transaction.update(curRef, {
            friends: newFriendsArrCur,
          })
        }
      })
      // console.log('Add friend!')
    } catch (e) {
      console.log('Add friend failed: ', e)
    }
  }

  return (
    <>
      {/* <ThemeButton
        onClick={handleAddFriend}
        startIcon={<PersonRemoveAlt1 style={{ fontSize: '30px' }} />}
      >
        <b>Add Friend</b>
      </ThemeButton> */}
      {!user?.friends.some((x) => x.uid === profileId) ? (
        <IconButton onClick={handleAddFriend} color="primary">
          <PersonAddAlt1 />
        </IconButton>
      ) : (
        <IconButton color="error">
          <PersonRemoveAlt1 />
        </IconButton>
      )}
    </>
  )
}

export default AddFriend
