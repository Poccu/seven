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
import { doc, setDoc } from 'firebase/firestore'

type Props = {}

function Auth({}: Props) {
  const { cur, ga, db } = useAuth()

  const [isRegForm, setIsRegForm] = useState(false)
  const [userData, setUserData] = useState<IUserData>({
    displayName: '',
    email: '',
    password: '',
    photoURL: '',
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
        displayName: userData.displayName,
        photoURL: `https://i.pravatar.cc/200?img=${
          Math.floor(Math.random() * 70) + 1
        }`,
      })
      console.log('User profile updated', user)

      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          password: userData.password,
          photoURL: user.photoURL,
          friends: [],
          groups: [],
          photos: [],
          music: [],
          bookmarks: [],
          createdAt: Date.now(),
        })
      } catch (e) {
        console.error('Error adding document: ', e)
      }

      navigate('/')
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
    navigate('/')
    setUserData({
      email: '',
      password: '',
      displayName: '',
      photoURL: '',
    })
  }

  const navigate = useNavigate()

  useEffect(() => {
    cur && navigate('/')
  }, [cur])

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
              value={userData.displayName}
              onChange={(e) =>
                setUserData({ ...userData, displayName: e.target.value })
              }
              error
              helperText="Incorrect entry."
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
              error
              helperText="Incorrect entry."
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
              error
              helperText="Incorrect entry."
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
