import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { doc, setDoc } from 'firebase/firestore'

import { Stack } from '@mui/material'
import { Clear, Check } from '@mui/icons-material'

import { useAuth } from '@hooks/useAuth'
import { moveFocusAtEnd } from '@utils/moveFocusAtEnd'
import { ThemeTextFieldAddPost } from '@ui/ThemeTextField'
import { ThemeSmallButton } from '@ui/ThemeButton'

import { IPost } from 'src/types/types'
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

  return (
    <Stack direction="column" spacing={2}>
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
      <Stack direction="row" spacing={2}>
        <ThemeSmallButton
          startIcon={<Clear />}
          onClick={() => {
            setEditingId('')
          }}
        >
          {t('Cancel')}
        </ThemeSmallButton>
        <ThemeSmallButton startIcon={<Check />} onClick={handleEditPost}>
          {t('Save')}
        </ThemeSmallButton>
      </Stack>
    </Stack>
  )
}
