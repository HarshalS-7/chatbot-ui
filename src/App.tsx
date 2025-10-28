import './App.css'
import { useSelector } from 'react-redux';
import ChatInput from './components/ChatInput';
import { useChat } from './hooks/useChat';
import type { RootState } from './store';
import Markdown from 'react-markdown'
import { BotIcon, Loader2 } from 'lucide-react';
// import axios from 'axios';

function App() {
  const { handleSend, loading } = useChat();
  const messages = useSelector((state: RootState) => state.chat.messages);

  // async function checkUser() {
  //   const res = await axios.get("http://localhost:8000/api/auth/me", {
  //     withCredentials: true,
  //   });
  //   console.log('user axios response: ', res)
  // }


  return (
    <div className="w-full flex flex-col mt-28 pb-24 pl-64">
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

      <div className="w-full flex flex-col gap-2">
        {messages.map((messages: any) => (
          messages.sender === 'user' ? (
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

      </div>

      {/* <button className='cursor-pointer' onClick={checkUser}>Check user</button> */}

      <ChatInput onSend={handleSend} />
    </div>
  )
}

export default App
