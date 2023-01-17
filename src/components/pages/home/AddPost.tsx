import { Avatar, Box, Stack, TextField } from '@mui/material'
import { FC, useState } from 'react'
import { IPost, TypeSetState } from '../../../types'
import { useAuth } from '../../providers/useAuth'
import BorderBox from '../../ui/BorderBox'
import { collection, addDoc } from 'firebase/firestore'

type Props = {
  // setPosts: any
}

interface IAddPost {
  setPosts: TypeSetState<IPost[]>
}

const AddPost: FC<IAddPost> = (
  // { setPosts }
  {}: Props
) => {
  const [content, setContent] = useState('')
  const { user, db } = useAuth()

  const addPostHandler = async (e: any) => {
    if (e.key === 'Enter') {
      try {
        await addDoc(collection(db, 'posts'), {
          author: user,
          content,
          createdAt: Date.now(),
        })
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
          <Stack
            // alignItems="center"
            direction="row"
            spacing={2}
          >
            <Box sx={{ mt: 0.6 }}>
              <Avatar
                alt={user?.name}
                src={user?.avatar}
                sx={{ width: 46, height: 46 }}
              >
                <b>{user?.name.replace(/\B\w+/g, '').split(' ').join('')}</b>
              </Avatar>
            </Box>
            <TextField
              id="outlined-textarea"
              label={<b>Whats's new?</b>}
              // placeholder="Placeholder"
              // multiline
              fullWidth
              color="info"
              focused
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={addPostHandler}
            />
          </Stack>
        </Box>
      </BorderBox>
    </Box>
  )
}

export default AddPost
