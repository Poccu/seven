import { FC, useEffect, useState } from 'react'
import {
  AvatarGroup,
  Box,
  Divider,
  IconButton,
  Modal,
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
  Clear,
  ChatBubbleOutline,
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
import { ThemeLikeIconButton } from '../../ui/ThemeIconButton'

const Home: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([])
  const [editingId, setEditingId] = useState('')
  const [deletedPosts, setDeletedPosts] = useState<IPost[]>([])
  // console.log('posts', posts)

  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState<IUser[]>([])

  const [expanded, setExpanded] = useState<string | false>('')

  const handleOpen = (post: IPost) => {
    if (expanded === post.id) {
      setExpanded('')
    } else {
      setExpanded(post.id)
    }
  }

  const { db, cur, user } = useAuth()

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

  const handleLike = async (post: IPost) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)
        if (!sfDoc.exists()) {
          throw 'Document does not exist!'
        }
        if (!sfDoc.data().likes.includes(cur.uid)) {
          const newLikesArr = [
            ...sfDoc.data().likes,
            {
              displayName: cur.displayName,
              photoURL: cur.photoURL,
              uid: cur.uid,
              emoji: user?.emoji,
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
  }

  const handleDislike = async (post: IPost) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)
        if (!sfDoc.exists()) {
          throw 'Document does not exist!'
        }
        const newLikesArr = sfDoc
          .data()
          .likes.filter((x: IUser) => x.uid !== cur.uid)
        // console.log(newLikesArr)
        transaction.update(docRef, {
          likes: newLikesArr,
        })
      })
      // console.log('Dislike!')
    } catch (e) {
      console.log('Dislike failed: ', e)
    }
  }

  const handleDeleteComment = async (post: IPost, id: string) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)
        if (!sfDoc.exists()) {
          throw 'Document does not exist!'
        }
        const newCommentsArr = sfDoc
          .data()
          .comments.filter((x: IPost) => x.id !== id)
        transaction.update(docRef, {
          comments: newCommentsArr,
        })
      })
    } catch (e) {
      console.log('Comment Delete failed: ', e)
    }
  }

  return (
    <>
      <AddPost />
      <TransitionGroup>
        {posts.map((post) => (
          <Collapse key={post.id}>
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
                        {post.author.emoji}
                      </ThemeAvatar>
                    </Link>
                    <Stack>
                      <Stack alignItems="center" direction="row" spacing={0.5}>
                        <Link to={`/profile/${post.author.uid}`}>
                          <Typography variant="h6">
                            <b>{post.author.displayName}</b>
                          </Typography>
                        </Link>
                        {post.author.uid === 'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
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
                  <PostSettings
                    post={post}
                    setEditingId={setEditingId}
                    setDeletedPosts={setDeletedPosts}
                  />
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
                    sx={{ mt: 2, zIndex: 1 }}
                  >
                    <Stack
                      alignItems="center"
                      direction="row"
                      sx={{ width: '55px' }}
                    >
                      <ThemeTooltip
                        title={
                          post.likes.length > 0 && (
                            <>
                              <Typography
                                textAlign="center"
                                variant="body2"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setOpenModal(true)
                                  setModalData(post.likes)
                                }}
                              >
                                Likes
                              </Typography>
                              <AvatarGroup
                                max={4}
                                spacing={12}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setOpenModal(true)
                                  setModalData(post.likes)
                                }}
                              >
                                {post.likes.map((user) => (
                                  <Link
                                    to={`/profile/${user.uid}`}
                                    key={user.uid}
                                  >
                                    <ThemeAvatar
                                      alt={user.displayName}
                                      src={user.photoURL}
                                      title={user.displayName}
                                      sx={{
                                        width: '40px',
                                        height: '40px',
                                      }}
                                    >
                                      {user.emoji}
                                    </ThemeAvatar>
                                  </Link>
                                ))}
                              </AvatarGroup>
                            </>
                          )
                        }
                        placement="top"
                      >
                        {cur.uid &&
                        !post.likes.some((x) => x.uid === cur.uid) ? (
                          <IconButton
                            onClick={() => handleLike(post)}
                            color="secondary"
                          >
                            <FavoriteBorder />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => handleDislike(post)}
                            color="error"
                          >
                            <Favorite />
                          </IconButton>
                        )}
                      </ThemeTooltip>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ ml: -0.5 }}
                      >
                        <b>{post.likes.length > 0 && post.likes.length}</b>
                      </Typography>
                    </Stack>
                    <IconButton
                      // onClick={() => handleOpen(post)}
                      color="secondary"
                    >
                      <ChatBubbleOutline />
                    </IconButton>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ ml: -0.5 }}
                    >
                      <b>{post.comments.length > 0 && post.comments.length}</b>
                    </Typography>
                  </Stack>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                    sx={{ mt: 2, zIndex: 1 }}
                  >
                    <Visibility color="secondary" />
                    <Typography variant="body2" color="textSecondary">
                      {post.views}
                    </Typography>
                  </Stack>
                </Stack>
              )}
              {post.comments.length > 0 && (
                <Stack sx={{ position: 'relative', zIndex: 1, mt: 1 }}>
                  <TransitionGroup>
                    {post.comments.map((comment: any) => (
                      <Collapse key={comment.id}>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row" spacing={2}>
                            <Link to={`/profile/${comment.author.uid}`}>
                              <ThemeAvatar
                                alt={comment.author.displayName}
                                src={comment.author.photoURL}
                                draggable={false}
                                sx={{ mt: 0.6 }}
                              >
                                {comment.author.emoji}
                              </ThemeAvatar>
                            </Link>
                            <Stack>
                              <Stack
                                alignItems="center"
                                direction="row"
                                spacing={0.5}
                              >
                                <Link to={`/profile/${comment.author.uid}`}>
                                  <Typography variant="h6">
                                    <b>{comment.author.displayName}</b>
                                  </Typography>
                                </Link>
                                {comment.author.uid ===
                                  'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
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
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {comment.content}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {moment(comment.createdAt).fromNow()}
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack justifyContent="space-between">
                            {comment.author.uid === cur.uid ? (
                              <IconButton
                                onClick={() =>
                                  handleDeleteComment(post, comment.id)
                                }
                                color="secondary"
                                sx={{
                                  height: '40px',
                                  width: '40px',
                                  mt: -1,
                                }}
                              >
                                <Clear sx={{ height: '20px', width: '20px' }} />
                              </IconButton>
                            ) : (
                              <Box sx={{ height: '40px', width: '40px' }}></Box>
                            )}
                            <Box sx={{ height: '40px', width: '40px' }}></Box>
                            {/* <IconButton
                              // onClick={() => handleLikeComment(post)}
                              color="secondary"
                              sx={{
                                height: '40px',
                                width: '40px',
                                mb: -1,
                              }}
                            >
                              <FavoriteBorder
                                sx={{ height: '20px', width: '20px' }}
                              />
                            </IconButton> */}
                          </Stack>
                        </Stack>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </Stack>
              )}
              <AddComment expanded={expanded} post={post} />
            </BorderBox>
          </Collapse>
        ))}
      </TransitionGroup>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setModalData([])
        }}
        sx={{ zIndex: 1600 }}
      >
        <BorderBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            p: 3,
            transform: 'translate(-50%, -50%)',
            width: 500,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">
              Likes: {modalData.length > 0 && modalData.length}
            </Typography>
            <IconButton
              onClick={() => {
                setOpenModal(false)
                setModalData([])
              }}
              color="secondary"
              sx={{ width: '50px ', height: '50px', m: -2 }}
            >
              <Clear />
            </IconButton>
          </Stack>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {modalData.map((user) => (
              <Box key={user.uid} sx={{ width: '100px' }}>
                <Link to={`/profile/${user.uid}`}>
                  <ThemeAvatar
                    alt={user.displayName}
                    src={user.photoURL}
                    sx={{
                      width: '100px',
                      height: '100px',
                      mb: 1,
                    }}
                  >
                    <Typography variant="h3">{user.emoji}</Typography>
                  </ThemeAvatar>
                  <Box
                    sx={{
                      position: 'relative',
                      top: '-33px',
                      left: '74px',
                      height: '30px',
                      width: '30px',
                      mb: '-33px',
                      zIndex: 1,
                    }}
                  >
                    <ThemeLikeIconButton color="error">
                      <Favorite fontSize="small" />
                    </ThemeLikeIconButton>
                  </Box>
                  <Typography variant="body2" textAlign="center">
                    {user.displayName.replace(/ .*/, '')}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Stack>
        </BorderBox>
      </Modal>
    </>
  )
}

export default Home
