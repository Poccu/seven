import { FC } from 'react'

import { Skeleton, Stack, Typography } from '@mui/material'

export const SkeletonUser: FC = () => {
  return (
    <Stack>
      <Skeleton sx={{ height: '258px', width: '258px' }} variant="rounded" />
      <Typography sx={{ mt: 0.5 }}>
        <Skeleton />
      </Typography>
      <Typography variant="body2">
        <Skeleton />
      </Typography>
    </Stack>
  )
}
