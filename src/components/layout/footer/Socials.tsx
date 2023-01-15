import React from 'react'
import { IconButton, Box, Stack } from '@mui/material'
import TelegramIcon from '@mui/icons-material/Telegram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'

export default function Socials() {
  return (
    <Box>
      <Stack justifyContent="center" direction="row" spacing={1}>
        <IconButton
          aria-label="telegram"
          target="_blank"
          href="https://t.me/mordoboy"
          rel="noreferrer"
          color="inherit"
        >
          <TelegramIcon />
        </IconButton>
        <IconButton
          aria-label="linkedin"
          target="_blank"
          href="https://www.linkedin.com/in/poccu/"
          rel="noreferrer"
          color="inherit"
        >
          <LinkedInIcon />
        </IconButton>
        <IconButton
          aria-label="github"
          target="_blank"
          href="https://github.com/Poccu"
          rel="noreferrer"
          color="inherit"
        >
          <GitHubIcon />
        </IconButton>
      </Stack>
    </Box>
  )
}
