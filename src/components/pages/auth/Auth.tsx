import { SyntheticEvent, useEffect, useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import BorderBox from '../../ui/BorderBox'
import { IUserData } from './types'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useAuth } from '../../providers/useAuth'
import { useNavigate } from 'react-router-dom'

type Props = {}

function Auth({}: Props) {
  const { ga, user } = useAuth()

  const [isRegForm, setIsRegForm] = useState(false)
  const [userData, setUserData] = useState<IUserData>({
    email: '',
    password: '',
  } as IUserData)

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const auth = getAuth()

    if (isRegForm) {
      await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      )
        .then((userCredential) => {
          console.log('REGISTERED', userCredential)
          // Signed in
          // const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log(error.code, error.message)
        })
    } else {
      await signInWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
          // Signed in
          // const user = userCredential.user
          // ...
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
        })
    }
    setUserData({
      email: '',
      password: '',
    })
  }

  const navigate = useNavigate()

  useEffect(() => {
    user && navigate('/')
  }, [user])

  return (
    <>
      <BorderBox>
        <Box sx={{ p: 3 }}>
          Auth
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            // noValidate
            autoComplete="off"
          >
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              required
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              required
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            <Button
              type="submit"
              color="error"
              onClick={() => setIsRegForm(false)}
            >
              Auth
            </Button>
            <Button
              type="submit"
              color="error"
              onClick={() => setIsRegForm(true)}
            >
              Reg
            </Button>
          </Box>
        </Box>
      </BorderBox>
    </>
  )
}

export default Auth
