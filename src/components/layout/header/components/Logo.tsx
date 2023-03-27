import { FC } from 'react'
import { Link } from 'react-router-dom'

import { Stack, Box, Typography } from '@mui/material'

import logo from '@assets/images/logo7.png'

export const Logo: FC = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      component={Link}
      to={'/'}
      sx={{ width: '155px' }}
    >
      <Box display="flex" alignItems="center" sx={{ height: '65px' }}>
        <img
          src={logo}
          alt="Seven"
          height="50px"
          width="50px"
          draggable={false}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: '400',
          letterSpacing: 3,
          display: { xs: 'none', sm: 'block' },
        }}
        color="primary"
      >
        SEVEN
      </Typography>
    </Stack>
  )
}
