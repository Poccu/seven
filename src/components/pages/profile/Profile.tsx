import { FC } from 'react'
import { Box, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import BorderBox from '../../ui/BorderBox'
import { ThemeAvatar } from '../../ui/ThemeAvatar'

const Profile: FC = () => {
  const { cur } = useAuth()
  console.log(cur)

  return (
    <BorderBox>
      <Box sx={{ p: 3 }}>
        <Typography variant="h2">
          <b>{cur?.displayName?.replace(/[\p{Emoji}\u200d]+/gu, '')}</b>
        </Typography>
        <ThemeAvatar
          alt={cur?.displayName}
          src={cur?.photoURL}
          sx={{ height: '200px', width: '200px' }}
        >
          <Typography variant="h1">
            {cur?.displayName?.match(/[\p{Emoji}\u200d]+/gu)}
          </Typography>
        </ThemeAvatar>
      </Box>
    </BorderBox>
  )
}

export default Profile
