import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addMessage, type Message } from '../features/chat/chatSlice';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRightCircle, AudioLines, UploadIcon } from 'lucide-react';
import { selectAuth } from '../features/auth/userSlice';
import { useNavigate } from 'react-router-dom';

function ChatInput({ onSend }: any) {
  const dispatch = useDispatch<AppDispatch>()
  const messages = useSelector((state: RootState) => state.chat.messages);
  const { isAuthenticated } = useSelector(selectAuth)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [value, setValue] = useState('');

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // reset height
      textarea.style.height = textarea.scrollHeight + 'px'; // grow dynamically

      // Toggle overflow only if max height is reached
      const maxHeight = 160; // same as Tailwind max-h-40 (40 * 4px)
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
        textarea.style.height = maxHeight + 'px';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [value]);


  const submit = async (e?: any) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true);

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const text = value.trim();
    const newMessage: Message = { id: uuidv4(), text, sender: 'user' };
    const updatedMessage = [...messages, newMessage];
    dispatch(addMessage(newMessage));
    setValue('');

    try {
      console.log('--newly added: ', updatedMessage)
      await onSend(updatedMessage);
    } catch (err) {
      console.error('send failed', err);
    } finally {
      setLoading(false);
    }
  }

  function handleUpload() {
    console.log('Upload button clicked');
  }

  function handleVoiceMessage() {
    console.log('Voice button clicked');
  }

  return (
    <div className={`
      ${messages.length === 0 ? 'flex justify-center items-center h-[45rem] w-full mx-auto p-5 px-2 bg-[#fafaf9]'
        : 'fixed bottom-0 right-0 w-full mx-auto p-5 px-2 pl-64 bg-[#fafaf9]'
      }`}>
      <form onSubmit={submit} className="flex justify-center items-center gap-4 pt-0 w-full">
        <div className='flex flex-col gap-0 border border-stone-300 bg-stone-100 rounded-xl'>
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={'Ask anything'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            className="rounded-xl px-4 py-3 flex justify-center w-4xl 
          focus:outline-none resize-none
          overflow-hidden min-h-10 max-h-40 transition-all duration-75"
          />

          <div className='flex items-center justify-between px-4 py-2 text-stone-700'>
            <div className='flex items-center gap-2'>
              <button type='button' onClick={handleUpload} className='flex items-center gap-2 cursor-pointer border border-stone-300 px-2.5 py-1 rounded-full hover:bg-stone-200'>
                <UploadIcon color='#44403b ' className='w-4 h-4 cursor-pointer' />
                <div>Upload</div>
              </button>
              <button type='button' onClick={handleVoiceMessage} className='flex items-center gap-2 cursor-pointer border border-stone-300 px-2.5 py-1 rounded-full hover:bg-stone-200'>
                <AudioLines color='#44403b ' className='w-4 h-4 cursor-pointer' />
                <div>Voive</div>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || value.trim() === ''}
              className="flex items-center border-stone-300 bg-black rounded-full cursor-pointer disabled:opacity-50"
            >
              <ArrowRightCircle color='#f5f5f4' strokeWidth={1} className='w-8 h-8' />
            </button>

          </div>
        </div>


      </form>
    </div>
  )
}

export default ChatInput