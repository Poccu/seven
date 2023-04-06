import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Chip, Stack, Typography } from '@mui/material'
import { Diversity3, ExpandLess, ExpandMore } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import {
  setUsersByNewest,
  setUsersByOldest,
  setUsersByPopularity,
} from '@reducers/UsersSlice'

type Props = {
  setNumberVisibleUsers: React.Dispatch<React.SetStateAction<number>>
}

export const UsersOrderBy: FC<Props> = ({ setNumberVisibleUsers }) => {
  const { t } = useTranslation(['other'])

  const { sortUsersBy } = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()

  const handleSortUsersByNewest = () => {
    setNumberVisibleUsers(9)
    dispatch(setUsersByNewest())
  }

  const handleSortUsersByOldest = () => {
    setNumberVisibleUsers(9)
    dispatch(setUsersByOldest())
  }

  const handleSortUsersByPopularity = () => {
    setNumberVisibleUsers(9)
    dispatch(setUsersByPopularity())
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
        color={sortUsersBy === 'newest' ? 'primary' : 'default'}
        onClick={handleSortUsersByNewest}
      />
      <Chip
        label={t('Oldest')}
        icon={<ExpandLess />}
        color={sortUsersBy === 'oldest' ? 'primary' : 'default'}
        onClick={handleSortUsersByOldest}
      />
      <Chip
        label={t('Popularity')}
        icon={<Diversity3 sx={{ pl: 0.6 }} />}
        color={sortUsersBy === 'popularity' ? 'primary' : 'default'}
        onClick={handleSortUsersByPopularity}
      />
    </Stack>
  )
}
