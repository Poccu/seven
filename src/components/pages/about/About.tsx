import { FC } from 'react'
import { Box, Link, Typography } from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import { builtWithList } from './builtWithList'

const About: FC = () => {
  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="center">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/logo7.png`}
          alt="Seven"
          height="150px"
          width="150px"
          draggable={false}
        />
      </Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: '400', letterSpacing: 3, mb: 4 }}
        color="primary"
        textAlign="center"
      >
        SEVEN
      </Typography>
      <Typography>
        Seven is a social network where you can register and exchange messages
        and information, as well as like, bookmark posts and delete them.
      </Typography>
      <Typography sx={{ mt: 3 }}>Built with:</Typography>
      <ul>
        {builtWithList.map((x, index) => (
          <Link
            href={x.url}
            target="_blank"
            rel="noopener"
            underline="none"
            key={index}
          >
            <li>{x.title}</li>
          </Link>
        ))}
      </ul>
    </BorderBox>
  )
}

export default About
