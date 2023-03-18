import { Box, Skeleton, Typography } from '@mui/material'
import { FC } from 'react'
import { ThemeOnlineBadge } from '../ThemeOnlineBadge'

export const SkeletonUserOnline: FC = () => {
  return (
    <Box sx={{ width: '55px' }}>
      <ThemeOnlineBadge
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant="dot"
      >
        <Skeleton
          variant="circular"
          sx={{ width: '55px', height: '55px', mb: 0.5 }}
        />
      </ThemeOnlineBadge>
      <Typography variant="body2" textAlign="center" fontSize="13px">
        <Skeleton />
      </Typography>
    </Box>
  )
}
