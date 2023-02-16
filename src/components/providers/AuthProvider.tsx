import { createContext, FC, useEffect, useMemo, useState } from 'react'
import {
  getAuth,
  onAuthStateChanged,
  Auth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'
import {
  getFirestore,
  Firestore,
  onSnapshot,
  DocumentData,
  doc,
  collection,
  query,
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
  gProvider: GoogleAuthProvider
  gitProvider: GithubAuthProvider
  fProvider: FacebookAuthProvider
  users: IUser[]
}

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider: FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [users, setUsers] = useState<IUser[]>([])

  const ga = getAuth()
  const db = getFirestore()
  const cur = ga.currentUser
  const st = getStorage()
  const gProvider = new GoogleAuthProvider()
  const gitProvider = new GithubAuthProvider()
  const fProvider = new FacebookAuthProvider()

  useEffect(() => {
    const unListen = onAuthStateChanged(ga, (userAuth) => {
      if (userAuth) {
        const unsub = onSnapshot(doc(db, 'users', userAuth.uid), (doc) => {
          const userData: DocumentData | undefined = doc.data()
          if (userData) {
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
              images: [...userData.images],
              uid: userData.uid,
            })
          }
        })

        const q = query(collection(db, 'users'))

        const setUsersFunc = onSnapshot(q, (querySnapshot) => {
          const usersArr: IUser[] = []
          querySnapshot.forEach(async (d: DocumentData) => {
            usersArr.push(d.data())
          })
          setUsers(usersArr)
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
    () => ({
      user,
      setUser,
      ga,
      db,
      cur,
      st,
      gProvider,
      gitProvider,
      fProvider,
      users,
    }),
    [user, ga, db, cur, st, gProvider, gitProvider, fProvider, users]
  )

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
