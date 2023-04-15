import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doc, runTransaction } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import { Stack, Typography, Tooltip, IconButton } from '@mui/material'
import {
  TaskAlt,
  PersonAddAlt1,
  PersonRemoveAlt1,
  SelfImprovement,
} from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { showUserNameUsers } from '@utils/showUserNameUsers'
import { ThemeAvatar } from '@ui/ThemeAvatar'

import { IUser } from 'src/types/types'

type Props = {
  user: IUser
}

export const UserItem: FC<Props> = ({ user }) => {
  const { t } = useTranslation(['users'])
  const { db } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const { emoji, uid, displayName, photoURL, friends } = useAppSelector(
    (state) => state.user
  )
  const { users } = useAppSelector((state) => state.users)

  const handleAddFriend = async (profileId: string) => {
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

  const handleRemoveFriend = async (profileId: string) => {
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

  const myFriendsArr = friends?.map((u) => u.uid)

  const showMutualFriends = (user: IUser) => {
    if (!myFriendsArr) return
    const userFriendsArr = user.friends.map((u) => u.uid)
    const countMutualFriends = myFriendsArr.filter((u) =>
      userFriendsArr.includes(u)
    ).length

    if (uid === user.uid) return t(`it's you`)

    switch (countMutualFriends) {
      case 0:
        return t('no mutual friends')
      case 1:
        return `1 ${t('mutual friend')}`
      case 2:
        return `2 ${t('mutual friends')}`
      case 3:
        return `3 ${t('mutual friends')}`
      case 4:
        return `4 ${t('mutual friends')}`
      default:
        return t('many mutual friends')
    }
  }

  const handleItsYou = () => {
    enqueueSnackbar(t(`You can't add yourself, chill 😀`), { variant: 'info' })
  }

  return (
    <Stack>
      <Link to={`/profile/${user.uid}`}>
        <ThemeAvatar
          alt={user.displayName}
          src={users.find((u) => u.uid === user.uid)?.photoURL}
          sx={{ height: '258px', width: '258px', mb: 0.5 }}
          draggable={false}
          variant="rounded"
        >
          <Typography variant="h1">{user.emoji}</Typography>
        </ThemeAvatar>
      </Link>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack sx={{ ml: 1 }}>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <Typography component={Link} to={`/profile/${user.uid}`}>
              {showUserNameUsers(
                users.find((u) => u.uid === user.uid)?.displayName
              )}
            </Typography>
            {user.uid === 'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
              <Tooltip title={t('Admin', { ns: ['other'] })} placement="top">
                <TaskAlt color="info" sx={{ width: '20px ', height: '20px' }} />
              </Tooltip>
            )}
          </Stack>
          <Typography variant="body2" color="textSecondary">
            {showMutualFriends(user)}
          </Typography>
        </Stack>
        {!friends?.some((u) => u.uid === user.uid) && uid !== user.uid ? (
          <IconButton
            title={t('Add Friend') || ''}
            size="large"
            onClick={() => handleAddFriend(user.uid)}
            sx={{ width: '50px ', height: '50px' }}
          >
            <PersonAddAlt1 color="primary" />
          </IconButton>
        ) : uid !== user.uid ? (
          <IconButton
            title={t('Remove Friend') || ''}
            size="large"
            onClick={() => handleRemoveFriend(user.uid)}
            sx={{ width: '50px ', height: '50px' }}
          >
            <PersonRemoveAlt1 color="secondary" />
          </IconButton>
        ) : (
          <IconButton
            title={t('Chill') || ''}
            size="large"
            onClick={handleItsYou}
            sx={{ width: '50px ', height: '50px' }}
          >
            <SelfImprovement color="info" />
          </IconButton>
        )}
      </Stack>
    </Stack>
  )
}
