import { FC } from 'react'
import { Box } from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'

const About: FC = () => {
  return (
    <BorderBox>
      <Box sx={{ p: 3 }}>About</Box>
    </BorderBox>
  )
}

export default About
