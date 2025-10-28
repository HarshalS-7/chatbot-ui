import { sendPrompt } from "../service/chatbotService";
import { useDispatch } from "react-redux";
import { addMessage } from "../features/chat/chatSlice";
import { v4 as uuidv4 } from 'uuid';
import type { AppDispatch } from "../store";
import { useState } from "react";

export const useChat = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const handleSend = async (messages: any) => {
    setLoading(true);
    try {
      const result = await sendPrompt(messages);
      console.log('---result: ', result.message)
      dispatch(addMessage({ id: uuidv4(), text: result.message, sender: 'bot' }))
    } catch (err: any) {
      console.log('errr: ', err)
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { handleSend, loading }
}