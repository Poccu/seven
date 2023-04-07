import { FC } from 'react'

import { Skeleton, Stack, Typography } from '@mui/material'

export const SkeletonUserList: FC = () => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Skeleton sx={{ height: '48px', width: '48px' }} variant="circular" />
      <Skeleton sx={{ height: '60px', width: '60px' }} variant="rounded" />
      <Stack>
        <Typography variant="h6">
          <Skeleton sx={{ width: { xs: 118, sm: 250 } }} />
        </Typography>
        <Typography variant="body2">
          <Skeleton sx={{ width: { xs: 118, sm: 250 } }} />
        </Typography>
      </Stack>
    </Stack>
  )
}
