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
import ClearIcon from '@mui/icons-material/Clear'
import AddPost from './AddPost'
import { Link, NavLink, useNavigate } from 'react-router-dom'
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
  Firestore,
  getDocs,
  updateDoc,
  limit,
  deleteDoc,
} from 'firebase/firestore'
import moment from 'moment'
import { grey } from '@mui/material/colors'
import AddComment from './AddComment'

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

  // const navigate = useNavigate()

  // useEffect(() => {
  //   !cur && navigate('/auth')
  // }, [])

  // useEffect(() => {
  //   const sfDocRef = doc(db, 'posts', 'gI54O3LWqbcKBSWw0PNX')

  //   try {
  //     const newPopulation = runTransaction(db, async (transaction) => {
  //       const sfDoc = await transaction.get(sfDocRef)
  //       if (!sfDoc.exists()) {
  //         throw 'Document does not exist!'
  //       }

  //       const newViews = sfDoc.data().views + 1
  //       if (newViews <= 1000000) {
  //         transaction.update(sfDocRef, { views: newViews })
  //         return newViews
  //       } else {
  //         return Promise.reject('Sorry! Population is too big')
  //       }
  //     })

  //     console.log('Population increased to ', newPopulation)
  //   } catch (e) {
  //     // This will be a "population is too big" error.
  //     console.error(e)
  //   }
  // }, [])

  return (
    <>
      <AddPost />
      {posts.map((post, index) => (
        <Box sx={{ mb: 2 }} key={index}>
          <BorderBox>
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                // alignItems="center"
                // spacing={2}
              >
                <NavLink
                  to={`/profile/${post.author.uid}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                    sx={{ mb: 2 }}
                  >
                    {/* <Link to={`/profile/${post.author.uid}`}> */}
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
                    {/* </Link> */}
                    <Stack>
                      {/* <Link to={`/profile/${post.author.uid}`}> */}
                      <Typography variant="h6">
                        {post.author.displayName}
                      </Typography>
                      {/* </Link> */}
                      <Typography variant="body2" color="textSecondary">
                        {moment(post.createdAt).fromNow()}
                      </Typography>
                    </Stack>
                  </Stack>
                </NavLink>
                {post.author.uid === cur?.uid && (
                  <IconButton
                    onClick={async () => {
                      await deleteDoc(doc(db, 'posts', post.id))
                    }}
                    color="inherit"
                    sx={{ width: '40px ', height: '40px' }}
                  >
                    <ClearIcon color="inherit" />
                  </IconButton>
                )}
              </Stack>
              <Typography variant="body1">{post.content}</Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={0.2}
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
                              transaction.update(docRef, { likes: newLikesArr })
                            }
                          })
                          console.log('Transaction successfully committed!')
                        } catch (e) {
                          console.log('Transaction failed: ', e)
                        }
                      }}
                      color="inherit"
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
                            transaction.update(docRef, { likes: newLikesArr })
                          })
                          console.log('Transaction successfully committed!')
                        } catch (e) {
                          console.log('Transaction failed: ', e)
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
                  <VisibilityIcon sx={{ color: grey[700] }} />
                  <Typography variant="body2" color="textSecondary">
                    {post.views}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <AddComment />
            </Box>
          </BorderBox>
        </Box>
      ))}
    </>
  )
}

export default Home
