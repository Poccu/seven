import { FC, useEffect, useState } from 'react'
import {
  AvatarGroup,
  Box,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import {
  FavoriteBorder,
  Favorite,
  Visibility,
  TaskAlt,
} from '@mui/icons-material'
import AddPost from './AddPost'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/useAuth'
import { IPost, IUser } from '../../../types'
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
  DocumentData,
} from 'firebase/firestore'
import moment from 'moment'
import AddComment from './AddComment'
import PostSettings from './PostSettings'
import { TransitionGroup } from 'react-transition-group'
import Collapse from '@mui/material/Collapse'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import EditPost from './EditPost'
import DeletePost from './DeletePost'
import { ThemeTooltip } from '../../ui/ThemeTooltip'

const Home: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [editingId, setEditingId] = useState('')
  const [deletedPosts, setDeletedPosts] = useState<IPost[]>([])
  // console.log('deletedPosts', deletedPosts)
  // console.log('posts', posts)

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

    const setPostsFunc = onSnapshot(q, (querySnapshot) => {
      const postsArr: IPost[] = []
      querySnapshot.forEach(async (d: DocumentData) => {
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
            <BorderBox sx={{ p: 3, mb: 2 }}>
              {!deletedPosts.some((x) => x.id === post.id) && (
                <Stack direction="row" justifyContent="space-between">
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
                      <Stack alignItems="center" direction="row" spacing={0.5}>
                        <Link to={`/profile/${post.author.uid}`}>
                          <Typography variant="h6">
                            <b>
                              {post?.author?.displayName?.replace(
                                /[\p{Emoji}\u200d]+/gu,
                                ''
                              )}
                            </b>
                          </Typography>
                        </Link>
                        {post.author.uid === 'HgxGhdMZc6TcrYNf80IfzoURccH2' && (
                          <Tooltip title="Admin" placement="top">
                            <TaskAlt
                              color="info"
                              sx={{
                                width: '20px ',
                                height: '20px',
                              }}
                            />
                          </Tooltip>
                        )}
                      </Stack>
                      <Typography variant="body2" color="textSecondary">
                        {moment(post.createdAt).fromNow()}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Box sx={{ mt: -1, mr: -1 }}>
                    <PostSettings
                      post={post}
                      setEditingId={setEditingId}
                      setDeletedPosts={setDeletedPosts}
                    />
                  </Box>
                </Stack>
              )}
              {editingId !== post.id &&
              !deletedPosts.some((x) => x.id === post.id) ? (
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {post.content}
                </Typography>
              ) : editingId === post.id &&
                !deletedPosts.some((x) => x.id === post.id) ? (
                <EditPost post={post} setEditingId={setEditingId} />
              ) : null}
              {deletedPosts.some((x) => x.id === post.id) && ( // todo
                <DeletePost
                  post={post}
                  deletedPosts={deletedPosts}
                  setDeletedPosts={setDeletedPosts}
                />
              )}
              {!deletedPosts.some((x) => x.id === post.id) && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ ml: -1, mb: -1 }}
                >
                  <Stack
                    alignItems="center"
                    direction="row"
                    // spacing={0.2}
                    sx={{ mt: 2 }}
                  >
                    <ThemeTooltip
                      title={
                        post.likes.length > 0 && (
                          <Link to={`/profile`}>
                            <AvatarGroup
                              max={4}
                              spacing={12}
                              // sx={{ border: '4px solid' }}
                              // color="primary"
                            >
                              {post.likes.map((user) => (
                                <Link to={`/profile/${user.uid}`}>
                                  <ThemeAvatar
                                    alt={user.displayName}
                                    src={user.photoURL}
                                    key={user.uid}
                                    title={user?.displayName?.replace(
                                      /[\p{Emoji}\u200d]+/gu,
                                      ''
                                    )}
                                    sx={{
                                      width: '40px',
                                      height: '40px',
                                      border: '4px solid',
                                    }}
                                  >
                                    {user?.displayName?.match(
                                      /[\p{Emoji}\u200d]+/gu
                                    )}
                                  </ThemeAvatar>
                                </Link>
                              ))}
                            </AvatarGroup>
                          </Link>
                        )
                      }
                      placement="top"
                    >
                      {cur?.uid &&
                      !post.likes.some((x) => x.uid === cur.uid) ? (
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
                                    {
                                      displayName: cur?.displayName,
                                      photoURL: cur?.photoURL,
                                      uid: cur?.uid,
                                    },
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
                                  .likes.filter(
                                    (x: IUser) => x.uid !== cur?.uid
                                  )
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
                    </ThemeTooltip>
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
              )}
              {/* <Divider /> */}
              {/* <AddComment /> */}
            </BorderBox>
          </Collapse>
        ))}
      </TransitionGroup>
    </>
  )
}

export default Home
