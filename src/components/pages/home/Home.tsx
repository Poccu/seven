import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import BorderBox from '../../ui/BorderBox'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddPost from './AddPost'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../providers/useAuth'
import { IPost } from '../../../types'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  runTransaction,
  limit,
} from 'firebase/firestore'
import moment from 'moment'
import AddComment from './AddComment'
import PostSettings from './PostSettings'
import { TransitionGroup } from 'react-transition-group'
import Collapse from '@mui/material/Collapse'

type Props = {}

function Home({}: Props) {
  const [posts, setPosts] = useState<IPost[]>([])

  const { db, cur } = useAuth()

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
      // limit(4)
    )

    const unsub = onSnapshot(q, (querySnapshot: any) => {
      const postsArr: any[] = []
      querySnapshot.forEach(async (d: any) => {
        postsArr.push(d.data())
      })
      setPosts(postsArr)
      console.log('postsArr', postsArr)
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <>
      <AddPost />
      <TransitionGroup>
        {posts.map((post, index) => (
          <Collapse key={index}>
            <Box sx={{ mb: 2 }}>
              <BorderBox>
                <Box sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    // alignItems="center"
                    // spacing={2}
                  >
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Link to={`/profile/${post.author.uid}`}>
                        <Avatar
                          alt={post.author.displayName}
                          src={post.author.photoURL}
                          sx={{ width: 46, height: 46 }}
                          draggable={false}
                        >
                          <b>
                            {post?.author?.displayName
                              ?.replace(/\B\w+/g, '')
                              .split(' ')
                              .join('')}
                          </b>
                        </Avatar>
                      </Link>
                      <Stack>
                        <Link to={`/profile/${post.author.uid}`}>
                          <Typography variant="h6">
                            <b>{post.author.displayName}</b>
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="textSecondary">
                          {moment(post.createdAt).fromNow()}
                        </Typography>
                      </Stack>
                    </Stack>
                    <PostSettings post={post} />
                  </Stack>
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    {post.content}
                  </Typography>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack
                      alignItems="center"
                      direction="row"
                      // spacing={0.2}
                      sx={{ mt: 2 }}
                    >
                      {cur?.uid && !post.likes.includes(cur?.uid) ? (
                        <IconButton
                          onClick={async () => {
                            const docRef = doc(db, 'posts', post.id)

                            try {
                              await runTransaction(db, async (transaction) => {
                                const sfDoc = await transaction.get(docRef)
                                if (!sfDoc.exists()) {
                                  throw 'Document does not exist!'
                                }
                                if (!sfDoc.data().likes.includes(cur?.uid)) {
                                  const newLikesArr = [
                                    ...sfDoc.data().likes,
                                    cur?.uid,
                                  ]
                                  // console.log(newLikesArr)
                                  transaction.update(docRef, {
                                    likes: newLikesArr,
                                  })
                                }
                              })
                              // console.log('Like!')
                            } catch (e) {
                              console.log('Like failed: ', e)
                            }
                          }}
                          color="secondary"
                        >
                          <FavoriteBorderIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={async () => {
                            const docRef = doc(db, 'posts', post.id)

                            try {
                              await runTransaction(db, async (transaction) => {
                                const sfDoc = await transaction.get(docRef)
                                if (!sfDoc.exists()) {
                                  throw 'Document does not exist!'
                                }
                                const newLikesArr = sfDoc
                                  .data()
                                  .likes.filter((id: any) => id !== cur?.uid)
                                // console.log(newLikesArr)
                                transaction.update(docRef, {
                                  likes: newLikesArr,
                                })
                              })
                              // console.log('Dislike!')
                            } catch (e) {
                              console.log('Dislike failed: ', e)
                            }
                          }}
                          color="error"
                        >
                          <FavoriteIcon />
                        </IconButton>
                      )}

                      <Typography variant="body1" color="textSecondary">
                        <b>{post.likes.length > 0 && post.likes.length}</b>
                      </Typography>
                    </Stack>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                      sx={{ mt: 2 }}
                    >
                      <VisibilityIcon color="secondary" />
                      <Typography variant="body2" color="textSecondary">
                        {post.views}
                      </Typography>
                    </Stack>
                  </Stack>
                  {/* <Divider /> */}
                  {/* <AddComment /> */}
                </Box>
              </BorderBox>
            </Box>
          </Collapse>
        ))}
      </TransitionGroup>
    </>
  )
}

export default Home
