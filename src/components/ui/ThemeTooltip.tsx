import { Tooltip, styled, TooltipProps, tooltipClasses } from '@mui/material'

export const ThemeTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
}))
