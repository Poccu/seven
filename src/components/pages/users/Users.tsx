import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doc, runTransaction } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import { IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { PersonAddAlt1, PersonRemoveAlt1, TaskAlt } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { showUserNameUsers } from '@utils/showUserNameUsers'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeAvatar } from '@ui/ThemeAvatar'

import { IUser } from 'src/types/types'

export const Users: FC = () => {
  const { t } = useTranslation(['users'])
  const { db } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  document.title = t('Users')

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

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>{t('Users')}</b>
        </Typography>
      </BorderBox>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
          {users.length > 0 ? (
            <>
              {users.map((user) => (
                <Stack direction="column" spacing={0} key={user.uid}>
                  <Link to={`/profile/${user.uid}`}>
                    <ThemeAvatar
                      alt={user.displayName}
                      src={users.find((u) => u.uid === user.uid)?.photoURL}
                      sx={{
                        height: '255px',
                        width: '255px',
                      }}
                      draggable="false"
                      variant="rounded"
                    >
                      <Typography variant="h1">{user.emoji}</Typography>
                    </ThemeAvatar>
                  </Link>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack alignItems="center" direction="row" spacing={0.5}>
                      <Typography
                        variant="body1"
                        sx={{ ml: 1, wordBreak: 'break-word' }}
                        component={Link}
                        to={`/profile/${user.uid}`}
                      >
                        {showUserNameUsers(
                          users.find((u) => u.uid === user.uid)?.displayName
                        )}
                      </Typography>
                      {user.uid === 'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
                        <Tooltip
                          title={t('Admin', { ns: ['other'] })}
                          placement="top"
                        >
                          <TaskAlt
                            color="info"
                            sx={{ width: '20px ', height: '20px' }}
                          />
                        </Tooltip>
                      )}
                    </Stack>
                    {!friends?.some((u) => u.uid === user.uid) ? (
                      <IconButton
                        title={t('Add Friend') || ''}
                        size="large"
                        onClick={() => handleAddFriend(user.uid)}
                      >
                        <PersonAddAlt1 color="primary" />
                      </IconButton>
                    ) : (
                      <IconButton
                        title={t('Remove Friend') || ''}
                        size="large"
                        onClick={() => handleRemoveFriend(user.uid)}
                      >
                        <PersonRemoveAlt1 color="primary" />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              ))}
            </>
          ) : (
            <>
              {[...Array(3).keys()].map((user) => (
                <Stack direction="column" key={user}>
                  <Skeleton
                    sx={{ height: '255px', width: '255px' }}
                    draggable="false"
                    variant="rounded"
                  />
                  <Typography sx={{ mt: 1 }}>
                    <Skeleton />
                  </Typography>
                </Stack>
              ))}
            </>
          )}
        </Stack>
      </BorderBox>
    </>
  )
}
