import { combineReducers, configureStore } from '@reduxjs/toolkit'
import globalReducer from './reducers/GlobalSlice'
import userReducer from './reducers/UserSlice'
import usersReducer from './reducers/UsersSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  users: usersReducer,
})

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['global'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const setupStore = () => store

export const persistor = persistStore(store)
export default store

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
