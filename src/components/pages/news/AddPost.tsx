import { FC, useState } from 'react'
import { Box, IconButton, Stack } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { doc, setDoc } from 'firebase/firestore'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { ThemeTextFieldAddPost } from '../../ui/ThemeTextField'
import { Link } from 'react-router-dom'
import { AddPhotos } from './AddPhotos'
import { useTranslation } from 'react-i18next'
import { Clear, Send } from '@mui/icons-material'
import { AddEmoji } from './AddEmoji'
import { useAppSelector } from '../../../hooks/redux'

export const AddPost: FC = () => {
  const { t } = useTranslation(['news'])
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [imagesIdDb, setImagesIdDb] = useState<string>('')
  const { db } = useAuth()

  const { emoji, uid, displayName, photoURL } = useAppSelector(
    (state) => state.user
  )

  const handleAddPost = async (e: any) => {
    if (e.key === 'Enter' && content.trim()) {
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

      try {
        await setDoc(doc(db, 'posts', imagesIdDb || idDb), {
          author: { uid, displayName, photoURL, emoji },
          content: content.trim(),
          createdAt: Date.now(),
          comments: [],
          likes: [],
          bookmarks: [],
          images,
          views: 0,
          id: imagesIdDb || idDb,
        })
        setContent('')
      } catch (e) {
        console.error('Error adding document: ', e)
      }
      setContent('')
      setImagesIdDb('')
      setImages([])
      e.target.blur()
    }
  }

  const handleSendPost = async (e: any) => {
    if (content.trim()) {
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

      try {
        await setDoc(doc(db, 'posts', imagesIdDb || idDb), {
          author: { uid, displayName, photoURL, emoji },
          content: content.trim(),
          createdAt: Date.now(),
          comments: [],
          likes: [],
          bookmarks: [],
          images,
          views: 0,
          id: imagesIdDb || idDb,
        })
        setContent('')
      } catch (e) {
        console.error('Error adding document: ', e)
      }
      setContent('')
      setImagesIdDb('')
      setImages([])
      e.target.blur()
    }
  }

  const handleDeleteImage = (image: string) => {
    const newImagesArr = images.filter((x) => x !== image)
    setImages(newImagesArr)
  }

  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Stack alignItems="center" direction="row">
        <Link to={`/profile/${uid}`}>
          <ThemeAvatar alt={displayName || ''} src={photoURL || ''}>
            {emoji}
          </ThemeAvatar>
        </Link>
        <ThemeTextFieldAddPost
          label={<b>{t('line1')}</b>}
          multiline
          fullWidth
          autoComplete="off"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleAddPost}
          sx={{ mx: 2 }}
        />
        <AddEmoji setContent={setContent} />
        <AddPhotos setImages={setImages} setImagesIdDb={setImagesIdDb} />
        <IconButton
          color="primary"
          onClick={handleSendPost}
          sx={{ width: '50px ', height: '50px', mx: -1 }}
        >
          <Send />
        </IconButton>
      </Stack>
      {images.length > 0 && (
        <Stack direction="row" sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
          {images.map((image) => (
            <Stack direction="row" key={image}>
              <Box sx={{ width: '78px', height: '78px' }}>
                <img
                  src={image}
                  alt={image}
                  height="78px"
                  width="78px"
                  draggable={false}
                  className="cover"
                />
              </Box>
              <IconButton
                onClick={() => handleDeleteImage(image)}
                color="secondary"
                sx={{ height: '30px', width: '30px', mt: -1 }}
              >
                <Clear sx={{ height: '20px', width: '20px' }} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}
    </BorderBox>
  )
}
