import { FC } from 'react'
import { Box, IconButton, Modal } from '@mui/material'
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
      onClose={handleCloseImage}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
      }}
    >
      <>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          display="flex"
        >
          <img
            src={modalImage}
            alt={modalImage}
            height="100%"
            width="100%"
            className="contain"
            loading="lazy"
            draggable={false}
          />
        </Box>
        <IconButton
          onClick={handleCloseImage}
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
