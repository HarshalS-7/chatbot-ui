import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
}

export interface ChatState {
  messages: Message[]
}

const initialState: ChatState = {
  messages: [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    clearChat: (state) => {
      state.messages = []
    },
  },
})

export const { addMessage, clearChat } = chatSlice.actions
export default chatSlice.reducer