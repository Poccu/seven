import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export const useAuth = () => {
  const value = useContext(AuthContext)
  return value
}
