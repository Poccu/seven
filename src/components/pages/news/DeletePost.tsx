import { FC, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useAuth } from '@providers/useAuth'
import { IPost } from 'src/types'
import { deleteDoc, doc } from 'firebase/firestore'
import { ThemeButton } from '@ui/ThemeButton'
import { Clear } from '@mui/icons-material'
import { ThemeLinearProgress } from '@ui/ThemeLinearProgress'
import { useTranslation } from 'react-i18next'

type Props = {
  post: IPost
  deletedPosts: IPost[]
  setDeletedPosts: React.Dispatch<React.SetStateAction<IPost[]>>
}

export const DeletePost: FC<Props> = ({
  post,
  deletedPosts,
  setDeletedPosts,
}) => {
  const { t } = useTranslation(['news'])

  const [progress, setProgress] = useState(0)

  const { db } = useAuth()

  useEffect(() => {
    const interval = setInterval(
      () => setProgress((prevProgress: number) => prevProgress + 10),
      300
    )

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (progress === 100) {
    setTimeout(() => {
      deleteDoc(doc(db, 'posts', post.id))
    }, 290)
  }

  const handleUndo = () => {
    let newArr = deletedPosts.filter((x) => x.id !== post.id)
    setDeletedPosts(newArr)
  }

  return (
    <Box textAlign="center">
      <ThemeButton
        onClick={handleUndo}
        startIcon={<Clear style={{ fontSize: '30px' }} />}
      >
        <b>{t('Undo')}</b>
      </ThemeButton>
      <ThemeLinearProgress
        variant="determinate"
        value={progress}
        sx={{ mt: 3 }}
      />
    </Box>
  )
}
