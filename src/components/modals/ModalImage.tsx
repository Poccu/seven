import { FC } from 'react'

import { IconButton, Modal } from '@mui/material'
import { Clear } from '@mui/icons-material'

type Props = {
  openImage: boolean
  handleCloseImage: () => void
  modalImage: string
}

export const ModalImage: FC<Props> = ({
  openImage,
  handleCloseImage,
  modalImage,
}) => {
  return (
    <Modal
      open={openImage}
      onClick={handleCloseImage}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
      }}
      sx={{ zIndex: 1600 }}
    >
      <>
        <img
          src={modalImage}
          alt={modalImage}
          className="contain"
          loading="lazy"
          draggable={false}
        />
        <IconButton
          color="secondary"
          sx={{
            position: 'absolute',
            height: '100px',
            width: '100px',
            top: 20,
            right: 20,
          }}
        >
          <Clear sx={{ height: '60px', width: '60px' }} />
        </IconButton>
      </>
    </Modal>
  )
}
