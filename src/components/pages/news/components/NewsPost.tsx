import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TransitionGroup } from 'react-transition-group'
import { doc, runTransaction } from 'firebase/firestore'
import moment from 'moment'

import {
  alpha,
  AvatarGroup,
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ChatBubbleOutline,
  Clear,
  Edit,
  Favorite,
  FavoriteBorder,
  TaskAlt,
  Visibility,
} from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { isOneDayPassed } from '@utils/isOneDayPassed'
import { showViews } from '@utils/showViews'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeAvatar } from '@ui/ThemeAvatar'
import { ThemeOnlineBadge } from '@ui/ThemeOnlineBadge'
import { ThemeTooltip } from '@ui/ThemeTooltip'
import { ModalLikes } from '@modals/ModalLikes'
import { ModalImage } from '@modals/ModalImage'

import { IComment, IPost, IUser } from 'src/types/types'
import { NewsPostMenu } from './NewsPostMenu'
import { EditPost } from './EditPost'
import { DeletePost } from './DeletePost'
import { EditComment } from './EditComment'
import { AddComment } from './AddComment'

type Props = {
  post: IPost
  deletedPosts: IPost[]
  setDeletedPosts: React.Dispatch<React.SetStateAction<IPost[]>>
  editingId: string
  setEditingId: React.Dispatch<React.SetStateAction<string>>
}

