import { FC } from 'react'

import { Box, Skeleton, Typography } from '@mui/material'

export const SkeletonUserFriend: FC = () => {
  return (
    <Box sx={{ width: '55px' }}>
      <Skeleton
        variant="circular"
        sx={{ width: '55px', height: '55px', mb: 0.5 }}
      />
      <Typography variant="body2" textAlign="center" fontSize="13px">
        <Skeleton />
      </Typography>
    </Box>
  )
}
