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
}

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | null>({
    _id: '',
    avatar: '',
    name: '',
    // isInNetwork?: boolean
  })

  const ga = getAuth()
  const db = getFirestore()

  useEffect(() => {
    const unListen = onAuthStateChanged(ga, (authUser) => {
      if (authUser) {
        setUser({
          _id: authUser.uid,
          avatar: `https://i.pravatar.cc/100?img=${
            Math.floor(Math.random() * 70) + 1
          }`,
          name: authUser?.displayName || '',
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      unListen()
    }
  }, [])

  const values = useMemo(() => ({ user, setUser, ga, db }), [user, ga, db])

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
