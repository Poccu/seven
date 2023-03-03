import { FC, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { IComment, IPost } from '../../../types'
import { doc, runTransaction } from 'firebase/firestore'
import { ThemeTextFieldAddPost } from '../../ui/ThemeTextField'
import { useTranslation } from 'react-i18next'
import { AddEmoji } from './AddEmoji'

type Props = {
  post: IPost
  comment: IComment
  setEditingId: React.Dispatch<React.SetStateAction<string>>
}

export const EditComment: FC<Props> = ({ post, comment, setEditingId }) => {
  const { t } = useTranslation(['news'])
  const [content, setContent] = useState(comment.content)
  const { db } = useAuth()

  const handleEditComment = async (post: IPost, comment: IComment) => {
    if (content.trim()) {
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
            ...sfDoc
              .data()
              .comments.filter((x: IComment) => x.id !== comment.id),
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
  }

  const moveFocusAtEnd = (e: any) => {
    let temp_value = e.target.value
    e.target.value = ''
    e.target.value = temp_value
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Stack alignItems="center" direction="row">
        <ThemeTextFieldAddPost
          label={<b>{t('line11')}</b>}
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
        {t('button2')}
      </Button>
      <Button onClick={() => handleEditComment(post, comment)}>
        {t('button3')}
      </Button>
    </Box>
  )
}
