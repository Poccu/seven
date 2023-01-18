import { Avatar, Box, Typography } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import BorderBox from '../../ui/BorderBox'

type Props = {}

const Profile = ({}: Props) => {
  const { cur } = useAuth()

  return (
    <BorderBox>
      <Box sx={{ p: 3 }}>
        <Typography variant="h2">
          <b>{cur?.displayName}</b>
        </Typography>
        <Avatar
          alt={cur?.displayName}
          src={cur?.photoURL}
          sx={{ height: '200px', width: '200px' }}
        />
      </Box>
    </BorderBox>
  )
}

export default Profile
