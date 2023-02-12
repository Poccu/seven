import { FC, useState } from 'react'
import { Stack } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { doc, setDoc } from 'firebase/firestore'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { ThemeTextFieldAddPost } from '../../ui/ThemeTextField'
import { Link } from 'react-router-dom'
// import AddPhotos from './AddPhotos'
import { useTranslation } from 'react-i18next'

const AddPost: FC = () => {
  const { t } = useTranslation(['news'])
  const [content, setContent] = useState('')
  const { db, cur, user } = useAuth()

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
        await setDoc(doc(db, 'posts', idDb), {
          author: {
            uid: cur.uid,
            displayName: cur.displayName,
            photoURL: cur.photoURL,
            emoji: user?.emoji,
          },
          content,
          createdAt: Date.now(),
          comments: [],
          likes: [],
          bookmarks: [],
          images: [],
          views: 0,
          id: idDb,
        })
        setContent('')
      } catch (e) {
        console.error('Error adding document: ', e)
      }
      setContent('')
      e.target.blur()
    }
  }

  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Link to={`/profile/${cur.uid}`}>
          <ThemeAvatar alt={cur.displayName} src={cur.photoURL}>
            {user?.emoji}
          </ThemeAvatar>
        </Link>
        <ThemeTextFieldAddPost
          label={<b>{t('line1')}</b>}
          // multiline
          fullWidth
          // focused
          autoComplete="off"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleAddPost}
        />
        {/* <AddPhotos /> */}
      </Stack>
    </BorderBox>
  )
}

export default AddPost
