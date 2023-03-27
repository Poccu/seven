import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SnackbarProvider } from 'notistack'

import { Slide } from '@mui/material'

import { AuthProvider } from '@providers/AuthProvider'

import { persistor, store } from './store/store'
import { initI18next } from './config/i18n'
import './config/firebase'
import { App } from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const onBeforeLift = async () => {
  await initI18next()
}

root.render(
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
      onBeforeLift={onBeforeLift}
    >
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={5000}
        TransitionComponent={Slide}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </PersistGate>
  </Provider>
)
