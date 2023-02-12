import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { SnackbarProvider } from 'notistack'
import { initializeApp } from 'firebase/app'
import { AuthProvider } from './components/providers/AuthProvider'
import { Grow } from '@mui/material'
import './i18n'

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY
const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
const storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
const appId = process.env.REACT_APP_FIREBASE_APP_ID
const measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
}

initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <SnackbarProvider
    maxSnack={1}
    autoHideDuration={3000}
    TransitionComponent={Grow}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </SnackbarProvider>
)
