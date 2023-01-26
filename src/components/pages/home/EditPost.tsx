import { FC, useState } from 'react'
import { Box, Button } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { IPost } from '../../../types'
import { doc, setDoc } from 'firebase/firestore'
import { ThemeTextFieldAddPost } from '../../ui/ThemeTextField'

type Props = {
  post: IPost
  setEditingId: React.Dispatch<React.SetStateAction<string>>
}

const moveFocusAtEnd = (e: any) => {
  let temp_value = e.target.value
  e.target.value = ''
  e.target.value = temp_value
}

const EditPost: FC<Props> = ({ post, setEditingId }) => {
  const [content, setContent] = useState(post.content)
  const { db } = useAuth()

  const editPostHandler = async () => {
    if (content.trim()) {
      const docRef = doc(db, 'posts', post.id)
      setDoc(docRef, { content: content }, { merge: true })
      setEditingId('')
    }
  }
  return (
    <Box>
      <ThemeTextFieldAddPost
        label={<b>Edit post</b>}
        multiline
        fullWidth
        color="secondary"
        focused
        autoFocus
        autoComplete="off"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={moveFocusAtEnd}
      />
      <Button
        onClick={() => {
          setEditingId('')
        }}
      >
        Cancel
      </Button>
      <Button onClick={editPostHandler}>Save</Button>
    </Box>
  )
}

export default EditPost
