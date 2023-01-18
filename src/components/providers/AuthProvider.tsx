import { getAuth, onAuthStateChanged, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { createContext, useEffect, useMemo, useState } from 'react'
import { IUser, TypeSetState } from '../../types'

type Props = {
  children: any
}

interface IContext {
  user: IUser | null
  setUser: TypeSetState<IUser | null>
  ga: Auth
  db: Firestore
  cur: any
}

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | null>({
    uid: '',
    photoURL: '',
    displayName: '',
    // isInNetwork?: boolean
  })

  const ga = getAuth()
  const db = getFirestore()
  const cur = ga.currentUser

  useEffect(() => {
    const unListen = onAuthStateChanged(ga, (cur) => {
      if (cur) {
        setUser({
          uid: cur.uid,
          photoURL: `https://i.pravatar.cc/200?img=${
            Math.floor(Math.random() * 70) + 1
          }`,
          displayName: cur?.displayName || '',
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
    () => ({ user, setUser, ga, db, cur }),
    [user, ga, db, cur]
  )

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
