import { FC, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { useAuth } from '@providers/useAuth'
import { IPost } from 'src/types'
import { doc, setDoc } from 'firebase/firestore'
import { ThemeTextFieldAddPost } from '@ui/ThemeTextField'
import { useTranslation } from 'react-i18next'
import { AddEmoji } from './AddEmoji'

type Props = {
  post: IPost
  setEditingId: React.Dispatch<React.SetStateAction<string>>
}

export const EditPost: FC<Props> = ({ post, setEditingId }) => {
  const { t } = useTranslation(['news'])

  const { db } = useAuth()

  const [content, setContent] = useState(post.content)

  const handleEditPost = async () => {
    if (content.trim() || post.images.length > 0) {
      const docRef = doc(db, 'posts', post.id)
      setDoc(docRef, { content: content.trim() }, { merge: true })
      setEditingId('')
    }
  }

  const moveFocusAtEnd = (e: any) => {
    let temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }

  return (
    <Box>
      <Stack alignItems="center" direction="row">
        <ThemeTextFieldAddPost
          label={<b>{t('Edit post')}</b>}
          multiline
          fullWidth
          color="secondary"
          focused
          autoFocus
          autoComplete="off"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={moveFocusAtEnd}
          sx={{ mr: 2 }}
        />
        <AddEmoji setContent={setContent} />
      </Stack>
      <Button
        onClick={() => {
          setEditingId('')
        }}
      >
        {t('Cancel')}
      </Button>
      <Button onClick={handleEditPost}>{t('Save')}</Button>
    </Box>
  )
}
