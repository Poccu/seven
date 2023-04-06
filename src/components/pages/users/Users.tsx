import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton, Stack, Typography } from '@mui/material'

import { useAppSelector } from '@hooks/redux'
import { BorderBox } from '@ui/ThemeBox'

import { UsersOrderBy } from './components/UsersOrderBy'
import { UserItem } from './components/UserItem'

export const Users: FC = () => {
  const { t } = useTranslation(['users'])
  document.title = t('Users')

  const { users } = useAppSelector((state) => state.users)

  const [numberVisibleUsers, setNumberVisibleUsers] = useState(9)

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
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
          {users.length > 0 ? (
            <>
              {users.slice(0, numberVisibleUsers).map((user) => (
                <UserItem user={user} key={user.uid} />
              ))}
              {numberVisibleUsers < users.length && (
                <>
                  {[...Array(3).keys()].map((user) => (
                    <Stack direction="column" key={user}>
                      <Skeleton
                        sx={{ height: '258px', width: '258px' }}
                        draggable="false"
                        variant="rounded"
                      />
                      <Typography sx={{ mt: 0.5 }}>
                        <Skeleton />
                      </Typography>
                      <Typography variant="body2">
                        <Skeleton />
                      </Typography>
                    </Stack>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {[...Array(3).keys()].map((user) => (
                <Stack direction="column" key={user}>
                  <Skeleton
                    sx={{ height: '258px', width: '258px' }}
                    draggable="false"
                    variant="rounded"
                  />
                  <Typography sx={{ mt: 0.5 }}>
                    <Skeleton />
                  </Typography>
                  <Typography variant="body2">
                    <Skeleton />
                  </Typography>
                </Stack>
              ))}
            </>
          )}
        </Stack>
      </BorderBox>
    </>
  )
}
