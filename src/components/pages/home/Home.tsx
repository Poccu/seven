import { Avatar, Box, Stack, Typography } from '@mui/material'
import BorderBox from '../../ui/BorderBox'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddPost from './AddPost'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../providers/useAuth'
import { IPost } from '../../../types'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import moment from 'moment'

type Props = {}

function Home({}: Props) {
  const [posts, setPosts] = useState<IPost[]>([])

  const { user, db } = useAuth()
  console.log(user)

  useEffect(() => {
    console.log('TEST')
    const q = query(
      collection(db, 'posts')
      // , where("state", "==", "CA")
    )
    const unsub = onSnapshot(q, (querySnapshot: any) => {
      const postsArr: any[] = []
      querySnapshot.forEach((doc: any) => {
        console.log(doc.data().createdAt)
        postsArr.push(doc.data())
      })
      const filter = postsArr.sort((a, b) => b.createdAt - a.createdAt)
      console.log(postsArr)
      setPosts(filter)
    })

    return () => {
      unsub()
    }
  }, [])

  // const navigate = useNavigate()

  // useEffect(() => {
  //   !user && navigate('/auth')
  // }, [])

  return (
    <>
      <AddPost setPosts={setPosts} />
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
                {/* <Link to="/profile"> */}
                <Avatar
                  alt={post.author.name}
                  src={post.author.avatar}
                  sx={{ width: 46, height: 46 }}
                  draggable={false}
                >
                  <b>
                    {post.author.name.replace(/\B\w+/g, '').split(' ').join('')}
                  </b>
                </Avatar>
                {/* </Link> */}
                <Stack>
                  {/* <Link to="/profile"> */}
                  <Typography variant="h6">{post.author.name}</Typography>
                  {/* </Link> */}
                  <Typography variant="body2" color="textSecondary">
                    {moment(post.createdAt).fromNow()}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="body1">{post.content}</Typography>
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
