import { FC, useRef, useState } from 'react'
import { Box, Grow, IconButton, Popper } from '@mui/material'
import { Mood } from '@mui/icons-material'
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
} from 'emoji-picker-react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../../hooks/redux'

type Props = {
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export const AddEmoji: FC<Props> = ({ setContent }) => {
  const { t } = useTranslation(['emojiPicker'])

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const { theme } = useAppSelector((state) => state.global)

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

  return (
    <Box
      onMouseOver={handleToggle}
      onMouseOut={handleToggle}
      sx={{ display: { xs: 'none', sm: 'block' } }}
    >
      <IconButton
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="primary"
        sx={{ width: '50px ', height: '50px', mx: -1 }}
      >
        <Mood />
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
                theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                height={565}
                emojiVersion="5.0"
                defaultSkinTone={SkinTones.MEDIUM}
                emojiStyle={EmojiStyle.NATIVE}
                previewConfig={{
                  defaultCaption: 'Pick one!',
                  defaultEmoji: '1f92a', // 🤪
                }}
                searchPlaceHolder={t('Search') || 'Search'}
                categories={[
                  {
                    name: t('Recently Used'),
                    category: Categories.SUGGESTED,
                  },
                  {
                    name: t('Smileys & People'),
                    category: Categories.SMILEYS_PEOPLE,
                  },
                  {
                    name: t('Animals & Nature'),
                    category: Categories.ANIMALS_NATURE,
                  },
                  {
                    name: t('Food & Drink'),
                    category: Categories.FOOD_DRINK,
                  },
                  {
                    name: t('Travel & Places'),
                    category: Categories.TRAVEL_PLACES,
                  },
                  {
                    name: t('Activities'),
                    category: Categories.ACTIVITIES,
                  },
                  {
                    name: t('Objects'),
                    category: Categories.OBJECTS,
                  },
                  {
                    name: t('Symbols'),
                    category: Categories.SYMBOLS,
                  },
                  {
                    name: t('Flags'),
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
