import { FC, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material'
import { Clear, PersonSearch, ViewList, ViewModule } from '@mui/icons-material'

import { useAppDispatch, useAppSelector } from '@hooks/redux'
import { useHandleScroll } from '@hooks/useHandleScroll'
import { setFormatList, setFormatBlock } from '@reducers/GlobalSlice'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeTextFieldAddPost } from '@ui/ThemeTextField'
import { SkeletonUser } from '@ui/skeletons/SkeletonUser'
import { SkeletonUserList } from '@ui/skeletons/SkeletonUserList'

import { UsersOrderBy } from './components/UsersOrderBy'
import { UserItem } from './components/UserItem'
import { UserItemList } from './components/UserItemList'

export const Users: FC = () => {
  const { t } = useTranslation(['users'])
  document.title = t('Users')

  const { format } = useAppSelector((state) => state.global)
  const { users } = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()

  const {
    setNumberVisiblePosts: setNumberVisibleUsers,
    numberVisiblePosts: numberVisibleUsers,
  } = useHandleScroll(9, 3)

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

  const handleSetFormatList = () => {
    dispatch(setFormatList())
  }

  const handleSetFormatBlock = () => {
    dispatch(setFormatBlock())
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
        <Stack direction="row" alignItems="center" spacing={1}>
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
          <Stack
            direction="row"
            sx={{ height: 50, display: { xs: 'none', lg: 'flex' } }}
          >
            <IconButton
              title={t('Display list') || ''}
              onClick={handleSetFormatList}
              color={format === 'list' ? 'primary' : 'secondary'}
              sx={{ width: '50px ', height: '50px' }}
            >
              <ViewList />
            </IconButton>
            <Divider
              flexItem
              orientation="vertical"
              sx={{ mx: 0.5, my: 0.7 }}
            />
            <IconButton
              title={t('Display block') || ''}
              onClick={handleSetFormatBlock}
              color={format === 'block' ? 'primary' : 'secondary'}
              sx={{ width: '50px ', height: '50px' }}
            >
              <ViewModule />
            </IconButton>
          </Stack>
        </Stack>
        {format === 'block' ? (
          <Stack
            direction="row"
            sx={{
              display: { xs: 'none', lg: 'flex' },
              flexWrap: 'wrap',
              gap: 2,
              mt: 3,
            }}
          >
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
        ) : (
          <Stack
            spacing={2}
            sx={{ mt: 3, display: { xs: 'none', lg: 'flex' } }}
          >
            {users.length > 0 ? (
              <>
                {filteredUsers.slice(0, numberVisibleUsers).map((user) => (
                  <UserItemList user={user} key={user.uid} />
                ))}
                {numberVisibleUsers < filteredUsers.length && (
                  <>
                    {[...Array(3).keys()].map((user) => (
                      <SkeletonUserList key={user} />
                    ))}
                  </>
                )}
              </>
            ) : (
              <>
                {[...Array(3).keys()].map((user) => (
                  <SkeletonUserList key={user} />
                ))}
              </>
            )}
          </Stack>
        )}
        <Stack spacing={2} sx={{ mt: 3, display: { xs: 'flex', lg: 'none' } }}>
          {users.length > 0 ? (
            <>
              {filteredUsers.slice(0, numberVisibleUsers).map((user) => (
                <UserItemList user={user} key={user.uid} />
              ))}
              {numberVisibleUsers < filteredUsers.length && (
                <>
                  {[...Array(3).keys()].map((user) => (
                    <SkeletonUserList key={user} />
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {[...Array(3).keys()].map((user) => (
                <SkeletonUserList key={user} />
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
