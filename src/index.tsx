import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { initializeApp } from 'firebase/app'
import { AuthProvider } from './components/providers/AuthProvider'

const firebaseConfig = {
  apiKey: 'AIzaSyABUYXt8l_iuWYS91FwBV2BvF5T23_Zrnc',
  authDomain: 'seven-982bd.firebaseapp.com',
  projectId: 'seven-982bd',
  storageBucket: 'seven-982bd.appspot.com',
  messagingSenderId: '630020964518',
  appId: '1:630020964518:web:61cf8307c7c5131176b467',
  measurementId: 'G-W1XS2QT3B3',
}

initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