export const NewsPost: FC<Props> = ({
  post,
  deletedPosts,
  setDeletedPosts,
  editingId,
  setEditingId,
}) => {
  const { t } = useTranslation(['news'])
  const { db, usersRdb } = useAuth()
  const theme = useTheme()

  const { emoji, uid, displayName, photoURL } = useAppSelector(
    (state) => state.user
  )
  const { users } = useAppSelector((state) => state.users)

  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState<IUser[]>([])

  const [openImage, setOpenImage] = useState(false)
  const [modalImage, setModalImage] = useState<string>('')

  const [visibleId, setVisibleId] = useState<string>('')

  const handleOpenModal = (post: IPost) => {
    setOpenModal(true)
    setModalData(post.likes)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setModalData([])
  }

  const handleOpenImage = (image: string) => {
    setOpenImage(true)
    setModalImage(image)
  }

  const handleCloseImage = () => {
    setOpenImage(false)
    setModalImage('')
  }

  const handleOpenModalComments = (comment: IComment | undefined) => {
    if (!comment) return
    setOpenModal(true)
    setModalData(comment.likes)
  }

  const handleShow = (comment: IComment) => {
    setVisibleId(comment.id)
  }

  const handleHide = () => setVisibleId('')

  const handleLike = async (post: IPost) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newLikesArr = [
          ...new Map(
            [...sfDoc.data().likes, { displayName, photoURL, uid, emoji }].map(
              (like) => [like['uid'], like]
            )
          ).values(),
        ]

        transaction.update(docRef, {
          likes: newLikesArr,
        })
      })
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
          throw new Error('Document does not exist!')
        }

        const newLikesArr = sfDoc
          .data()
          .likes.filter((user: IUser) => user.uid !== uid)

        transaction.update(docRef, {
          likes: newLikesArr,
        })
      })
    } catch (e) {
      console.log('Dislike failed: ', e)
    }
  }

  const handleLikeComment = async (post: IPost, id: string) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const comment = sfDoc
          .data()
          .comments.find((comment: IComment) => comment.id === id)

        const newLikesArr = [
          ...new Map(
            [
              ...sfDoc
                .data()
                .comments.find((comment: IComment) => comment.id === id).likes,
              { displayName, photoURL, uid, emoji },
            ].map((like) => [like['uid'], like])
          ).values(),
        ]

        comment.likes = newLikesArr

        const newCommentsArr = [
          ...sfDoc
            .data()
            .comments.filter((comment: IComment) => comment.id !== id),
          comment,
        ].sort((a, b) => +a.createdAt - +b.createdAt)

        transaction.update(docRef, {
          comments: newCommentsArr,
        })
      })
    } catch (e) {
      console.log('Like comment failed: ', e)
    }
  }

  const handleDislikeComment = async (post: IPost, id: string) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const comment = sfDoc
          .data()
          .comments.find((comment: IComment) => comment.id === id)

        const newLikesArr = sfDoc
          .data()
          .comments.find((comment: IComment) => comment.id === id)
          .likes.filter((user: IUser) => user.uid !== uid)

        comment.likes = newLikesArr

        const newCommentsArr = [
          ...sfDoc
            .data()
            .comments.filter((comment: IComment) => comment.id !== id),
          comment,
        ].sort((a, b) => +a.createdAt - +b.createdAt)

        transaction.update(docRef, {
          comments: newCommentsArr,
        })
      })
    } catch (e) {
      console.log('Dislike comment failed: ', e)
    }
  }

  const handleDeleteComment = async (post: IPost, id: string) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newCommentsArr = sfDoc
          .data()
          .comments.filter((comment: IComment) => comment.id !== id)

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
      <BorderBox
        sx={{
          p: 3,
          mb: 2,
          borderColor: post.id === 'neTIz7g7S06Kgo8oZzY2' ? '#b59261' : '',
        }}
      >
        {!deletedPosts.some((x) => x.id === post.id) && (
          <Stack direction="row" justifyContent="space-between">
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Link to={`/profile/${post.author.uid}`}>
                <ThemeOnlineBadge
                  overlap="circular"
                  variant={
                    usersRdb[post.author.uid]?.isOnline ? 'dot' : undefined
                  }
                >
                  <ThemeAvatar
                    alt={post.author.displayName}
                    src={users.find((u) => u.uid === post.author.uid)?.photoURL}
                    draggable={false}
                  >
                    {post.author.emoji}
                  </ThemeAvatar>
                </ThemeOnlineBadge>
              </Link>
              <Stack>
                <Stack alignItems="center" direction="row" spacing={0.5}>
                  <Link to={`/profile/${post.author.uid}`}>
                    <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                      <b>
                        {
                          users.find((u) => u.uid === post.author.uid)
                            ?.displayName
                        }
                      </b>
                    </Typography>
                  </Link>
                  {post.author.uid === 'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
                    <Tooltip
                      title={t('Admin', { ns: ['other'] })}
                      placement="top"
                    >
                      <TaskAlt
                        color="info"
                        sx={{ width: '20px ', height: '20px' }}
                      />
                    </Tooltip>
                  )}
                </Stack>
                <Typography variant="body2" color="textSecondary">
                  {moment(post.createdAt).calendar()}
                </Typography>
              </Stack>
            </Stack>
            <NewsPostMenu
              post={post}
              setEditingId={setEditingId}
              setDeletedPosts={setDeletedPosts}
            />
          </Stack>
        )}
        {editingId !== post.id &&
        !deletedPosts.some((x) => x.id === post.id) ? (
          <>
            <Typography
              variant="body1"
              sx={{
                ml: 1,
                wordBreak: 'break-word',
                whiteSpace: 'pre-line',
              }}
            >
              {post.content}
            </Typography>
            {post.images?.length === 3 || post.images?.length > 4 ? (
              <Stack
                direction="row"
                sx={{
                  mt: 2,
                  flexWrap: 'wrap',
                  gap: 1,
                }}
                justifyContent="center"
              >
                {post.images.map((image) => (
                  <Box sx={{ width: '258px', height: '258px' }} key={image}>
                    <img
                      src={image}
                      alt={image}
                      width="258px"
                      height="258px"
                      className="cover"
                      loading="lazy"
                      draggable={false}
                      onClick={() => handleOpenImage(image)}
                    />
                  </Box>
                ))}
              </Stack>
            ) : post.images?.length === 2 || post.images?.length === 4 ? (
              <Stack
                direction="row"
                sx={{
                  mt: 2,
                  flexWrap: 'wrap',
                  gap: 1,
                }}
                justifyContent="center"
              >
                {post.images.map((image) => (
                  <Box sx={{ width: '390px', height: '390px' }} key={image}>
                    <img
                      src={image}
                      alt={image}
                      width="390px"
                      height="390px"
                      className="cover"
                      loading="lazy"
                      draggable={false}
                      onClick={() => handleOpenImage(image)}
                    />
                  </Box>
                ))}
              </Stack>
            ) : post.images?.length === 1 ? (
              <Box sx={{ mt: 2 }} display="flex">
                <img
                  src={post.images[0]}
                  alt={post.images[0]}
                  className="image"
                  loading="lazy"
                  draggable={false}
                  onClick={() => handleOpenImage(post.images[0])}
                />
              </Box>
            ) : null}
          </>
        ) : editingId === post.id &&
          !deletedPosts.some((x) => x.id === post.id) ? (
          <EditPost post={post} setEditingId={setEditingId} />
        ) : null}
        {deletedPosts.some((x) => x.id === post.id) && (
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
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              sx={{ mt: 2, zIndex: 1 }}
            >
              <ThemeTooltip
                title={
                  post.likes.length > 0 && (
                    <Stack alignItems="center">
                      <Typography
                        textAlign="center"
                        variant="body2"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenModal(post)}
                      >
                        {t('Likes')}
                      </Typography>
                      <AvatarGroup
                        max={4}
                        spacing={12}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleOpenModal(post)}
                      >
                        {post.likes.map((user) => (
                          <Link to={`/profile/${user.uid}`} key={user.uid}>
                            <ThemeAvatar
                              alt={user.displayName}
                              src={
                                users.find((u) => u.uid === user.uid)?.photoURL
                              }
                              title={
                                users.find((u) => u.uid === user.uid)
                                  ?.displayName
                              }
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
                    </Stack>
                  )
                }
                placement="top"
                arrow
              >
                {!post.likes.some((user) => user.uid === uid) ? (
                  <Chip
                    label={
                      <Typography variant="body2">
                        <b>{post.likes.length > 0 && post.likes.length}</b>
                      </Typography>
                    }
                    sx={{
                      color: theme.palette.text.secondary,
                      backgroundColor: alpha(theme.palette.grey[700], 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.grey[700], 0.2),
                      },
                      pl: post.likes.length > 0 ? '0px' : '8px',
                    }}
                    icon={<FavoriteBorder sx={{ pl: 0.6 }} color="secondary" />}
                    onClick={() => handleLike(post)}
                  />
                ) : (
                  <Chip
                    label={
                      <Typography variant="body2">
                        <b>{post.likes.length > 0 && post.likes.length}</b>
                      </Typography>
                    }
                    sx={{
                      color: theme.palette.error.main,
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                      },
                    }}
                    icon={<Favorite sx={{ pl: 0.6 }} color="error" />}
                    onClick={() => handleDislike(post)}
                  />
                )}
              </ThemeTooltip>
              <Chip
                label={
                  <Typography variant="body2">
                    <b>{post.comments.length > 0 && post.comments.length}</b>
                  </Typography>
                }
                sx={{
                  color: theme.palette.text.secondary,
                  backgroundColor: alpha(theme.palette.grey[700], 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.grey[700], 0.2),
                  },
                  pl: post.comments.length > 0 ? '0px' : '8px',
                }}
                icon={<ChatBubbleOutline sx={{ pl: 0.7 }} color="secondary" />}
              />
            </Stack>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              sx={{ mt: 2, zIndex: 1 }}
            >
              <Visibility color="secondary" fontSize="small" />
              <Typography variant="caption" color="textSecondary">
                {showViews(post.views)}
              </Typography>
            </Stack>
          </Stack>
        )}
        {post.comments.length > 0 && (
          <TransitionGroup>
            {post.comments.map((comment) => (
              <Collapse
                key={comment.id}
                onMouseOver={() => handleShow(comment)}
                onMouseOut={handleHide}
              >
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    <Link to={`/profile/${comment.author.uid}`}>
                      <ThemeAvatar
                        alt={comment.author.displayName}
                        src={
                          users.find((u) => u.uid === comment.author.uid)
                            ?.photoURL
                        }
                        draggable={false}
                        sx={{ mt: 0.6 }}
                      >
                        {comment.author.emoji}
                      </ThemeAvatar>
                    </Link>
                    <Stack sx={{ width: '100%' }}>
                      <Stack alignItems="center" direction="row" spacing={0.5}>
                        <Link to={`/profile/${comment.author.uid}`}>
                          <Typography
                            variant="h6"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            <b>
                              {
                                users.find((u) => u.uid === comment.author.uid)
                                  ?.displayName
                              }
                            </b>
                          </Typography>
                        </Link>
                        {comment.author.uid ===
                          'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
                          <Tooltip
                            title={t('Admin', { ns: ['other'] })}
                            placement="top"
                          >
                            <TaskAlt
                              color="info"
                              sx={{ width: '20px ', height: '20px' }}
                            />
                          </Tooltip>
                        )}
                      </Stack>
                      {editingId !== comment.id ? (
                        <Typography
                          variant="body1"
                          sx={{
                            mb: 1,
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {comment.content}
                        </Typography>
                      ) : (
                        <EditComment
                          post={post}
                          comment={comment}
                          setEditingId={setEditingId}
                        />
                      )}
                      <Stack direction="row" spacing={1.5}>
                        <Typography variant="body2" color="textSecondary">
                          {moment(comment.createdAt).calendar()}
                        </Typography>
                        {comment.author.uid === uid &&
                          comment.id === visibleId &&
                          !isOneDayPassed(+comment.createdAt) && (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              onClick={() => setEditingId(comment.id)}
                              sx={{
                                cursor: 'pointer',
                                display: { xs: 'none', sm: 'block' },
                              }}
                            >
                              {t('Edit')}
                            </Typography>
                          )}
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack justifyContent="space-between">
                    {comment.author.uid === uid && comment.id === visibleId ? (
                      <IconButton
                        onClick={() => handleDeleteComment(post, comment.id)}
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

                    {comment.author.uid === uid &&
                      comment.id === visibleId &&
                      !isOneDayPassed(+comment.createdAt) && (
                        <IconButton
                          onClick={() => setEditingId(comment.id)}
                          color="secondary"
                          sx={{
                            height: '40px',
                            width: '40px',
                            display: { xs: 'block', sm: 'none' },
                          }}
                        >
                          <Edit sx={{ height: '20px', width: '20px' }} />
                        </IconButton>
                      )}

                    {(comment.likes.length > 0 || comment.id === visibleId) && (
                      <Stack
                        alignItems="center"
                        direction="row"
                        sx={{ width: '55px', mr: -2 }}
                      >
                        <ThemeTooltip
                          title={
                            comment.likes.length > 0 && (
                              <Stack alignItems="center">
                                <Typography
                                  textAlign="center"
                                  variant="body2"
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() =>
                                    handleOpenModalComments(
                                      post.comments.find(
                                        (x: IComment) => x.id === comment.id
                                      )
                                    )
                                  }
                                >
                                  {t('Likes')}
                                </Typography>
                                <AvatarGroup
                                  max={4}
                                  spacing={12}
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() =>
                                    handleOpenModalComments(
                                      post.comments.find(
                                        (x: IComment) => x.id === comment.id
                                      )
                                    )
                                  }
                                >
                                  {comment.likes.map((user) => (
                                    <Link
                                      to={`/profile/${user.uid}`}
                                      key={user.uid}
                                    >
                                      <ThemeAvatar
                                        alt={user.displayName}
                                        src={
                                          users.find((u) => u.uid === user.uid)
                                            ?.photoURL
                                        }
                                        title={
                                          users.find((u) => u.uid === user.uid)
                                            ?.displayName
                                        }
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
                              </Stack>
                            )
                          }
                          placement="top"
                          arrow
                        >
                          {!comment.likes.some((user) => user.uid === uid) ? (
                            <IconButton
                              onClick={() =>
                                handleLikeComment(post, comment.id)
                              }
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
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() =>
                                handleDislikeComment(post, comment.id)
                              }
                              color="error"
                              sx={{
                                height: '40px',
                                width: '40px',
                                mb: -1,
                              }}
                            >
                              <Favorite
                                sx={{ height: '20px', width: '20px' }}
                              />
                            </IconButton>
                          )}
                        </ThemeTooltip>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ ml: -0.5, mb: -1 }}
                        >
                          <b>
                            {comment.likes.length > 0 && comment.likes.length}
                          </b>
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Collapse>
            ))}
          </TransitionGroup>
        )}
        <AddComment post={post} />
      </BorderBox>
      <ModalLikes
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        modalData={modalData}
      />
      <ModalImage
        openImage={openImage}
        handleCloseImage={handleCloseImage}
        modalImage={modalImage}
      />
    </>
  )
}
