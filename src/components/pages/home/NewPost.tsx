import { Avatar, Box, Stack, TextField } from '@mui/material'
import BorderBox from '../../ui/BorderBox'

type Props = {}

const NewPost = (props: Props) => {
  return (
    <Box sx={{ mb: 2 }}>
      <BorderBox>
        <Box sx={{ p: 3 }}>
          <Stack
            // alignItems="center"
            direction="row"
            spacing={2}
          >
            <Box sx={{ mt: 0.6 }}>
              <Avatar
                alt=""
                src="https://i.pravatar.cc/200?img=21"
                sx={{ width: 46, height: 46 }}
                draggable={false}
              />
            </Box>
            <TextField
              id="outlined-textarea"
              label={<b>Whats's new?</b>}
              // placeholder="Placeholder"
              multiline
              fullWidth
              color="info"
              focused
            />
          </Stack>
        </Box>
      </BorderBox>
    </Box>
  )
}

export default NewPost
