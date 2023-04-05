import { ChangeEvent, FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { doc, setDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import {
  Box,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popper,
  Typography,
} from '@mui/material'
import { Clear, Edit, Upload } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { MenuBox } from '@ui/ThemeBox'
import { ThemeIconButton } from '@ui/ThemeIconButton'
import { ThemeLinearProgress } from '@ui/ThemeLinearProgress'

export const PhotoMenu: FC = () => {
  const { t } = useTranslation(['profile'])
  const { db, st, ga } = useAuth()

  const { uid, photoURL } = useAppSelector((state) => state.user)

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const [progress, setProgress] = useState<number>(0)

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

  const handleDelete = async () => {
    setOpen(false)
    if (!uid || !ga.currentUser) return

    await updateProfile(ga.currentUser, { photoURL: '' })

    const docRef = doc(db, 'users', uid)
    await setDoc(docRef, { photoURL: null }, { merge: true })
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setOpen(false)
    e.preventDefault()

    if (!e.target.files) return
    const file = e.target.files[0]

    const storageRef = ref(st, `images/users/${uid}/avatars/${file?.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(progress)
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused')
            break
          case 'running':
            // console.log('Upload is running')
            break
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break
          case 'storage/canceled':
            // User canceled the upload
            break
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          if (!uid || !ga.currentUser) return
          await updateProfile(ga.currentUser, { photoURL: downloadURL })

          const docRef = doc(db, 'users', uid)
          await setDoc(docRef, { photoURL: downloadURL }, { merge: true })

          setProgress(0)
        })
      }
    )
  }

  return (
    <>
      <Box
        onMouseOver={handleToggle}
        onMouseOut={handleToggle}
        sx={{
          position: 'relative',
          top: '-38px',
          left: '112px',
          height: '35px',
          width: '35px',
          mb: '-35px',
          zIndex: 1,
        }}
      >
        <ThemeIconButton
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
        >
          <Edit
            color="inherit"
            sx={{
              width: '17px ',
              height: '17px',
            }}
          />
        </ThemeIconButton>
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
              <MenuBox>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem component="label">
                      <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                        <Upload color="primary" />
                      </ListItemIcon>
                      <Typography variant="body1">
                        {t('Upload photo')}
                      </Typography>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleUpload}
                        hidden
                      />
                    </MenuItem>
                    {photoURL && (
                      <MenuItem onClick={handleDelete}>
                        <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                          <Clear color="error" />
                        </ListItemIcon>
                        <Typography variant="body1">
                          {t('Delete photo')}
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
      {progress > 0 && (
        <>
          <ThemeLinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '100%',
              zIndex: 9999,
            }}
          />
        </>
      )}
    </>
  )
}
