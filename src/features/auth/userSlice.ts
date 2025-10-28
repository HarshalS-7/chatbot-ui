import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const storedUser = localStorage.getItem('user')

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: any) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload))
      } else {
        localStorage.removeItem('user')
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
    },
  },
})

export const { setUser, logout } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth
export default authSlice.reducer
