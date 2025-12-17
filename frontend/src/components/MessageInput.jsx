import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, MicIcon, MicOffIcon, PlayIcon, PauseIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !audioBlob) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
      audio: audioBlob,
    });
    setText("");
    setImagePreview("");
    setAudioBlob(null);
    setAudioUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success("Recording started...");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped");
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {audioUrl && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-3 flex-1">
            <button
              onClick={togglePlayback}
              className="text-brand-primary hover:text-brand-accent transition-colors"
              type="button"
            >
              {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </button>
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div className="bg-brand-primary h-2 rounded-full w-1/4"></div>
            </div>
            <span className="text-xs text-slate-400">Voice message</span>
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
          </div>
          <button
            onClick={removeAudio}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
            type="button"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`rounded-lg px-4 transition-all ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-slate-800/50 text-slate-400 hover:text-red-400"
          }`}
        >
          {isRecording ? <MicOffIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
        </button>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview && !audioBlob}
          className="bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg px-4 py-2 font-medium hover:from-brand-primary/90 hover:to-brand-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
