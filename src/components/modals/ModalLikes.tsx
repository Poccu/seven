import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Box, IconButton, Modal, Stack, Typography } from '@mui/material'
import { Clear, Favorite } from '@mui/icons-material'

import { useAppSelector } from '@hooks/redux'
import { BorderBox } from '@ui/ThemeBox'
import { ThemeAvatar } from '@ui/ThemeAvatar'
import { ThemeLikeIconButton } from '@ui/ThemeIconButton'

import { IUser } from 'src/types'

type Props = {
  openModal: boolean
  handleCloseModal: () => void
  modalData: IUser[]
}

export const ModalLikes: FC<Props> = ({
  openModal,
  handleCloseModal,
  modalData,
}) => {
  const { t } = useTranslation(['bookmarks'])
  const { users } = useAppSelector((state) => state.users)

  return (
    <Modal open={openModal} onClose={handleCloseModal} sx={{ zIndex: 1600 }}>
      <BorderBox
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          p: 3,
          transform: 'translate(-50%, -50%)',
          width: 500,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1">
            {t('Likes', { ns: ['news'] })}:{' '}
            {modalData.length > 0 && modalData.length}
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            color="secondary"
            sx={{ width: '50px ', height: '50px', m: -2 }}
          >
            <Clear />
          </IconButton>
        </Stack>
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {modalData.map((user) => (
            <Box key={user.uid} sx={{ width: '100px' }}>
              <Link to={`/profile/${user.uid}`}>
                <ThemeAvatar
                  alt={user.displayName}
                  src={users.find((u) => u.uid === user.uid)?.photoURL}
                  sx={{
                    width: '100px',
                    height: '100px',
                    mb: 1,
                  }}
                >
                  <Typography variant="h3">{user.emoji}</Typography>
                </ThemeAvatar>
                <Box
                  sx={{
                    position: 'relative',
                    top: '-33px',
                    left: '74px',
                    height: '30px',
                    width: '30px',
                    mb: '-33px',
                    zIndex: 1,
                  }}
                >
                  <ThemeLikeIconButton color="error">
                    <Favorite fontSize="small" />
                  </ThemeLikeIconButton>
                </Box>
                <Typography variant="body2" textAlign="center">
                  {user.displayName.replace(/ .*/, '').length < 14
                    ? user.displayName.replace(/ .*/, '')
                    : user.displayName.replace(/ .*/, '').slice(0, 13) + '…'}
                </Typography>
              </Link>
            </Box>
          ))}
        </Stack>
      </BorderBox>
    </Modal>
  )
}
