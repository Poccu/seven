import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doc, runTransaction } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import { Stack, Typography, Tooltip, IconButton, Box } from '@mui/material'
import { TaskAlt, PersonRemoveAlt1 } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { showUserNameUsers } from '@utils/showUserNameUsers'
import { ThemeOnlineBadge } from '@ui/ThemeOnlineBadge'
import { ThemeAvatar } from '@ui/ThemeAvatar'

import { IUser } from 'src/types/types'

type Props = {
  user: IUser
}

export const UserItemFriendList: FC<Props> = ({ user }) => {
  const { t } = useTranslation(['users'])
  const { db, usersRdb } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const { uid, friends } = useAppSelector((state) => state.user)
  const { users } = useAppSelector((state) => state.users)

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
  const userFriendsArr = users
    ?.find((u) => u.uid === user.uid)
    ?.friends?.map((u) => u.uid)

  const showMutualFriends = (user: IUser) => {
    if (!myFriendsArr || !userFriendsArr) return
    const countMutualFriends = myFriendsArr.filter((u) =>
      userFriendsArr.includes(u)
    ).length

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

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box>
        <IconButton
          title={t('Remove Friend') || ''}
          size="large"
          onClick={() => handleRemoveFriend(user.uid)}
          sx={{ width: '50px ', height: '50px' }}
        >
          <PersonRemoveAlt1 color="secondary" />
        </IconButton>
      </Box>
      <Link to={`/profile/${user.uid}`}>
        <ThemeOnlineBadge
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          variant={usersRdb[user.uid]?.isOnline ? 'dot' : undefined}
        >
          <ThemeAvatar
            alt={user.displayName}
            src={users.find((u) => u.uid === user.uid)?.photoURL}
            sx={{ height: '55px', width: '55px' }}
            draggable={false}
          >
            <Typography variant="h5">{user.emoji}</Typography>
          </ThemeAvatar>
        </ThemeOnlineBadge>
      </Link>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <Typography
              variant="h6"
              component={Link}
              to={`/profile/${user.uid}`}
            >
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
      </Stack>
    </Stack>
  )
}
