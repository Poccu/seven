import { Avatar, Box, Stack, Typography } from '@mui/material'
import BorderBox from '../../ui/BorderBox'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import NewPost from './NewPost'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../providers/useAuth'

type Props = {}

let posts = [
  {
    author: 'Ilon Mask',
    avatar: 'https://i.pravatar.cc/200?img=13',
    time: '10 minutes ago',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus est odio, molestie et enim non, porttitor vehicula ex. Mauris pellentesque, ante nec dignissim efficitur, purus urna pellentesque odio, eget ornare tortor ante nec lectus. Proin aliquet massa leo, nec ultricies sem ullamcorper sed. Nam porta odio nec metus blandit condimentum.',
  },
  {
    author: 'Asia Filina',
    avatar: 'https://i.pravatar.cc/200?img=49',
    time: '21 minutes ago',
    text: 'Pellentesque ultricies interdum scelerisque. Cras dapibus volutpat odio, sed iaculis lorem vestibulum a. Nunc sed sapien blandit, rhoncus eros vel, ultricies ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus luctus a dolor vel laoreet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec porta tellus ac elementum aliquam. Vestibulum vitae tellus eu sem elementum tincidunt et nec ipsum.',
  },
  {
    author: 'Max Pelts',
    avatar: 'https://i.pravatar.cc/200?img=59',
    time: '2 hours ago',
    text: 'Vivamus luctus a dolor vel laoreet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec porta tellus ac elementum aliquam. Vestibulum vitae tellus eu sem elementum tincidunt et nec ipsum.',
  },
  {
    author: 'Greg Fessoni',
    avatar: 'https://i.pravatar.cc/200?img=65',
    time: '4 hours ago',
    text: 'Pellentesque ultricies interdum scelerisque. Cras dapibus volutpat odio, sed iaculis lorem vestibulum a. Sed posuere sem magna, in efficitur dolor rutrum eget. Pellentesque ultricies interdum scelerisque. Cras dapibus volutpat odio, sed iaculis lorem vestibulum a. Nunc sed sapien blandit, rhoncus eros vel, ultricies ipsum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus luctus a dolor vel laoreet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec porta tellus ac elementum aliquam. Vestibulum vitae tellus eu sem elementum tincidunt et nec ipsum.',
  },
]

function Home({}: Props) {
  const { ga, user } = useAuth()
  console.log(user)

  const navigate = useNavigate()

  useEffect(() => {
    !user && navigate('/auth')
  }, [])

  return (
    <>
      <NewPost />
      {posts.map((post, index) => (
        <Box sx={{ mb: 2 }} key={index}>
          <BorderBox>
            <Box sx={{ p: 3 }}>
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Link to="/profile">
                  <Avatar
                    alt={post.author}
                    src={post.avatar}
                    sx={{ width: 46, height: 46 }}
                    draggable={false}
                  />
                </Link>
                <Stack>
                  <Link to="/profile">
                    <Typography variant="h6">{post.author}</Typography>
                  </Link>
                  <Typography variant="body2" color="textSecondary">
                    {post.time}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="body1">{post.text}</Typography>
              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
                sx={{ mt: 2 }}
              >
                <FavoriteBorderIcon />
                {/* <Typography variant="body2" color="textSecondary">
                  <b>11</b>
                </Typography> */}
              </Stack>
            </Box>
          </BorderBox>
        </Box>
      ))}
    </>
  )
}

export default Home
