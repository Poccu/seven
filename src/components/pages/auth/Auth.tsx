import { FC, SyntheticEvent, useState } from 'react'
import {
  Box,
  Typography,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Stack,
  Divider,
} from '@mui/material'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'
import { useAuth } from '../../providers/useAuth'
import { IUserData } from '../../../types'
import { doc, runTransaction, setDoc } from 'firebase/firestore'
import {
  Facebook,
  GitHub,
  Google,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { emojis } from './emojis'
import { ThemeTextFieldAuth } from '../../ui/ThemeTextField'
import { ThemeButton } from '../../ui/ThemeButton'
import { BackgroundPaperBox } from '../../ui/ThemeBox'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const Auth: FC = () => {
  const { ga, db, gProvider, gitProvider, fProvider } = useAuth()

  const [isRegForm, setIsRegForm] = useState(false)
  const [userData, setUserData] = useState<IUserData>({
    displayName: '',
    email: '',
    password: '',
    photoURL: '',
  })

  const [invalidEmail, setInvalidEmail] = useState(false)
  const [alreadyInUseEmail, setAlreadyInUseEmail] = useState(false)
  const [invalidPassword, setInvalidPassword] = useState(false)

  const [userNotFound, setUserNotFound] = useState(false)
  const [wrongPassword, setWrongPassword] = useState(false)

  const [value, setValue] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const random = Math.floor(Math.random() * emojis.length)

    if (isRegForm) {
      await createUserWithEmailAndPassword(
        ga,
        userData.email,
        userData.password
      )
        .then(async (userCredential) => {
          // console.log('REGISTERED', userCredential)
          const user = userCredential.user

          await updateProfile(user, {
            displayName: userData.displayName,
          })
          // console.log('User profile updated', user)

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
              createdAt:
                user.metadata.creationTime &&
                +new Date(user.metadata.creationTime).getTime(),
              emoji: emojis[random],
            })
          } catch (e) {
            console.error('Error adding document: ', e)
          }
        })
        .catch((error) => {
          error.code === 'auth/invalid-email' && setInvalidEmail(true)
          error.code === 'auth/email-already-in-use' &&
            setAlreadyInUseEmail(true)
          error.code === 'auth/weak-password' && setInvalidPassword(true)
        })
    } else {
      await signInWithEmailAndPassword(ga, userData.email, userData.password)
        .then((userCredential) => {
          // Signed in
          // const user = userCredential.user
          // ...
        })
        .catch((error) => {
          error.code === 'auth/user-not-found' && setUserNotFound(true)
          error.code === 'auth/wrong-password' && setWrongPassword(true)
        })
    }
    setUserData({
      email: '',
      password: '',
      displayName: '',
      photoURL: '',
    })
  }

  const handleGoogleLogin = () => {
    const random = Math.floor(Math.random() * emojis.length)

    signInWithPopup(ga, gProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential?.accessToken
        // The signed-in user info.
        const user = result.user
        const docRef = doc(db, 'users', user.uid)

        try {
          await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef)
            if (!sfDoc.exists()) {
              try {
                await setDoc(docRef, {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  password: null,
                  photoURL: user.photoURL?.slice(0, -6),
                  friends: [],
                  groups: [],
                  photos: [],
                  music: [],
                  bookmarks: [],
                  createdAt:
                    user.metadata.creationTime &&
                    +new Date(user.metadata.creationTime).getTime(),
                  emoji: emojis[random],
                })
              } catch (e) {
                console.error('Error adding document: ', e)
              }
            }
          })
        } catch (e) {
          console.log('runTransaction Auth failed: ', e)
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.log('----------------', error.code, error.message)
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
      })
  }

  const handleGithubLogin = () => {
    const random = Math.floor(Math.random() * emojis.length)

    signInWithPopup(ga, gitProvider)
      .then(async (result) => {
        // // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        // const credential = GithubAuthProvider.credentialFromResult(result)
        // const token = credential?.accessToken
        // // The signed-in user info.
        const user = result.user
        const docRef = doc(db, 'users', user.uid)

        try {
          await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef)
            if (!sfDoc.exists()) {
              try {
                await setDoc(docRef, {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  password: null,
                  photoURL: user.photoURL,
                  friends: [],
                  groups: [],
                  photos: [],
                  music: [],
                  bookmarks: [],
                  createdAt:
                    user.metadata.creationTime &&
                    +new Date(user.metadata.creationTime).getTime(),
                  emoji: emojis[random],
                })
              } catch (e) {
                console.error('Error adding document: ', e)
              }
            }
          })
        } catch (e) {
          console.log('runTransaction Auth failed: ', e)
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.log('----------------', error.code, error.message)
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error)
        // ...
      })
  }

  const handleFacebookLogin = () => {
    const random = Math.floor(Math.random() * emojis.length)

    signInWithPopup(ga, fProvider)
      .then(async (result) => {
        // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const credential = FacebookAuthProvider.credentialFromResult(result)
        // const token = credential?.accessToken
        // // The signed-in user info.
        const user = result.user
        const docRef = doc(db, 'users', user.uid)

        try {
          await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef)
            if (!sfDoc.exists()) {
              try {
                await setDoc(docRef, {
                  uid: user.uid,
                  displayName: user.displayName,
                  email: user.email,
                  password: null,
                  photoURL: user.photoURL,
                  friends: [],
                  groups: [],
                  photos: [],
                  music: [],
                  bookmarks: [],
                  createdAt:
                    user.metadata.creationTime &&
                    +new Date(user.metadata.creationTime).getTime(),
                  emoji: emojis[random],
                })
              } catch (e) {
                console.error('Error adding document: ', e)
              }
            }
          })
        } catch (e) {
          console.log('runTransaction Auth failed: ', e)
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.log('----------------', error.code, error.message)
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error)
        // ...
      })
  }

  return (
    <Box sx={{ my: 2 }}>
      <BackgroundPaperBox
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          zIndex: -1,
        }}
      ></BackgroundPaperBox>
      <Box display="flex" alignItems="center" justifyContent="center">
        <img
          src={`${process.env.PUBLIC_URL}/assets/images/logo7.png`}
          alt="Seven"
          height="150px"
          width="150px"
          draggable={false}
        />
      </Box>
      <Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label={
                <Typography variant="h6">
                  <b>Sign in</b>
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Typography variant="h6">
                  <b>Register</b>
                </Typography>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Box
            component="form"
            onSubmit={handleLogin}
            autoComplete="off"
            sx={{ mb: 3, mt: 1 }}
          >
            <Stack
              direction="column"
              justifyContent="space-center"
              alignItems="center"
              spacing={1}
            >
              <ThemeTextFieldAuth
                type="email"
                label="Email"
                variant="outlined"
                required
                autoComplete="off"
                color="primary"
                sx={{ width: '300px' }}
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                onFocus={() => setUserNotFound(false)}
                error={userNotFound}
                helperText={(userNotFound && 'Wrong email') || ' '}
              />
              <ThemeTextFieldAuth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                variant="outlined"
                required
                autoComplete="off"
                color="primary"
                sx={{ width: '300px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                onFocus={() => setWrongPassword(false)}
                error={wrongPassword}
                helperText={(wrongPassword && 'Wrong password') || ' '}
              />
              <ThemeButton type="submit" onClick={() => setIsRegForm(false)}>
                <b>Sign in</b>
              </ThemeButton>
            </Stack>
          </Box>
          <Divider sx={{ width: '100%' }}>
            <Typography color="textSecondary" variant="body1">
              or login with
            </Typography>
          </Divider>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ my: 2 }}
          >
            <IconButton
              onClick={handleGoogleLogin}
              color="primary"
              size="large"
              title="Google"
              sx={{ width: '60px ', height: '60px' }}
            >
              <Google fontSize="large" />
            </IconButton>
            <IconButton
              onClick={handleGithubLogin}
              color="primary"
              size="large"
              title="GitHub"
              sx={{ width: '60px ', height: '60px' }}
            >
              <GitHub fontSize="large" />
            </IconButton>
            <IconButton
              onClick={handleFacebookLogin}
              color="primary"
              size="large"
              title="Facebook"
              sx={{ width: '60px ', height: '60px' }}
            >
              <Facebook fontSize="large" />
            </IconButton>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Typography>Don't have an account?</Typography>
            <Typography
              color="primary"
              onClick={() => setValue(1)}
              sx={{ cursor: 'pointer' }}
            >
              <b>Register</b>
            </Typography>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box
            component="form"
            onSubmit={handleLogin}
            autoComplete="off"
            sx={{ mb: 3, mt: 1 }}
          >
            <Stack
              direction="column"
              justifyContent="space-center"
              alignItems="center"
              spacing={1}
            >
              <ThemeTextFieldAuth
                label="Name"
                variant="outlined"
                required
                autoComplete="off"
                color="primary"
                sx={{ width: '300px' }}
                value={userData.displayName}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    displayName: e.target.value,
                  })
                }
                helperText={' '}
              />
              <ThemeTextFieldAuth
                type="email"
                label="Email"
                variant="outlined"
                required
                autoComplete="off"
                color="primary"
                sx={{ width: '300px' }}
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                onFocus={() => {
                  setInvalidEmail(false)
                  setAlreadyInUseEmail(false)
                }}
                error={invalidEmail || alreadyInUseEmail}
                helperText={
                  invalidEmail
                    ? 'Invalid email'
                    : alreadyInUseEmail
                    ? 'Email is already in use'
                    : ' '
                }
              />
              <ThemeTextFieldAuth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                variant="outlined"
                required
                autoComplete="off"
                color="primary"
                sx={{ width: '300px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                onFocus={() => setInvalidPassword(false)}
                error={invalidPassword}
                helperText={invalidPassword ? 'At least 6 characters' : ' '}
              />
              <ThemeButton type="submit" onClick={() => setIsRegForm(true)}>
                <b>Register</b>
              </ThemeButton>
            </Stack>
          </Box>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Typography>Already have an account?</Typography>
            <Typography
              color="primary"
              onClick={() => setValue(0)}
              sx={{ cursor: 'pointer' }}
            >
              <b>Sign in</b>
            </Typography>
          </Stack>
        </TabPanel>
      </Box>
    </Box>
  )
}

export default Auth
