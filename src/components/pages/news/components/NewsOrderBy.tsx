import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Chip, Stack, Typography } from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  FavoriteBorder,
  Group,
} from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import {
  setPostsByControversial,
  setPostsByNewest,
  setPostsByOldest,
  setPostsByLikes,
} from '@reducers/PostsSlice'

type Props = {
  setNumberVisiblePosts: React.Dispatch<React.SetStateAction<number>>
}

export const NewsOrderBy: FC<Props> = ({ setNumberVisiblePosts }) => {
  const { t } = useTranslation(['other'])

  const { sortPostsBy } = useAppSelector((state) => state.posts)
  const dispatch = useAppDispatch()

  const handleSortPostsByNewest = () => {
    setNumberVisiblePosts(3)
    dispatch(setPostsByNewest())
  }

  const handleSortPostsByOldest = () => {
    setNumberVisiblePosts(3)
    dispatch(setPostsByOldest())
  }

  const handleSortPostsByLikes = () => {
    setNumberVisiblePosts(3)
    dispatch(setPostsByLikes())
  }

  const handleSortPostsByControversial = () => {
    setNumberVisiblePosts(3)
    dispatch(setPostsByControversial())
  }

  return (
    <Stack
      alignItems="center"
      direction="row"
      sx={{ flexWrap: 'wrap', gap: 2 }}
    >
      <Typography>{t('Sort by')}</Typography>
      <Chip
        label={t('Newest')}
        icon={<ExpandMore />}
        color={sortPostsBy === 'newest' ? 'primary' : 'default'}
        onClick={handleSortPostsByNewest}
      />
      <Chip
        label={t('Oldest')}
        icon={<ExpandLess />}
        color={sortPostsBy === 'oldest' ? 'primary' : 'default'}
        onClick={handleSortPostsByOldest}
      />
      <Chip
        label={t('Likes')}
        icon={<FavoriteBorder sx={{ pl: 0.6 }} />}
        color={sortPostsBy === 'likes' ? 'primary' : 'default'}
        onClick={handleSortPostsByLikes}
      />
      <Chip
        label={t('Controversial')}
        icon={<Group sx={{ pl: 0.6 }} />}
        color={sortPostsBy === 'controversial' ? 'primary' : 'default'}
        onClick={handleSortPostsByControversial}
      />
    </Stack>
  )
}
