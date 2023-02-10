import { FC } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import { Link } from 'react-router-dom'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { IUser } from '../../../types'
import { DocumentData } from '@firebase/firestore'

type Props = {
  user: DocumentData | undefined
}

const FriendList: FC<Props> = ({ user }) => {
  return (
    <BorderBox sx={{ mt: 2, p: 2 }}>
      {user && user?.friends?.length > 0 ? (
        <>
          <Typography variant="body2" color="textSecondary">
            Friends {user?.friends?.length}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {user.friends.map((user: IUser) => (
              <Box key={user.uid} sx={{ width: '55px', mb: 0 }}>
                <Link to={`/profile/${user.uid}`}>
                  <ThemeAvatar
                    alt={user.displayName}
                    src={user.photoURL}
                    sx={{
                      width: '55px',
                      height: '55px',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="h5">{user.emoji}</Typography>
                  </ThemeAvatar>
                  <Typography
                    variant="body2"
                    textAlign="center"
                    fontSize="13px"
                  >
                    {user.displayName.replace(/ .*/, '').length < 8
                      ? user.displayName.replace(/ .*/, '')
                      : user.displayName.replace(/ .*/, '').slice(0, 7) + '…'}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Stack>
        </>
      ) : (
        <Typography
          variant="h4"
          textAlign="center"
          color="textSecondary"
          sx={{ my: 4 }}
        >
          <b>No friends yet 😞</b>
        </Typography>
      )}
    </BorderBox>
  )
}

export default FriendList
