# Redux Toolkit Documentation for React + TypeScript + Vite

This guide covers setting up and using **Redux Toolkit** (RTK) with **React**, **TypeScript**, and **Vite** for state management.

---

## Table of Contents

1. [Installation](#installation)
2. [Store Setup](#store-setup)
3. [Creating Slices](#creating-slices)
4. [Provider Setup](#provider-setup)
5. [Using Redux in Components](#using-redux-in-components)
6. [Async Operations with createAsyncThunk](#async-operations-with-createasyncthunk)
7. [Best Practices](#best-practices)
8. [Complete Example](#complete-example)

---

## Installation

Redux Toolkit and React Redux are already installed in your project. If you need to install them in a new project:

```bash
npm install @reduxjs/toolkit react-redux
npm install --save-dev @types/react-redux
```

---

## Store Setup

### 1. Configure the Store

Create `src/store.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './features/chat/chatSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    // Add more reducers here as your app grows
  },
  // Optional: Add middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// Infer types for later use
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 2. Store Configuration Options

```typescript
export const store = configureStore({
  reducer: {
    // Your reducers
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools
  preloadedState: {
    // Initial state for specific slices
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          // Extra arguments for thunks
        }
      },
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
})
```

---

## Creating Slices

### 1. Basic Slice Structure

Create `src/features/chat/chatSlice.ts`:

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the shape of your state
interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

// Define initial state
const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
}

// Create the slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Synchronous actions
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    clearChat: (state) => {
      state.messages = []
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    // Update specific message
    updateMessage: (state, action: PayloadAction<{ id: number; text: string }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id)
      if (message) {
        message.text = action.payload.text
      }
    },
    // Delete message
    deleteMessage: (state, action: PayloadAction<number>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload)
    },
  },
})

// Export actions
export const { 
  addMessage, 
  clearChat, 
  setLoading, 
  setError, 
  updateMessage, 
  deleteMessage 
} = chatSlice.actions

// Export reducer
export default chatSlice.reducer

// Export selectors
export const selectAllMessages = (state: { chat: ChatState }) => state.chat.messages
export const selectIsLoading = (state: { chat: ChatState }) => state.chat.isLoading
export const selectError = (state: { chat: ChatState }) => state.chat.error
```

### 2. Advanced Slice with Extra Reducers

```typescript
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'

// Async thunk for API calls
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Your synchronous reducers
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      // Handle fulfilled state
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages.push({
          id: Date.now(),
          text: action.payload.response,
          sender: 'bot',
          timestamp: new Date(),
        })
      })
      // Handle rejected state
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})
```

---

## Provider Setup

### 1. Wrap Your App with Provider

Update `src/main.tsx`:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
```

---

## Using Redux in Components

### 1. Using useSelector Hook

```typescript
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

function ChatComponent() {
  // Access state using useSelector
  const messages = useSelector((state: RootState) => state.chat.messages)
  const isLoading = useSelector((state: RootState) => state.chat.isLoading)
  const error = useSelector((state: RootState) => state.chat.error)

  // Or use selectors
  const messages = useSelector(selectAllMessages)
  const isLoading = useSelector(selectIsLoading)

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {messages.map(message => (
        <div key={message.id}>
          {message.sender}: {message.text}
        </div>
      ))}
    </div>
  )
}
```

### 2. Using useDispatch Hook

```typescript
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { addMessage, clearChat, sendMessage } from '../features/chat/chatSlice'

function ChatInput() {
  const dispatch = useDispatch<AppDispatch>()
  const [input, setInput] = useState('')

  const handleSend = () => {
    // Dispatch synchronous action
    dispatch(addMessage({
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }))

    // Dispatch async thunk
    dispatch(sendMessage(input))
    setInput('')
  }

  const handleClear = () => {
    dispatch(clearChat())
  }

  return (
    <div>
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

### 3. Using Typed Hooks (Recommended)

Create `src/hooks/redux.ts`:

```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

Then use in components:

```typescript
import { useAppDispatch, useAppSelector } from '../hooks/redux'

function MyComponent() {
  const dispatch = useAppDispatch()
  const messages = useAppSelector(state => state.chat.messages)
  const isLoading = useAppSelector(state => state.chat.isLoading)

  // TypeScript will now provide full type safety!
}
```

---

## Async Operations with createAsyncThunk

### 1. Basic Async Thunk

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
```

### 2. Advanced Async Thunk with Extra Arguments

```typescript
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (params: { userId: string; limit?: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token // Access other state
      
      const response = await fetch(`/api/chat/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history')
      }
      
      return await response.json()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
```

---

## Best Practices

### 1. State Structure

```typescript
// ✅ Good: Normalized state structure
interface AppState {
  users: {
    byId: Record<string, User>
    allIds: string[]
  }
  posts: {
    byId: Record<string, Post>
    allIds: string[]
    loading: boolean
    error: string | null
  }
}

// ❌ Avoid: Nested arrays that are hard to update
interface BadState {
  users: User[]
  posts: Post[]
}
```

### 2. Selectors

```typescript
// ✅ Good: Memoized selectors with reselect
import { createSelector } from '@reduxjs/toolkit'

const selectMessages = (state: RootState) => state.chat.messages
const selectUserId = (state: RootState) => state.auth.userId

export const selectUserMessages = createSelector(
  [selectMessages, selectUserId],
  (messages, userId) => messages.filter(msg => msg.userId === userId)
)
```

### 3. Error Handling

```typescript
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || 'An error occurred'
      })
  },
})
```

### 4. TypeScript Integration

```typescript
// Define action types
type ChatAction = 
  | ReturnType<typeof addMessage>
  | ReturnType<typeof clearChat>
  | ReturnType<typeof sendMessage.fulfilled>

// Use in components
const handleAction = (action: ChatAction) => {
  dispatch(action)
}
```

---

## Complete Example

Here's a complete working example of your current chat implementation with improvements:

### Updated Chat Slice (`src/features/chat/chatSlice.ts`)

```typescript
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { sendPrompt } from '../../service/chatbotService'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
}

// Async thunk for sending messages
export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { rejectWithValue }) => {
    try {
      const result = await sendPrompt(message)
      return {
        id: Date.now(),
        text: result.message,
        sender: 'bot' as const,
        timestamp: new Date(),
      }
    } catch (error) {
      return rejectWithValue('Failed to send message')
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        id: Date.now(),
        text: action.payload,
        sender: 'user',
        timestamp: new Date(),
      })
    },
    clearChat: (state) => {
      state.messages = []
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false
        state.messages.push(action.payload)
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { addUserMessage, clearChat, clearError } = chatSlice.actions
export default chatSlice.reducer

// Selectors
export const selectAllMessages = (state: { chat: ChatState }) => state.chat.messages
export const selectIsLoading = (state: { chat: ChatState }) => state.chat.isLoading
export const selectError = (state: { chat: ChatState }) => state.chat.error
```

### Updated Chat Hook (`src/hooks/useChat.ts`)

```typescript
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './redux'
import { addUserMessage, sendChatMessage, clearChat, selectAllMessages, selectIsLoading, selectError } from '../features/chat/chatSlice'

export const useChat = () => {
  const dispatch = useAppDispatch()
  const messages = useAppSelector(selectAllMessages)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)

  const sendMessage = useCallback(async (text: string) => {
    dispatch(addUserMessage(text))
    dispatch(sendChatMessage(text))
  }, [dispatch])

  const clearMessages = useCallback(() => {
    dispatch(clearChat())
  }, [dispatch])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
```

### Updated App Component (`src/App.tsx`)

```typescript
import { useChat } from './hooks/useChat'
import ChatInput from './components/ChatInput'

function App() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat()

  return (
    <div className="flex flex-col gap-10">
      <header className="p-3">
        <div className="text-3xl font-semibold">Chatbot</div>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            Error: {error}
          </div>
        )}
      </header>

      <main className="p-4 w-full flex flex-col">
        {messages.map((message) => (
          message.sender === 'user' ? (
            <div className='w-fit px-3 py-1 rounded-2xl bg-stone-700 text-end place-self-end mb-2' key={message.id}>
              <div>{message.text}</div>
            </div>
          ) : (
            <div className='w-fit px-3 py-1 rounded-2xl text-start place-self-start mb-2' key={message.id}>
              <div>{message.text}</div>
            </div>
          )
        ))}
        {isLoading && (
          <div className='w-fit px-3 py-1 rounded-2xl text-start place-self-start mb-2'>
            <div>Bot is typing...</div>
          </div>
        )}
      </main>

      <ChatInput onSend={sendMessage} onClear={clearMessages} />
    </div>
  )
}

export default App
```

---

## Redux DevTools

Redux DevTools are automatically enabled in development. Install the browser extension to debug your Redux state:

- [Chrome Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

---

## Summary

This documentation covers:

1. ✅ **Installation** - Redux Toolkit and React Redux setup
2. ✅ **Store Configuration** - Setting up the Redux store with TypeScript
3. ✅ **Slices** - Creating reducers with createSlice
4. ✅ **Provider Setup** - Wrapping your app with Redux Provider
5. ✅ **Component Integration** - Using useSelector and useDispatch
6. ✅ **Async Operations** - Handling API calls with createAsyncThunk
7. ✅ **Best Practices** - TypeScript integration, selectors, and error handling
8. ✅ **Complete Example** - Working chat application with Redux

Your current project already has Redux properly set up! The documentation above shows how to enhance and extend your existing implementation with better TypeScript support, error handling, and best practices.


