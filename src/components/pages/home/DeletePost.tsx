import { FC, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useAuth } from '../../providers/useAuth'
import { IPost } from '../../../types'
import { deleteDoc, doc } from 'firebase/firestore'
import { ThemeButton } from '../../ui/ThemeButton'
import { Clear } from '@mui/icons-material'
import { ThemeLinearProgress } from '../../ui/ThemeLinearProgress'

type Props = {
  post: IPost
  deletedPosts: IPost[]
  setDeletedPosts: React.Dispatch<React.SetStateAction<IPost[]>>
}

const DeletePost: FC<Props> = ({ post, deletedPosts, setDeletedPosts }) => {
  const [progress, setProgress] = useState(0)
  // +deletedPosts?.find((x) => x?.id == post.id)?.progress
  const { db } = useAuth()

  useEffect(() => {
    // setProgress(0)
    // setDeletedPosts((prevDeletedPosts) => [...prevDeletedPosts, post])

    const interval = setInterval(
      () => setProgress((prevProgress: number) => prevProgress + 10),
      300
      // prevProgress >= 100 ? 0 : prevProgress + 10
    )
    // console.log('interval')

    // const timeout = setTimeout(() => {
    //   // setProgress(0)
    //   deleteDoc(doc(db, 'posts', post.id))
    //   console.log('TIMEOUT DELETED', post.id)
    // }, 3200)

    return () => {
      clearInterval(interval)
      // clearTimeout(timeout)
    }
  }, [])

  if (progress === 100) {
    const timeout = setTimeout(() => {
      deleteDoc(doc(db, 'posts', post.id))
      // console.log('TIMEOUT DELETED', post.id)
    }, 290)
  }

  // console.log('RENDER')

  // let timeout = setTimeout(() => {
  //   setProgress(0)
  //   deleteDoc(doc(db, 'posts', post.id))
  //   console.log('TIMEOUT DELETED')
  //   // clearTimeout(timeout)
  // }, 3000)

  const handleUndo = () => {
    let newArr = deletedPosts.filter((x) => x.id !== post.id)
    setDeletedPosts(newArr)
    // clearTimeout(timeout)
  }

  return (
    <Box textAlign="center">
      <ThemeButton
        onClick={handleUndo}
        startIcon={<Clear style={{ fontSize: '30px' }} />}
      >
        <b>Undo</b>
      </ThemeButton>
      <ThemeLinearProgress
        variant="determinate"
        value={progress}
        sx={{ mt: 3 }}
      />
    </Box>
  )
}

export default DeletePost
