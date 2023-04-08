import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { deleteDoc, doc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import { Box } from '@mui/material'
import { Clear } from '@mui/icons-material'

import { useAuth } from '@hooks/useAuth'
import { ThemeButton } from '@ui/ThemeButton'
import { ThemeLinearProgress } from '@ui/ThemeLinearProgress'

import { IPost } from 'src/types/types'

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
  const { db } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [progress, setProgress] = useState(0)

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

      enqueueSnackbar(t('Post has been deleted'), { variant: 'error' })
    }, 290)
  }

  const handleCancel = () => {
    const newArr = deletedPosts.filter((x) => x.id !== post.id)
    setDeletedPosts(newArr)
  }

  return (
    <Box textAlign="center">
      <ThemeButton
        onClick={handleCancel}
        startIcon={<Clear style={{ fontSize: '30px' }} />}
      >
        <b>{t('Cancel')}</b>
      </ThemeButton>
      <ThemeLinearProgress
        variant="determinate"
        value={progress}
        sx={{ mt: 3 }}
      />
    </Box>
  )
}
