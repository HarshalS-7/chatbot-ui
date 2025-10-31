import { sendPrompt } from "../service/chatbotService";
import { useDispatch, useSelector } from "react-redux";
import { addConversation, addMessage, setActiveConversation, type Message } from "../features/chat/chatSlice";
import { v4 as uuidv4 } from 'uuid';
import type { AppDispatch, RootState } from "../store";
import { useCallback, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { id: routeConversationId } = useParams()
  const { conversations, activeConversationId } = useSelector((state: RootState) => state.chat)
  const [loading, setLoading] = useState(false)

  const ensureConversation = useCallback((): string => {
    // If there is a conversation in the route, use it
    if (routeConversationId) {
      dispatch(setActiveConversation(routeConversationId))
      return routeConversationId
    }

    // If there is already an active conversation, reuse it
    if (activeConversationId) {
      return activeConversationId
    }

    // Otherwise create a new conversation and navigate
    const newId = uuidv4()
    dispatch(addConversation({ id: newId, title: `Conversation ${conversations.length + 1}`, messages: [] }))
    dispatch(setActiveConversation(newId))
    if (location.pathname === '/') {
      navigate(`/chat/${newId}`)
    }
    return newId
  }, [dispatch, activeConversationId, routeConversationId, navigate, location.pathname])

  const handleSend = useCallback(async (text: string) => {
    const conversationId = ensureConversation()
    setLoading(true)
    try {
      // Add user message first
      const userMessage: Message = {
        id: uuidv4(),
        text,
        role: 'user',
        createdAt: new Date().toISOString(),
      }
      dispatch(addMessage({ conversationId, message: userMessage }))

      const activeConversation = conversations.find(
        (conv) => conv.id === conversationId
      )

      // 3️⃣ Prepare messages array (including the new one)
      const conversationMessages = activeConversation
        ? [...activeConversation.messages, userMessage]
        : [userMessage]

        console.log('------conversationMessages: ',conversationMessages)

      // Send to backend and add bot response
      const result = await sendPrompt(conversationMessages)
      const botMessage: Message = {
        id: uuidv4(),
        text: result.message,
        role: 'bot',
        createdAt: new Date().toISOString(),
      }
      dispatch(addMessage({ conversationId, message: botMessage }))
    } catch (err) {
      // Surface error up for UI if needed
      throw err
    } finally {
      setLoading(false)
    }
  }, [dispatch, ensureConversation])

  return { handleSend, loading, conversations, activeConversationId }
}