import { FC, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { BorderBox } from '../../ui/ThemeBox'
import { doc, setDoc } from 'firebase/firestore'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { ThemeTextFieldAddPost } from '../../ui/ThemeTextField'
import { Link } from 'react-router-dom'

const AddPost: FC = () => {
  const [content, setContent] = useState('')
  const { db, cur } = useAuth()

  const addPostHandler = async (e: any) => {
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
          },
          content,
          createdAt: Date.now(),
          comments: [],
          likes: [],
          bookmarks: [],
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
          <ThemeAvatar alt={cur?.displayName} src={cur.photoURL}>
            {cur?.displayName?.match(/[\p{Emoji}\u200d]+/gu)}
          </ThemeAvatar>
        </Link>
        <ThemeTextFieldAddPost
          label={<b>Whats's new?</b>}
          // multiline
          fullWidth
          // focused
          autoComplete="off"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={addPostHandler}
        />
      </Stack>
    </BorderBox>
  )
}

export default AddPost
