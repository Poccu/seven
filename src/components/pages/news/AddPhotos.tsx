import { Box, IconButton } from '@mui/material'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { ChangeEvent, FC, useState } from 'react'
import { useAuth } from '../../providers/useAuth'
import { AddAPhoto } from '@mui/icons-material'
import { ThemeLinearProgress } from '../../ui/ThemeLinearProgress'

type Props = {
  setImages: React.Dispatch<React.SetStateAction<string[]>>
  setImagesIdDb: React.Dispatch<React.SetStateAction<string>>
}

export const AddPhotos: FC<Props> = ({ setImages, setImagesIdDb }) => {
  const { st } = useAuth()

  const [progress, setProgress] = useState<number>(0)

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    let charList =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

    let idDb = ''

    if (charList) {
      let x = 20
      while (x > 0) {
        let index = Math.floor(Math.random() * charList.length) // pick random index from charList
        idDb += charList[index]
        x--
      }
    }

    setImagesIdDb(idDb)

    if (e.target.files) {
      const files = e.target.files
      const filesArr = Object.values(files)

      filesArr.forEach((file) => {
        const storageRef = ref(st, `images/posts/${idDb}/${file?.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            // console.log('Upload is ' + progress + '% done')
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

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                // console.log('File available at', downloadURL)
                setImages((prevImages) => [...prevImages, downloadURL])
                setProgress(0)
              }
            )
          }
        )
      })
    }
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
