import { useSelector } from 'react-redux';
import Markdown from 'react-markdown'
import { BotIcon, Loader2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import type { RootState } from '../store';
import ChatInput from '../components/ChatInput';
import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function ChatPage() {
  const { id } = useParams()
  const { handleSend, loading } = useChat();
  const messages = useSelector((state: RootState) => state.chat.conversations.find(c => c.id === id)?.messages || []);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);


  return (
    <div className="w-full flex flex-col mt-28 pb-32 pl-64">
      {
        messages.length === 0 && !loading && (
          <div className='absolute top-[35%] left-[41%] pl-4 flex gap-3 items-center'>
            <BotIcon size={34} strokeWidth={2} className='animate-bounce' />
            <div className='text-3xl font-medium'>
              What can I help you with today?
            </div>
          </div>
        )
      }

      {/* <div className="text-sm text-stone-500 px-2">Conversation: {id}</div> */}

      <div className="w-full flex flex-col gap-2">
        {messages.map((messages: any) => (
          messages.role === 'user' ? (
            <div className='w-fit max-w-lg px-4 py-1 mt-4 rounded-2xl text-start bg-stone-100 border border-stone-300 place-self-end' key={messages.id}>
              <div>{messages.text}</div>
            </div>
          ) : (
            <div className='w-fit max-w-4xl px-4 py-2 rounded-xl text-start place-self-start markdown' key={messages.id}>
              <Markdown>{messages.text}</Markdown>
            </div>
          )
        ))}

        {loading && (
          <div className="p-2 flex items-center gap-1 place-self-start mt-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Generating a response…...</p>
          </div>
        )}

        <div ref={messagesEndRef} />

      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}

export default ChatPage
