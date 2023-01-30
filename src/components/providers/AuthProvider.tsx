import { createContext, FC, useEffect, useMemo, useState } from 'react'
import { getAuth, onAuthStateChanged, Auth } from 'firebase/auth'
import {
  getFirestore,
  Firestore,
  onSnapshot,
  DocumentData,
  doc,
} from 'firebase/firestore'
import { IUser, TypeSetState } from '../../types'
import { FirebaseStorage, getStorage } from 'firebase/storage'

type Props = {
  children: any
}

interface IContext {
  user: IUser | null
  setUser: TypeSetState<IUser | null>
  ga: Auth
  db: Firestore
  cur: any
  st: FirebaseStorage
}

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>({
    bookmarks: [],
    createdAt: '',
    displayName: '',
    email: '',
    emoji: '',
    friends: [],
    groups: [],
    music: [],
    password: '',
    photoURL: '',
    photos: [],
    uid: '',
    // isInNetwork?: boolean
  })

  const ga = getAuth()
  const db = getFirestore()
  const cur = ga.currentUser
  const st = getStorage()

  useEffect(() => {
    const unListen = onAuthStateChanged(ga, (cur) => {
      if (cur) {
        const unsub = onSnapshot(doc(db, 'users', cur.uid), (doc) => {
          const userData: DocumentData | undefined = doc.data()
          if (userData) {
            console.log('userData', userData)
            setUser({
              bookmarks: [...userData.bookmarks],
              createdAt: userData.createdAt,
              displayName: userData.displayName,
              email: userData.email,
              emoji: userData.emoji,
              friends: [...userData.friends],
              groups: [...userData.groups],
              music: [...userData.music],
              password: userData.password,
              photoURL: userData.photoURL,
              photos: [...userData.photos],
              uid: userData.uid,
            })
          }
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      unListen()
    }
  }, [])

  const values = useMemo(
    () => ({ user, setUser, ga, db, cur, st }),
    [user, ga, db, cur, st]
  )

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
