import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { doc, runTransaction } from 'firebase/firestore'

import { Box, Stack } from '@mui/material'
import { Check, Clear } from '@mui/icons-material'

import { useAuth } from '@hooks/useAuth'
import { moveFocusAtEnd } from '@utils/moveFocusAtEnd'
import { ThemeTextFieldAddPost } from '@ui/ThemeTextField'
import { ThemeSmallButton } from '@ui/ThemeButton'

import { IComment, IPost } from 'src/types/types'
import { AddEmoji } from './AddEmoji'

type Props = {
  post: IPost
  comment: IComment
  setEditingId: React.Dispatch<React.SetStateAction<string>>
}

export const EditComment: FC<Props> = ({ post, comment, setEditingId }) => {
  const { t } = useTranslation(['news'])
  const { db } = useAuth()

  const [content, setContent] = useState(comment.content)

  const handleEditComment = async (post: IPost, comment: IComment) => {
    if (!content.trim()) return
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const com: IComment = sfDoc
          .data()
          .comments.find((x: IComment) => x.id === comment.id)
        com.content = content.trim()

        const newCommentsArr = [
          ...sfDoc.data().comments.filter((x: IComment) => x.id !== comment.id),
          com,
        ].sort((a, b) => +a.createdAt - +b.createdAt)

        transaction.update(docRef, {
          comments: newCommentsArr,
        })
      })
      setEditingId('')
    } catch (e) {
      console.log('Edit comment failed: ', e)
    }
  }

  return (
    <Box sx={{ my: 2 }}>
      <Stack direction="column" spacing={2}>
        <Stack alignItems="center" direction="row">
          <ThemeTextFieldAddPost
            label={<b>{t('Edit comment')}</b>}
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
          <ThemeSmallButton
            startIcon={<Check />}
            onClick={() => handleEditComment(post, comment)}
          >
            {t('Save')}
          </ThemeSmallButton>
        </Stack>
      </Stack>
    </Box>
  )
}
