import { SyntheticEvent, useEffect, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import BorderBox from '../../ui/BorderBox'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { useAuth } from '../../providers/useAuth'
import { useNavigate } from 'react-router-dom'
import { IUserData } from '../../../types'

type Props = {}

function Auth({}: Props) {
  const { ga, user } = useAuth()

  const [isRegForm, setIsRegForm] = useState(false)
  const [userData, setUserData] = useState<IUserData>({
    email: '',
    password: '',
    name: '',
    avatar: '',
  } as IUserData)

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isRegForm) {
      const { user } = await createUserWithEmailAndPassword(
        ga,
        userData.email,
        userData.password
      )
      console.log(`User ${user.uid} created`)
      await updateProfile(user, {
        displayName: userData.name,
      })
      console.log('User profile updated')
      navigate('/')
      // window.location.reload()
    } else {
      await signInWithEmailAndPassword(ga, userData.email, userData.password)
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
      name: '',
      avatar: '',
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
          <Typography>Sign in to Seven</Typography>
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
              label="Name"
              variant="outlined"
              required
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
            />
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
              color="info"
              onClick={() => setIsRegForm(false)}
            >
              Sign in
            </Button>
            <Button
              type="submit"
              color="error"
              onClick={() => setIsRegForm(true)}
            >
              Register
            </Button>
          </Box>
        </Box>
      </BorderBox>
    </>
  )
}

export default Auth
