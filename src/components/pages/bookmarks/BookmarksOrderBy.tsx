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
import { bookmarksSlice } from '../../../store/reducers/BookmarksSlice'

export const BookmarksOrderBy: FC = () => {
  const { t } = useTranslation(['other'])

  const { sortBookmarksBy } = useAppSelector((state) => state.bookmarks)
  const {
    setBookmarksByNewest,
    setBookmarksByOldest,
    setBookmarksByPopularity,
    setBookmarksByControversial,
  } = bookmarksSlice.actions
  const dispatch = useAppDispatch()

  const handleSortBookmarksByNewest = () => {
    dispatch(setBookmarksByNewest())
  }

  const handleSortBookmarksByOldest = () => {
    dispatch(setBookmarksByOldest())
  }

  const handleSortBookmarksByPopularity = () => {
    dispatch(setBookmarksByPopularity())
  }

  const handleSortBookmarksByControversial = () => {
    dispatch(setBookmarksByControversial())
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
        color={sortBookmarksBy === 'newest' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByNewest}
      />
      <Chip
        label={t('Oldest')}
        icon={<ExpandLess />}
        color={sortBookmarksBy === 'oldest' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByOldest}
      />
      <Chip
        label={t('Likes')}
        icon={<FavoriteBorder sx={{ pl: 0.6 }} />}
        color={sortBookmarksBy === 'popularity' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByPopularity}
      />
      <Chip
        label={t('Controversial')}
        icon={<Group sx={{ pl: 0.6 }} />}
        color={sortBookmarksBy === 'controversial' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByControversial}
      />
    </Stack>
  )
}
