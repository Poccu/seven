import { styled, TextField } from '@mui/material'

export const ThemeTextFieldAuth = styled(TextField)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  },
}))

export const ThemeTextFieldAddPost = styled(TextField)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  },
}))
