import { Box, IconButton, Stack, TextField } from '@mui/material'
import { FC, useState } from 'react'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import SendIcon from '@mui/icons-material/Send'
import {
  collection,
  doc,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { useAppSelector } from '../../../hooks/redux'

export const AddMessage: FC = () => {
  const [content, setContent] = useState('')
  const { db } = useAuth()

  const { uid, displayName, photoURL } = useAppSelector((state) => state.user)

  const handleAddMessage = async (e: any) => {
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
        await setDoc(doc(db, 'messages', idDb), {
          author: { uid, displayName, photoURL },
          content,
          createdAt: Date.now(),
          comments: [],
          likes: [],
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
    <Box sx={{ mb: 2 }}>
      <BorderBox>
        <Box sx={{ p: 3 }}>
          <Stack alignItems="center" direction="row" spacing={2}>
            <ThemeAvatar
              alt={displayName || ''}
              src={photoURL || ''}
              sx={{ width: 46, height: 46 }}
            >
              <b>{displayName?.replace(/\B\w+/g, '').split(' ').join('')}</b>
            </ThemeAvatar>
            <TextField
              label={<b>Whats's new?</b>}
              // multiline
              fullWidth
              // focused
              autoComplete="off"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleAddMessage}
            />
            <IconButton
              onClick={() => console.log('test')}
              // onClick={async () => {
              //   await deleteDoc(doc(db, 'posts', post.id))
              // }}
              color="inherit"
              // sx={{ width: '40px ', height: '40px' }}
              size="large"
            >
              <SendIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Stack>
        </Box>
      </BorderBox>
    </Box>
  )
}
