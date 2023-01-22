import { ChangeEvent, FC, useRef, useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import {
  Box,
  CircularProgress,
  LinearProgress,
  ListItemIcon,
  Typography,
} from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { Clear, Edit, Upload } from '@mui/icons-material'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { ThemeIconButton } from '../../ui/ThemeIconButton'
import { SettingsBox } from '../../ui/ThemeBox'

const PhotoSettings: FC = () => {
  const { db, cur, st } = useAuth()

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)

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

  const [progress, setProgress] = useState<number>(0)

  const handleDelete = async () => {
    setOpen(false)
    const delPhoto = ''

    updateProfile(cur, {
      photoURL: delPhoto,
    })
    // console.log('User profile updated', cur)

    const docRef = doc(db, 'users', cur.uid)
    setDoc(docRef, { photoURL: delPhoto }, { merge: true })

    setProgress(0)

    const q = query(collection(db, 'posts'), where('author.uid', '==', cur.uid))

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(async (d) => {
      // doc.data() is never undefined for query doc snapshots
      const docRef = doc(db, 'posts', d.id)
      await setDoc(docRef, { author: { photoURL: delPhoto } }, { merge: true })
      // console.log(d.id, ' => ', d.data())
    })
  }

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setOpen(false)
    e.preventDefault()

    if (e.target.files) {
      const file = e.target.files[0]

      const storageRef = ref(st, `images/${file?.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          setProgress(progress)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
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

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // console.log('File available at', downloadURL)
            updateProfile(cur, {
              photoURL: downloadURL,
            })
            // console.log('User profile updated', cur)

            const docRef = doc(db, 'users', cur.uid)
            setDoc(docRef, { photoURL: downloadURL }, { merge: true })

            setProgress(0)

            const q = query(
              collection(db, 'posts'),
              where('author.uid', '==', cur.uid)
            )

            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(async (d) => {
              // doc.data() is never undefined for query doc snapshots
              const docRef = doc(db, 'posts', d.id)
              await setDoc(
                docRef,
                { author: { photoURL: downloadURL } },
                { merge: true }
              )
              // console.log(d.id, ' => ', d.data())
            })
          })
        }
      )
    }
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
              <SettingsBox>
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
                      <Typography variant="body1">Upload photo</Typography>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleUpload}
                        hidden
                      />
                    </MenuItem>
                    {cur.photoURL && (
                      <MenuItem onClick={handleDelete}>
                        <ListItemIcon sx={{ ml: -0.5, mr: -0.5 }}>
                          <Clear color="error" />
                        </ListItemIcon>
                        <Typography variant="body1">Delete photo</Typography>
                      </MenuItem>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </SettingsBox>
            </Grow>
          )}
        </Popper>
      </Box>
      {progress > 0 && (
        <>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              // height: '30px',
              width: '100%',
              zIndex: 9999,
            }}
          />
          {/* <CircularProgress
            variant="determinate"
            value={progress}
            size="150px"
            thickness={1.2}
            sx={{
              position: 'relative',
              top: '-150px',
              left: '0px',
              mb: '-130px',
            }}
          /> */}
        </>
      )}
    </>
  )
}

export default PhotoSettings
