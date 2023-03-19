import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { doc, runTransaction } from 'firebase/firestore'

import { Divider, IconButton, Stack } from '@mui/material'
import { Send } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@providers/useAuth'
import { ThemeAvatar } from '@ui/ThemeAvatar'
import { ThemeTextFieldAddComment } from '@ui/ThemeTextField'

import { IPost } from 'src/types'
import { AddEmoji } from './AddEmoji'

type Props = {
  post: IPost
}

export const AddComment: FC<Props> = ({ post }) => {
  const { t } = useTranslation(['news'])

  const [content, setContent] = useState('')
  const { db } = useAuth()

  const { emoji, uid, displayName, photoURL } = useAppSelector(
    (state) => state.user
  )

  const handleSendComment = async (e: any) => {
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

      const docRef = doc(db, 'posts', post.id)

      try {
        await runTransaction(db, async (transaction) => {
          const sfDoc = await transaction.get(docRef)

          if (!sfDoc.exists()) {
            throw new Error('Document does not exist!')
          }

          const newCommentsArr = [
            ...sfDoc.data().comments,
            {
              author: { uid, displayName, photoURL, emoji },
              content: content.trim(),
              createdAt: Date.now(),
              images: [],
              likes: [],
              id: idDb,
            },
          ]

          transaction.update(docRef, {
            comments: newCommentsArr,
          })
        })
      } catch (e) {
        console.log('Comments Add failed: ', e)
      }
      setContent('')
      e.target.blur()
    }
  }

  return (
    <>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Stack alignItems="center" direction="row">
        <Link to={`/profile/${uid}`}>
          <ThemeAvatar alt={displayName || ''} src={photoURL || ''}>
            {emoji}
          </ThemeAvatar>
        </Link>
        <ThemeTextFieldAddComment
          label={t('Leave a comment…')}
          multiline
          fullWidth
          autoComplete="off"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mx: 2 }}
        />
        <AddEmoji setContent={setContent} />
        <IconButton
          color="primary"
          onClick={handleSendComment}
          title={t('Post', { ns: ['other'] }) || ''}
          sx={{
            width: '50px ',
            height: '50px',
            ml: { xs: -1, sm: 0 },
            mr: -1,
          }}
        >
          <Send />
        </IconButton>
      </Stack>
    </>
  )
}
