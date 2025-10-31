import { useDispatch, useSelector } from 'react-redux';
import { BotIcon } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import type { RootState } from '../store';
import ChatInput from '../components/ChatInput';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { clearActiveConversation, setActiveConversation } from '../features/chat/chatSlice';

function NewChatPage() {
  const { handleSend } = useChat();
  const conversations = useSelector((state: RootState) => state.chat.conversations.find(c => c.id === state.chat.activeConversationId)?.messages || []);

  console.log('-conversations: ', conversations)

  const dispatch = useDispatch()
  const location = useLocation()
  const { id } = useParams<{ id?: string }>()

  useEffect(() => {
    if (location.pathname === '/') {
      dispatch(clearActiveConversation())
    } else if (id) {
      dispatch(setActiveConversation(id))
    }
  }, [location, id, dispatch])

  return (
    <div className="w-full flex flex-col mt-28 pb-24 pl-64">
      <div className='absolute top-[35%] left-[41%] pl-4 flex gap-3 items-center'>
        <BotIcon size={34} strokeWidth={2} className='animate-bounce' />
        <div className='text-3xl font-medium'>
          What can I help you with today?
        </div>
      </div>


      <ChatInput onSend={handleSend} />
    </div>
  )
}

export default NewChatPage
