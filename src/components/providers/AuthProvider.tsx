import { getAuth, onAuthStateChanged, Auth } from 'firebase/auth'
import { createContext, useEffect, useMemo, useState } from 'react'
import { IUser, TypeSetState } from '../../types'

type Props = {
  children: any
}

interface IContext {
  user: IUser | null
  setUser: TypeSetState<IUser | null>
  ga: Auth
}

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | null>(null)

  const ga = getAuth()

  useEffect(() => {
    const unListen = onAuthStateChanged(ga, (authUser) => {
      if (authUser) {
        setUser({
          _id: authUser.uid,
          avatar: '',
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

  // const values = useMemo(() => ), [user])

  return (
    <AuthContext.Provider value={{ user, setUser, ga }}>
      {children}
    </AuthContext.Provider>
  )
}
