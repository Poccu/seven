import { FC, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material'
import {
  Clear,
  PersonAddAlt1,
  PersonSearch,
  ViewList,
  ViewModule,
} from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useHandleScroll } from '@hooks/useHandleScroll'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeSmallButton } from '@ui/ThemeButton'
import { ThemeTextFieldAddPost } from '@ui/ThemeTextField'
import { SkeletonUserList } from '@ui/skeletons/SkeletonUserList'
import { SkeletonUser } from '@ui/skeletons/SkeletonUser'

import { UserItemFriendList } from './components/UserItemFriendList'
import { UserItemFriend } from './components/UserItemFriend'

export const Friends: FC = () => {
  const { t } = useTranslation(['friends'])
  const navigate = useNavigate()
  document.title = t('Friends')

  const { friends } = useAppSelector((state) => state.user)
  const { users } = useAppSelector((state) => state.users)

  const {
    setNumberVisiblePosts: setNumberVisibleUsers,
    numberVisiblePosts: numberVisibleUsers,
  } = useHandleScroll(9, 3)
  const [search, setSearch] = useState('')
  const [format, setFormat] = useState('module')

  const filteredFriends = friends?.filter((u) =>
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

  return (
    <>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" textAlign="center">
          <b>{t('Friends')}</b>
        </Typography>
      </BorderBox>
      <BorderBox sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ThemeTextFieldAddPost
            label={t('Search friend', { ns: ['users'] })}
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
                  title={t('Clear', { ns: ['users'] }) || ''}
                  onClick={handleClearSearch}
                >
                  <Clear />
                </IconButton>
              ),
            }}
          />
          <Stack
            direction="row"
            sx={{ height: 40, display: { xs: 'none', lg: 'flex' } }}
          >
            <IconButton
              title={t('Display list', { ns: ['users'] }) || ''}
              onClick={() => setFormat('list')}
              color={format === 'list' ? 'primary' : 'secondary'}
            >
              <ViewList />
            </IconButton>
            <Divider
              flexItem
              orientation="vertical"
              sx={{ mx: 0.5, my: 0.7 }}
            />
            <IconButton
              title={t('Display block', { ns: ['users'] }) || ''}
              onClick={() => setFormat('module')}
              color={format === 'module' ? 'primary' : 'secondary'}
            >
              <ViewModule />
            </IconButton>
          </Stack>
        </Stack>
        {format === 'module' ? (
          <Stack
            direction="row"
            sx={{
              display: { xs: 'none', lg: 'flex' },
              flexWrap: 'wrap',
              gap: 2,
              mt: 3,
            }}
          >
            {users.length > 0 && filteredFriends ? (
              <>
                {filteredFriends.slice(0, numberVisibleUsers).map((user) => (
                  <UserItemFriend user={user} key={user.uid} />
                ))}
                {numberVisibleUsers < filteredFriends.length && (
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
            {users.length > 0 && filteredFriends ? (
              <>
                {filteredFriends.slice(0, numberVisibleUsers).map((user) => (
                  <UserItemFriendList user={user} key={user.uid} />
                ))}
                {numberVisibleUsers < filteredFriends.length && (
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
          {users.length > 0 && filteredFriends ? (
            <>
              {filteredFriends.slice(0, numberVisibleUsers).map((user) => (
                <UserItemFriendList user={user} key={user.uid} />
              ))}
              {numberVisibleUsers < filteredFriends.length && (
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
        {users.length > 0 && friends?.length === 0 && (
          <Stack alignItems="center">
            <Typography
              variant="h4"
              textAlign="center"
              color="textSecondary"
              sx={{ my: 4 }}
            >
              <b>{t('No friends yet 😞')}</b>
            </Typography>
            <ThemeSmallButton
              onClick={() => navigate('/users')}
              startIcon={<PersonAddAlt1 />}
            >
              <b>{t('Add friends', { ns: ['profile'] })}</b>
            </ThemeSmallButton>
          </Stack>
        )}
        {friends?.length !== 0 &&
          filteredFriends?.length === 0 &&
          users.length > 0 && (
            <Typography
              variant="h4"
              textAlign="center"
              color="textSecondary"
              sx={{ my: 4 }}
            >
              <b>{t('No friends found 😞', { ns: ['users'] })}</b>
            </Typography>
          )}
      </BorderBox>
    </>
  )
}
