import { FC } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/useAuth'
import { ThemeAvatar } from '../../ui/ThemeAvatar'

const FriendList: FC = () => {
  const { user } = useAuth()

  return (
    <BorderBox sx={{ mt: 2, p: 2 }}>
      {user && user.friends.length > 0 ? (
        <>
          <Typography variant="body2" color="textSecondary">
            Friends {user.friends.length}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {user.friends.map((user) => (
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
                    {user.displayName.replace(/ .*/, '')}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Stack>
        </>
      ) : (
        <Typography sx={{ my: 5 }} textAlign="center">
          No friends yet 😞
        </Typography>
      )}
    </BorderBox>
  )
}

export default FriendList
