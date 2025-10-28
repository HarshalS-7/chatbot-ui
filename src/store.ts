import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './features/chat/chatSlice'
import authReducer from './features/auth/userSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,

  },
})

// Infer types for later use
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
