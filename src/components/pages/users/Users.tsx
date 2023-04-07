import { FC, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { Clear, PersonSearch } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeTextFieldAddPost } from '@ui/ThemeTextField'
import { SkeletonUser } from '@ui/skeletons/SkeletonUser'

import { UsersOrderBy } from './components/UsersOrderBy'
import { UserItem } from './components/UserItem'

export const Users: FC = () => {
  const { t } = useTranslation(['users'])
  document.title = t('Users')

  const { users } = useAppSelector((state) => state.users)

  const [numberVisibleUsers, setNumberVisibleUsers] = useState(9)
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter((u) =>
    u.displayName?.toLowerCase()?.includes(search?.toLowerCase())
  )

  const handleChangeSearch = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setNumberVisibleUsers(9)
    setSearch(e.target.value)
  }

  const handleClearSearch = () => {
    setNumberVisibleUsers(9)
    setSearch('')
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScroll = (e: any) => {
    const scrollHeight = e.target.documentElement.scrollHeight
    const scrollTop = e.target.documentElement.scrollTop
    const innerHeight = window.innerHeight

    if (scrollHeight - (scrollTop + innerHeight) < 100) {
      setNumberVisibleUsers((prev) => prev + 3)
    }
  }

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>{t('Users')}</b>
        </Typography>
      </BorderBox>
      <UsersOrderBy setNumberVisibleUsers={setNumberVisibleUsers} />
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <ThemeTextFieldAddPost
          label={t('Search user')}
          autoComplete="off"
          fullWidth
          value={search}
          onChange={handleChangeSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonSearch />
              </InputAdornment>
            ),
            endAdornment: search && (
              <IconButton
                aria-label="clear"
                title={t('Clear') || ''}
                onClick={handleClearSearch}
              >
                <Clear />
              </IconButton>
            ),
          }}
        />
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, mt: 3 }}>
          {users.length > 0 ? (
            <>
              {filteredUsers.slice(0, numberVisibleUsers).map((user) => (
                <UserItem user={user} key={user.uid} />
              ))}
              {numberVisibleUsers < filteredUsers.length && (
                <>
                  {[...Array(3).keys()].map((user) => (
                    <SkeletonUser key={user} />
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {[...Array(3).keys()].map((user) => (
                <SkeletonUser key={user} />
              ))}
            </>
          )}
        </Stack>
        {filteredUsers.length === 0 && users.length > 0 && (
          <Typography
            variant="h4"
            textAlign="center"
            color="textSecondary"
            sx={{ my: 4 }}
          >
            <b>{t('No users found 😞')}</b>
          </Typography>
        )}
      </BorderBox>
    </>
  )
}
