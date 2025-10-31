import React, { useState, useRef } from "react";

interface VoiceInputProps {
  onSend: (file: File) => void;
  onClose: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onSend, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSend = () => {
    if (!audioChunks.current.length) return;
    const blob = new Blob(audioChunks.current, { type: "audio/webm" });
    const file = new File([blob], "voice-message.webm", { type: "audio/webm" });
    onSend(file);
  };

  return (
    <div className="fixed bottom-32 right-51 bg-stone-100 rounded-xl p-4 border border-stone-300 w-60 z-50">
      <h4 className="font-medium text-stone-700 mb-2">🎙 Voice Recorder</h4>

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="w-full bg-stone-200 cursor-pointer text-black py-2 rounded-md"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="w-full bg-red-600 text-white py-2 rounded-md"
        >
          Stop
        </button>
      )}

      {audioURL && (
        <div className="mt-3">
          <audio src={audioURL} controls className="w-full" />
          <div className="flex justify-between mt-3">
            <button
              onClick={handleSend}
              className="bg-black text-white px-3 py-1.5 rounded-md"
            >
              Send
            </button>
            <button
              onClick={onClose}
              className="border border-stone-400 px-3 py-1.5 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
