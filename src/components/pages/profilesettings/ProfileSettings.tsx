import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useSnackbar } from 'notistack'

import { Box, Stack, Typography } from '@mui/material'
import { Check, Clear } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { useAuth } from '@hooks/useAuth'
import { moveFocusAtEnd } from '@utils/moveFocusAtEnd'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeProfileAvatar } from '@ui/ThemeAvatar'
import { ThemeTextFieldAddPost } from '@ui/ThemeTextField'
import { ThemeSmallButton } from '@ui/ThemeButton'

import { PhotoMenu } from './components/PhotoMenu'

export const ProfileSettings: FC = () => {
  const { t } = useTranslation(['settings'])
  const { db, ga } = useAuth()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  document.title = t('Settings')

  const { uid, displayName, photoURL, emoji } = useAppSelector(
    (state) => state.user
  )

  const [userName, setUserName] = useState<string>(displayName || '')

  const handleUpdateProfile = async () => {
    if (!uid || !ga.currentUser) return
    if (userName.trim().length === 0) {
      enqueueSnackbar(t('Enter at least one character'), { variant: 'error' })
      return
    }

    await updateProfile(ga.currentUser, { displayName: userName.trim() })

    const docRef = doc(db, 'users', uid)
    await setDoc(docRef, { displayName: userName.trim() }, { merge: true })

    enqueueSnackbar(t('Profile has been updated'), { variant: 'success' })
    navigate(`/profile/${uid}`)
  }

  const handleCancel = () => {
    navigate(`/profile/${uid}`)
  }

  return (
    <BorderBox sx={{ p: 3, mb: 2 }}>
      <Stack alignItems="center" spacing={3}>
        <Box>
          <ThemeProfileAvatar
            alt={displayName || ''}
            src={photoURL || ''}
            draggable={false}
          >
            <Typography variant="h2">{emoji}</Typography>
          </ThemeProfileAvatar>
          <PhotoMenu />
        </Box>
        <ThemeTextFieldAddPost
          label={<b>{t('Name')}</b>}
          fullWidth
          autoComplete="off"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onFocus={moveFocusAtEnd}
          sx={{ maxWidth: '400px' }}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <ThemeSmallButton startIcon={<Clear />} onClick={handleCancel}>
            {t('Cancel')}
          </ThemeSmallButton>
          <ThemeSmallButton startIcon={<Check />} onClick={handleUpdateProfile}>
            {t('Save')}
          </ThemeSmallButton>
        </Stack>
      </Stack>
    </BorderBox>
  )
}
