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
import { MoreHoriz, BookmarkRemoveOutlined } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { MenuBox } from '@ui/ThemeBox'

import { IPost } from 'src/types/types'

type Props = {
  post: IPost
}

export const BookmarksPostMenu: FC<Props> = ({ post }) => {
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

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
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

    enqueueSnackbar(t('Post removed from Bookmarks'), { variant: 'error' })
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
                  <MenuItem onClick={() => handleRemoveBookmark(post)}>
                    <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                      <BookmarkRemoveOutlined color="primary" />
                    </ListItemIcon>
                    <Typography>{t('Remove from Bookmarks')}</Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </MenuBox>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}
