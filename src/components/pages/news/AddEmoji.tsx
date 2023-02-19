import { FC, useRef, useState } from 'react'
import Grow from '@mui/material/Grow'
import Popper from '@mui/material/Popper'
import { Box, IconButton, useTheme } from '@mui/material'
import { Mood } from '@mui/icons-material'
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
} from 'emoji-picker-react'
import { useTranslation } from 'react-i18next'

type Props = {
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export const AddEmoji: FC<Props> = ({ setContent }) => {
  const { t } = useTranslation(['emojiPicker'])
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const theme = useTheme()

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    let sym = emojiData.unified.split('-')
    let codesArray: any[] = []
    sym.forEach((el) => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    setContent((prevContent) => prevContent + emoji)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)

  return (
    <Box onMouseOver={handleToggle} onMouseOut={handleToggle}>
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="secondary"
        sx={{ width: '50px ', height: '50px', ml: -1 }}
      >
        <Mood color="primary" />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
        sx={{ zIndex: 10 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'right top',
            }}
          >
            <Box>
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
                theme={
                  theme.palette.mode === 'light' ? Theme.LIGHT : Theme.DARK
                }
                height={565}
                emojiVersion="5.0"
                defaultSkinTone={SkinTones.MEDIUM}
                emojiStyle={EmojiStyle.NATIVE}
                previewConfig={{
                  defaultCaption: 'Pick one!',
                  defaultEmoji: '1f92a', // 🤪
                }}
                searchPlaceHolder={t('title1') || 'Search'}
                categories={[
                  {
                    name: t('title2'),
                    category: Categories.SUGGESTED,
                  },
                  {
                    name: t('title3'),
                    category: Categories.SMILEYS_PEOPLE,
                  },
                  {
                    name: t('title4'),
                    category: Categories.ANIMALS_NATURE,
                  },
                  {
                    name: t('title5'),
                    category: Categories.FOOD_DRINK,
                  },
                  {
                    name: t('title6'),
                    category: Categories.TRAVEL_PLACES,
                  },
                  {
                    name: t('title7'),
                    category: Categories.ACTIVITIES,
                  },
                  {
                    name: t('title8'),
                    category: Categories.OBJECTS,
                  },
                  {
                    name: t('title9'),
                    category: Categories.SYMBOLS,
                  },
                  {
                    name: t('title10'),
                    category: Categories.FLAGS,
                  },
                ]}
              />
            </Box>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}
