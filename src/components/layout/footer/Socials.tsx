import { FC } from 'react'
import { IconButton, Stack } from '@mui/material'
import { socials } from './socialsList'

export const Socials: FC = () => {
  return (
    <Stack justifyContent="center" direction="row" spacing={1}>
      {socials.map((social) => (
        <IconButton
          href={social.link}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          key={social.link}
        >
          <social.icon />
        </IconButton>
      ))}
    </Stack>
  )
}
