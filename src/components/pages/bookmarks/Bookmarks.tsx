import { FC, useEffect, useState } from 'react'
import {
  AvatarGroup,
  Box,
  Collapse,
  Divider,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  collection,
  orderBy,
  query,
  doc,
  onSnapshot,
  DocumentData,
  runTransaction,
  where,
} from 'firebase/firestore'
import { IPost, IUser } from '../../../types'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { Link } from 'react-router-dom'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import {
  Clear,
  Favorite,
  FavoriteBorder,
  TaskAlt,
  Visibility,
} from '@mui/icons-material'
import moment from 'moment'
import PostSettings from '../home/PostSettings'
import { ThemeTooltip } from '../../ui/ThemeTooltip'
import { ThemeLikeIconButton } from '../../ui/ThemeIconButton'
import { TransitionGroup } from 'react-transition-group'

const Bookmarks: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([])

  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState<IUser[]>([])

  const { db, cur, user } = useAuth()

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('bookmarks', 'array-contains', cur.uid)
      // orderBy('createdAt', 'desc')
      // limit(4)
    )

    const setPostsFunc = onSnapshot(q, (querySnapshot) => {
      const postsArr: IPost[] = []
      querySnapshot.forEach(async (d: DocumentData) => {
        postsArr.push(d.data())
      })
      setPosts(postsArr)
      // console.log('postsArr', postsArr)
    })

    return () => {
      setPostsFunc()
    }
  }, [])

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>Bookmarks</b>
        </Typography>
      </BorderBox>
      <TransitionGroup>
        {posts.map((post) => (
          <Collapse key={post.id}>
            <BorderBox sx={{ p: 3, mb: 2 }}>
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
                {/* <PostSettings
              post={post}
              setEditingId={setEditingId}
              setDeletedPosts={setDeletedPosts}
            /> */}
              </Stack>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {post.content}
              </Typography>
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
                              <Link to={`/profile/${user.uid}`} key={user.uid}>
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
                    {cur.uid && !post.likes.some((x) => x.uid === cur.uid) ? (
                      <IconButton
                        onClick={async () => {
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
              {/* <Divider /> */}
              {/* <AddComment /> */}
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
        // BackdropProps={{
        //   style: { backgroundColor: 'rgba(0, 0, 0, 0.55)' },
        // }}
        sx={{
          zIndex: 1600,
        }}
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

export default Bookmarks
