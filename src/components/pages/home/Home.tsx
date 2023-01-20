import { FC, useEffect, useState } from 'react'
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import BorderBox from '../../ui/BorderBox'
import { FavoriteBorder, Favorite, Visibility } from '@mui/icons-material'
import AddPost from './AddPost'
import { Link } from 'react-router-dom'
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
  setDoc,
  increment,
  getDocs,
} from 'firebase/firestore'
import moment from 'moment'
import AddComment from './AddComment'
import PostSettings from './PostSettings'
import { TransitionGroup } from 'react-transition-group'
import Collapse from '@mui/material/Collapse'
import { ThemeAvatar } from '../../ui/ThemeAvatar'

const Home: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([])

  const { db, cur } = useAuth()

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
      // limit(4)
    )

    const incViews = async () => {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(async (d) => {
        const docRef = doc(db, 'posts', d.id)
        await setDoc(docRef, { views: increment(1) }, { merge: true })
      })
    }

    const setPostsFunc = onSnapshot(q, (querySnapshot: any) => {
      const postsArr: any[] = []
      querySnapshot.forEach(async (d: any) => {
        postsArr.push(d.data())
      })
      setPosts(postsArr)
      // console.log('postsArr', postsArr)
    })

    return () => {
      incViews()
      setPostsFunc()
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
                        <ThemeAvatar
                          alt={post.author.displayName}
                          src={post.author.photoURL}
                          draggable={false}
                        >
                          {/* <b>
                            {post?.author?.displayName
                              ?.replace(/[\p{Emoji}\u200d]+/gu, '')
                              ?.replace(/\B\w+/g, '')
                              .split(' ')
                              .join('')}
                          </b> */}
                          {post?.author?.displayName?.match(
                            /[\p{Emoji}\u200d]+/gu
                          )}
                        </ThemeAvatar>
                      </Link>
                      <Stack>
                        <Link to={`/profile/${post.author.uid}`}>
                          <Typography variant="h6">
                            <b>
                              {post?.author?.displayName?.replace(
                                /[\p{Emoji}\u200d]+/gu,
                                ''
                              )}
                              {post.author.uid ===
                                'HgxGhdMZc6TcrYNf80IfzoURccH2' && '⭐'}
                            </b>
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
                          <FavoriteBorder />
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
                          <Favorite />
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
                      <Visibility color="secondary" />
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
