import { emojis } from '@assets/emojis/emojis'

export const getRandomEmoji = () => {
  const random = Math.floor(Math.random() * emojis.length)

  return emojis[random]
}
