import { FC } from 'react'
import { Chip, Stack, Typography } from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  FavoriteBorder,
  Group,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { postsSlice } from '@reducers/PostsSlice'

export const NewsOrderBy: FC = () => {
  const { t } = useTranslation(['other'])

  const { sortPostsBy } = useAppSelector((state) => state.posts)
  const {
    setPostsByNewest,
    setPostsByOldest,
    setPostsByPopularity,
    setPostsByControversial,
  } = postsSlice.actions
  const dispatch = useAppDispatch()

  const handleSortPostsByNewest = () => {
    dispatch(setPostsByNewest())
  }

  const handleSortPostsByOldest = () => {
    dispatch(setPostsByOldest())
  }

  const handleSortPostsByPopularity = () => {
    dispatch(setPostsByPopularity())
  }

  const handleSortPostsByControversial = () => {
    dispatch(setPostsByControversial())
  }

  return (
    <Stack
      alignItems="center"
      direction="row"
      sx={{ ml: 2, mb: 2, flexWrap: 'wrap', gap: 2 }}
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
        color={sortPostsBy === 'popularity' ? 'primary' : 'default'}
        onClick={handleSortPostsByPopularity}
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
