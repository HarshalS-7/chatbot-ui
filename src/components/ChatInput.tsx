import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ArrowRightCircle, AudioLines, UploadIcon } from 'lucide-react';
import { selectAuth } from '../features/auth/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import VoiceInput from './VoiceInput';

function ChatInput({ onSend }: any) {
  const { id } = useParams()
  const messages = useSelector((state: RootState) => state.chat.conversations.find(c => c.id === id || c.id === state.chat.activeConversationId)?.messages || []);
  const { isAuthenticated } = useSelector(selectAuth)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [value, setValue] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);

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
    setValue('');
    await onSend(text);
    setLoading(false);
  }

  function handleUpload() {
    console.log('Upload button clicked');
  }

  function handleVoiceMessage() {
    setShowVoiceInput((prev) => !prev);
  }

  const handleSendVoice = async (file: File) => {
    console.log('Uploading voice file:', file);

    const formData = new FormData();
    formData.append('file', file);

    await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    });

    setShowVoiceInput(false);
  };

  return (
    <div
      className={`${
        messages.length === 0
          ? 'flex justify-center items-center h-[45rem] w-full mx-auto p-5 px-2 bg-[#fafaf9]'
          : 'fixed bottom-0 right-0 w-full mx-auto p-5 px-2 pl-64 bg-[#fafaf9]'
      }`}
    >
      <form
        onSubmit={submit}
        className="flex justify-center items-center gap-4 pt-0 w-full"
      >
        <div className="flex flex-col gap-0 border border-stone-300 bg-stone-100 rounded-xl w-5xl">
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
            className="rounded-xl px-4 py-3 flex justify-center 
          focus:outline-none resize-none
          overflow-hidden min-h-10 max-h-40 transition-all duration-75"
          />

          <div className='flex items-center justify-between px-4 py-2   '>
            <div className='flex items-center gap-2'>
              <button type='button' onClick={handleUpload} className='flex items-center gap-2 cursor-pointer border border-stone-300 px-2.5 py-1 rounded-full hover:bg-stone-200'>
                <UploadIcon color='#44403b ' className='w-4 h-4 cursor-pointer' />
                <div>Upload</div>
              </button>
              <button type='button' onClick={handleVoiceMessage} className='flex items-center gap-2 cursor-pointer border border-stone-300 px-2.5 py-1 rounded-full hover:bg-stone-200'>
                <AudioLines color='#44403b ' className='w-4 h-4 cursor-pointer' />
                <div>Voice</div>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || value.trim() === ''}
              className="flex items-center border-stone-300 bg-black rounded-full cursor-pointer disabled:opacity-50"
            >
              <ArrowRightCircle
                color="#f5f5f4"
                strokeWidth={1}
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
      </form>

      {showVoiceInput && (
        <VoiceInput
          onSend={handleSendVoice}
          onClose={() => setShowVoiceInput(false)}
        />
      )}
    </div>
  );
}

export default ChatInput;
