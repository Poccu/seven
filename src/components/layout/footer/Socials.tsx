import { FC } from 'react'
import { IconButton, Stack } from '@mui/material'
import { socials } from './socialsList'

export const Socials: FC = () => {
  return (
    <Stack justifyContent="center" direction="row" spacing={1}>
      {socials.map((x) => (
        <IconButton
          href={x.link}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          key={x.link}
        >
          <x.icon />
        </IconButton>
      ))}
    </Stack>
  )
}
