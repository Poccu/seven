import { Box, Button, Grid, Typography } from '@mui/material'
import { FC } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { styled, alpha } from '@mui/material/styles'
import { CottageOutlined } from '@mui/icons-material'

type ButtonProps = {
  component: React.ForwardRefExoticComponent<
    LinkProps & React.RefAttributes<HTMLAnchorElement>
  >
  to: string
}

const ThemeButton = styled(Button)<ButtonProps>(({ theme }) => ({
  fontSize: 22,
  color: theme.palette.primary.main,
  borderRadius: 8,
  height: 58,
  padding: '0 24px',
  border: '2px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    border: '2px solid',
    borderColor: alpha(theme.palette.primary.main, 0),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}))

const NotFound: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 16,
      }}
    >
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h3" align="center">
          <b>Oops! Page not found 😞</b>
        </Typography>
        <br />
        <ThemeButton
          variant="outlined"
          color="inherit"
          startIcon={<CottageOutlined style={{ fontSize: 30 }} />}
          component={Link}
          to="/"
        >
          <b>Home</b>
        </ThemeButton>
        <>
          <Box
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/404-bg.png`}
              alt="Not Found"
              height="100%"
              width="100%"
              draggable={false}
            />
          </Box>
          <Box
            sx={{ mt: 9, mb: 4, display: { md: 'none' } }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/404-bg.png`}
                alt="Not Found"
                height="85%"
                width="85%"
                draggable={false}
              />
            </Box>
          </Box>
        </>
      </Grid>
    </Box>
  )
}

export default NotFound
