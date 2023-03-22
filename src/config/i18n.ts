import { initReactI18next } from 'react-i18next'
import i18next from 'i18next'

import { store } from '../store/store'

import translationEnAbout from '@assets/translation/en/about.json'
import translationEnAuth from '@assets/translation/en/auth.json'
import translationEnBookmarks from '@assets/translation/en/bookmarks.json'
import translationEnFriends from '@assets/translation/en/friends.json'
import translationEnNews from '@assets/translation/en/news.json'
import translationEnNotFound from '@assets/translation/en/notFound.json'
import translationEnProfile from '@assets/translation/en/profile.json'
import translationEnMenu from '@assets/translation/en/menu.json'
import translationEnOther from '@assets/translation/en/other.json'
import translationEnEmojiPicker from '@assets/translation/en/emojiPicker.json'

import translationRuAbout from '@assets/translation/ru/about.json'
import translationRuAuth from '@assets/translation/ru/auth.json'
import translationRuBookmarks from '@assets/translation/ru/bookmarks.json'
import translationRuFriends from '@assets/translation/ru/friends.json'
import translationRuNews from '@assets/translation/ru/news.json'
import translationRuNotFound from '@assets/translation/ru/notFound.json'
import translationRuProfile from '@assets/translation/ru/profile.json'
import translationRuMenu from '@assets/translation/ru/menu.json'
import translationRuOther from '@assets/translation/ru/other.json'
import translationRuEmojiPicker from '@assets/translation/ru/emojiPicker.json'

const resources = {
  en: {
    about: translationEnAbout,
    auth: translationEnAuth,
    bookmarks: translationEnBookmarks,
    friends: translationEnFriends,
    news: translationEnNews,
    notFound: translationEnNotFound,
    profile: translationEnProfile,
    menu: translationEnMenu,
    other: translationEnOther,
    emojiPicker: translationEnEmojiPicker,
  },
  ru: {
    about: translationRuAbout,
    auth: translationRuAuth,
    bookmarks: translationRuBookmarks,
    friends: translationRuFriends,
    news: translationRuNews,
    notFound: translationRuNotFound,
    profile: translationRuProfile,
    menu: translationRuMenu,
    other: translationRuOther,
    emojiPicker: translationRuEmojiPicker,
  },
}

export const initI18next = () => {
  const lng = store.getState().global.language

  return i18next.use(initReactI18next).init({
    resources,
    lng,
  })
}
