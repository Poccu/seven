import { useContext } from 'react'

import { AuthContext } from '@providers/AuthProvider'

export const useAuth = () => {
  const value = useContext(AuthContext)
  return value
}
