import { FC, useRef, useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import {
  Box,
  IconButton,
  ListItemIcon,
  styled,
  Typography,
} from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { IPost } from '../../../types'
import { deleteDoc, doc, runTransaction } from 'firebase/firestore'
import {
  MoreHoriz,
  BookmarkAddOutlined,
  BookmarkRemoveOutlined,
  Clear,
  Edit,
} from '@mui/icons-material'

type Props = {
  post: IPost
}

const ThemeBox = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.action.disabled,
  // backgroundColor: theme.palette.background.paper,
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

  const { db, cur } = useAuth()

  return (
    <Box onMouseOver={handleToggle} onMouseOut={handleToggle}>
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="secondary"
        sx={{ width: '40px ', height: '40px' }}
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
                  {cur?.uid && !post?.bookmarks?.includes(cur?.uid) ? (
                    <MenuItem
                      onClick={async () => {
                        const docRef = doc(db, 'posts', post.id)

                        try {
                          await runTransaction(db, async (transaction) => {
                            const sfDoc = await transaction.get(docRef)
                            if (!sfDoc.exists()) {
                              throw 'Document does not exist!'
                            }
                            if (!sfDoc.data().bookmarks.includes(cur?.uid)) {
                              const newBookmarksArr = [
                                ...sfDoc.data().bookmarks,
                                cur?.uid,
                              ]
                              // console.log(newBookmarksArr)
                              transaction.update(docRef, {
                                bookmarks: newBookmarksArr,
                              })
                            }
                          })
                        } catch (e) {
                          console.log('Bookmark failed: ', e)
                        }
                      }}
                    >
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <BookmarkAddOutlined color="primary" />
                      </ListItemIcon>
                      <Typography variant="body1">Add to Bookmarks</Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={async () => {
                        const docRef = doc(db, 'posts', post.id)

                        try {
                          await runTransaction(db, async (transaction) => {
                            const sfDoc = await transaction.get(docRef)
                            if (!sfDoc.exists()) {
                              throw 'Document does not exist!'
                            }
                            const newBookmarksArr = sfDoc
                              .data()
                              .bookmarks.filter((id: string) => id !== cur?.uid)
                            // console.log(newBookmarksArr)
                            transaction.update(docRef, {
                              bookmarks: newBookmarksArr,
                            })
                          })
                        } catch (e) {
                          console.log('Delete Bookmark failed: ', e)
                        }
                      }}
                    >
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <BookmarkRemoveOutlined color="primary" />
                      </ListItemIcon>
                      <Typography variant="body1">
                        Remove from Bookmarks
                      </Typography>
                    </MenuItem>
                  )}
                  {post.author.uid === cur?.uid && (
                    <MenuItem onClick={() => console.log('EDIT POST')}>
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <Edit color="primary" />
                      </ListItemIcon>
                      <Typography variant="body1">Edit</Typography>
                    </MenuItem>
                  )}
                  {post.author.uid === cur?.uid && (
                    <MenuItem onClick={handleCloseDelete}>
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <Clear color="error" />
                      </ListItemIcon>
                      <Typography variant="body1">Delete post</Typography>
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </ThemeBox>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}

export default PostSettings
