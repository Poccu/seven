import { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { doc, runTransaction } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import {
  Box,
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popper,
  Typography,
} from '@mui/material'
import {
  MoreHoriz,
  BookmarkAddOutlined,
  BookmarkRemoveOutlined,
  Clear,
  Edit,
} from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { isOneDayPassed } from '@utils/isOneDayPassed'
import { MenuBox } from '@ui/ThemeBox'

import { IPost } from 'src/types/types'

type Props = {
  post: IPost
  setEditingId: React.Dispatch<React.SetStateAction<string>>
  setDeletedPosts: React.Dispatch<React.SetStateAction<IPost[]>>
}

export const PostMenu: FC<Props> = ({
  post,
  setEditingId,
  setDeletedPosts,
}) => {
  const { t } = useTranslation(['news'])
  const { db } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const { uid } = useAppSelector((state) => state.user)

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  const handleCloseDelete = (event: Event | React.SyntheticEvent) => {
    setOpen(false)

    setDeletedPosts((prevDeletedPosts) => [...prevDeletedPosts, post])
    setEditingId('')

    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleAddBookmark = async (post: IPost) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        if (!sfDoc.data().bookmarks.includes(uid)) {
          const newBookmarksArr = [...sfDoc.data().bookmarks, uid]

          transaction.update(docRef, {
            bookmarks: newBookmarksArr,
          })
        }
      })
    } catch (e) {
      console.log('Bookmark failed: ', e)
    }

    if (!uid) return
    const curUserRef = doc(db, 'users', uid)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(curUserRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        if (!sfDoc.data().bookmarks.includes(post.id)) {
          const newBookmarksArr = [...sfDoc.data().bookmarks, post.id]

          transaction.update(curUserRef, {
            bookmarks: newBookmarksArr,
          })
        }
      })
    } catch (e) {
      console.log('Bookmark failed: ', e)
    }

    enqueueSnackbar(t('Post added to Bookmarks!'), { variant: 'success' })
  }

  const handleRemoveBookmark = async (post: IPost) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newBookmarksArr = sfDoc
          .data()
          .bookmarks.filter((id: string) => id !== uid)

        transaction.update(docRef, {
          bookmarks: newBookmarksArr,
        })
      })
    } catch (e) {
      console.log('Delete Bookmark failed: ', e)
    }

    if (!uid) return
    const curUserRef = doc(db, 'users', uid)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(curUserRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newBookmarksArr = sfDoc
          .data()
          .bookmarks.filter((id: string) => id !== post.id)

        transaction.update(curUserRef, {
          bookmarks: newBookmarksArr,
        })
      })
    } catch (e) {
      console.log('Delete Bookmark failed: ', e)
    }

    enqueueSnackbar(t('Post removed from Bookmarks!'), { variant: 'error' })
  }

  return (
    <Box onMouseOver={handleToggle} onMouseOut={handleToggle}>
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="secondary"
        sx={{ width: '40px ', height: '40px', m: -1 }}
      >
        <MoreHoriz color="inherit" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
        sx={{ zIndex: 10 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right top',
            }}
          >
            <MenuBox>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {uid && !post.bookmarks.includes(uid) ? (
                    <MenuItem onClick={() => handleAddBookmark(post)}>
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <BookmarkAddOutlined color="primary" />
                      </ListItemIcon>
                      <Typography variant="body1">
                        {t('Add to Bookmarks')}
                      </Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => handleRemoveBookmark(post)}>
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <BookmarkRemoveOutlined color="primary" />
                      </ListItemIcon>
                      <Typography variant="body1">
                        {t('Remove from Bookmarks')}
                      </Typography>
                    </MenuItem>
                  )}
                  {post.author.uid === uid &&
                    !isOneDayPassed(+post.createdAt) && (
                      <MenuItem
                        onClick={() => {
                          setOpen(false)
                          setEditingId(post.id)
                        }}
                      >
                        <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                          <Edit color="primary" />
                        </ListItemIcon>
                        <Typography variant="body1">{t('Edit')}</Typography>
                      </MenuItem>
                    )}
                  {post.author.uid === uid && (
                    <MenuItem onClick={handleCloseDelete}>
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <Clear color="error" />
                      </ListItemIcon>
                      <Typography variant="body1">
                        {t('Delete post')}
                      </Typography>
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </MenuBox>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}
