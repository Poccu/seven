import { FC, useEffect, useRef, useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { Box, IconButton, styled } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useAuth } from '../../providers/useAuth'
import { IPost } from '../../../types'
import { deleteDoc, doc } from 'firebase/firestore'

type Props = {
  post: IPost
}

const ThemeBox = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  boxShadow: '0px 0px 1px 1px rgba(0, 0, 0, 0.15)',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.action.disabled,
}))

const PostSettings: FC<Props> = ({ post }) => {
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

  const handleCloseAddBookmark = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  const handleCloseDelete = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
    deleteDoc(doc(db, 'posts', post.id))
  }

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  const { db, cur } = useAuth()

  return (
    <>
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="secondary"
        sx={{ width: '40px ', height: '40px' }}
      >
        <MoreHorizIcon color="inherit" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right top',
            }}
          >
            <ThemeBox>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleCloseAddBookmark}>
                    Add to Bookmarks
                  </MenuItem>
                  {post.author.uid === cur?.uid && (
                    <MenuItem onClick={handleCloseDelete}>Delete post</MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </ThemeBox>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default PostSettings
