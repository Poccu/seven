import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SnackbarProvider } from 'notistack'

import { Grow } from '@mui/material'

import { AuthProvider } from '@providers/AuthProvider'

import store, { persistor } from './store/store'
import { App } from './App'
import { initI18next } from './i18n'
import './i18n'
import './firebase'

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
        maxSnack={1}
        autoHideDuration={3000}
        TransitionComponent={Grow}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </PersistGate>
  </Provider>
)
