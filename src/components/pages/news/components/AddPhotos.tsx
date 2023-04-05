import { FC, useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import { Box, IconButton } from '@mui/material'
import { AddAPhoto } from '@mui/icons-material'

import { useAuth } from '@hooks/useAuth'
import { generateUniqueId } from '@utils/generateUniqueId'
import { ThemeLinearProgress } from '@ui/ThemeLinearProgress'

type Props = {
  setImages: React.Dispatch<React.SetStateAction<string[]>>
  setImagesIdDb: React.Dispatch<React.SetStateAction<string>>
}

export const AddPhotos: FC<Props> = ({ setImages, setImagesIdDb }) => {
  const { t } = useTranslation(['other'])
  const { st } = useAuth()

  const [progress, setProgress] = useState<number>(0)

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const uniqueId = generateUniqueId()

    setImagesIdDb(uniqueId)

    if (!e.target.files) return
    const files = e.target.files
    const filesArr = Object.values(files)

    filesArr.forEach((file) => {
      const storageRef = ref(st, `images/posts/${uniqueId}/${file?.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
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
            setImages((prevImages) => [...prevImages, downloadURL])
            setProgress(0)
          })
        }
      )
    })
  }

  return (
    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
      <label htmlFor="upload-photo">
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleUpload}
          multiple
          hidden
          id="upload-photo"
          name="upload-photo"
        />
        <IconButton
          color="primary"
          component="span"
          title={t('Add Photo') || ''}
          sx={{ width: '50px ', height: '50px' }}
        >
          <AddAPhoto />
        </IconButton>
      </label>
      {progress > 0 && (
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
      )}
    </Box>
  )
}
