import { FC } from 'react'
import { Chip, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  ExpandLess,
  ExpandMore,
  FavoriteBorder,
  Group,
} from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { postsSlice } from '../../../store/reducers/PostsSlice'

export const PostsOrderBy: FC = () => {
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
      <Typography>{t('title5')}</Typography>
      <Chip
        label={t('title6')}
        icon={<ExpandMore />}
        color={sortPostsBy === 'newest' ? 'primary' : 'default'}
        onClick={handleSortPostsByNewest}
      />
      <Chip
        label={t('title7')}
        icon={<ExpandLess />}
        color={sortPostsBy === 'oldest' ? 'primary' : 'default'}
        onClick={handleSortPostsByOldest}
      />
      <Chip
        label={t('title8')}
        icon={<FavoriteBorder sx={{ pl: 0.6 }} />}
        color={sortPostsBy === 'popularity' ? 'primary' : 'default'}
        onClick={handleSortPostsByPopularity}
      />
      <Chip
        label={t('title9')}
        icon={<Group sx={{ pl: 0.6 }} />}
        color={sortPostsBy === 'controversial' ? 'primary' : 'default'}
        onClick={handleSortPostsByControversial}
      />
    </Stack>
  )
}
