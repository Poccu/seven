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
  setBookmarksByControversial,
  setBookmarksByNewest,
  setBookmarksByOldest,
  setBookmarksByLikes,
} from '@reducers/BookmarksSlice'

type Props = {
  setNumberVisiblePosts: React.Dispatch<React.SetStateAction<number>>
}

export const BookmarksOrderBy: FC<Props> = ({ setNumberVisiblePosts }) => {
  const { t } = useTranslation(['other'])

  const { sortBookmarksBy } = useAppSelector((state) => state.bookmarks)
  const dispatch = useAppDispatch()

  const handleSortBookmarksByNewest = () => {
    setNumberVisiblePosts(4)
    dispatch(setBookmarksByNewest())
  }

  const handleSortBookmarksByOldest = () => {
    setNumberVisiblePosts(4)
    dispatch(setBookmarksByOldest())
  }

  const handleSortBookmarksByLikes = () => {
    setNumberVisiblePosts(4)
    dispatch(setBookmarksByLikes())
  }

  const handleSortBookmarksByControversial = () => {
    setNumberVisiblePosts(4)
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
        color={sortBookmarksBy === 'likes' ? 'primary' : 'default'}
        onClick={handleSortBookmarksByLikes}
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
