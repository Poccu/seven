import { FC } from 'react'

import { Skeleton, Stack, Typography } from '@mui/material'

import { BorderBox } from '@ui/ThemeBox'

export const SkeletonPost: FC = () => {
  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack alignItems="center" direction="row" spacing={2} sx={{ mb: 2 }}>
          <Skeleton variant="circular" sx={{ width: '46px', height: '46px' }} />
          <Stack>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                <Skeleton width={180} />
              </Typography>
            </Stack>
            <Typography variant="body2" color="textSecondary">
              <Skeleton width={120} />
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Typography sx={{ ml: 1, wordBreak: 'break-word' }}>
        <Skeleton />
      </Typography>
      <Typography sx={{ ml: 1, wordBreak: 'break-word' }}>
        <Skeleton />
      </Typography>
    </BorderBox>
  )
}
