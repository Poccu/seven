import ReactDOM from 'react-dom/client'
import { App } from './App'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './components/providers/AuthProvider'
import { Grow } from '@mui/material'
import './index.css'
import './i18n'
import './firebase'
import { Provider } from 'react-redux'
import { setupStore } from './store/store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const store = setupStore()

root.render(
  <Provider store={store}>
    <SnackbarProvider
      maxSnack={1}
      autoHideDuration={3000}
      TransitionComponent={Grow}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </SnackbarProvider>
  </Provider>
)
