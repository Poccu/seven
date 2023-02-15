import { FC } from 'react'
import { IconButton, Stack } from '@mui/material'
import { Telegram, LinkedIn, GitHub } from '@mui/icons-material'

export const Socials: FC = () => {
  return (
    <Stack justifyContent="center" direction="row" spacing={1}>
      <IconButton
        aria-label="telegram"
        target="_blank"
        href="https://t.me/mordoboy"
        rel="noreferrer"
        color="primary"
      >
        <Telegram />
      </IconButton>
      <IconButton
        aria-label="linkedin"
        target="_blank"
        href="https://www.linkedin.com/in/poccu/"
        rel="noreferrer"
        color="primary"
      >
        <LinkedIn />
      </IconButton>
      <IconButton
        aria-label="github"
        target="_blank"
        href="https://github.com/Poccu"
        rel="noreferrer"
        color="primary"
      >
        <GitHub />
      </IconButton>
    </Stack>
  )
}
