import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface Message {
  id: string
  text: string
  role: 'user' | 'bot',
  createdAt: string
}

export interface Conversation {
  id: string
  title?: string
  messages: Message[]
  createdAt: string
}

export interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<{ id?: string, title?: string, messages?: Message[] }>) => {
      const conversationId = action.payload.id ?? uuidv4()
      const newConversation: Conversation = {
        id: conversationId,
        title: action.payload.title ?? 'New Conversation',
        messages: action.payload.messages ?? [],
        createdAt: new Date().toISOString(),
      }
      state.conversations.push(newConversation)
      state.activeConversationId = conversationId
    },

    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload
    },

    clearActiveConversation: (state) => {
      state.activeConversationId = null
    },

    addMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.messages.push(message);
      }
    },
    

    clearChat: (state) => {
      const convo = state.conversations.find(
        (c) => c.id === state.activeConversationId
      )
      if (convo) convo.messages = []
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload
      )
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null
      }
    },
  },
})

export const { addConversation, setActiveConversation,clearActiveConversation, addMessage, clearChat, deleteConversation } = chatSlice.actions
export default chatSlice.reducer