import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEnAbout from './translation/en/about.json'
import translationEnAuth from './translation/en/auth.json'
import translationEnBookmarks from './translation/en/bookmarks.json'
import translationEnFriends from './translation/en/friends.json'
import translationEnNews from './translation/en/news.json'
import translationEnNotFound from './translation/en/notFound.json'
import translationEnProfile from './translation/en/profile.json'
import translationEnMenu from './translation/en/menu.json'
import translationEnOther from './translation/en/other.json'
import translationEnEmojiPicker from './translation/en/emojiPicker.json'

import translationRuAbout from './translation/ru/about.json'
import translationRuAuth from './translation/ru/auth.json'
import translationRuBookmarks from './translation/ru/bookmarks.json'
import translationRuFriends from './translation/ru/friends.json'
import translationRuNews from './translation/ru/news.json'
import translationRuNotFound from './translation/ru/notFound.json'
import translationRuProfile from './translation/ru/profile.json'
import translationRuMenu from './translation/ru/menu.json'
import translationRuOther from './translation/ru/other.json'
import translationRuEmojiPicker from './translation/ru/emojiPicker.json'

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

i18next.use(initReactI18next).init({
  resources,
  lng: 'ru', //default language
})

export default i18next
