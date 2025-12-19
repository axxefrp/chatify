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
    <div className="border-t border-slate-700/50 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-950 backdrop-blur-sm p-4">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-4 flex items-center gap-3 animate-slideIn">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-xl border border-slate-700/50 shadow-lg group-hover:border-brand-primary/50 transition-all duration-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 shadow-lg transition-all duration-300 transform hover:scale-110"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-slate-400">Image attached</div>
        </div>
      )}

      {audioUrl && (
        <div className="max-w-3xl mx-auto mb-4 flex items-center space-x-3 animate-slideIn">
          <div className="flex items-center space-x-3 bg-slate-800/60 rounded-xl p-4 flex-1 backdrop-blur-sm border border-slate-700/50">
            <button
              onClick={togglePlayback}
              className="text-brand-primary hover:text-brand-accent transition-colors flex-shrink-0"
              type="button"
            >
              {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </button>
            <div className="flex-1">
              <div className="bg-slate-700/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-brand-primary to-brand-accent h-2 rounded-full w-1/4"></div>
              </div>
            </div>
            <span className="text-xs text-slate-400 flex-shrink-0">Voice message</span>
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
          </div>
          <button
            onClick={removeAudio}
            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 shadow-lg transition-all duration-300 flex-shrink-0"
            type="button"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl py-2.5 px-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:bg-slate-800/80 transition-all duration-300 backdrop-blur-sm"
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
          className={`bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-brand-primary rounded-xl px-4 py-2.5 transition-all duration-300 border border-slate-700/50 hover:border-brand-primary/50 backdrop-blur-sm flex items-center justify-center ${
            imagePreview ? "text-brand-primary border-brand-primary/50 bg-slate-800" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`rounded-xl px-4 py-2.5 transition-all duration-300 border flex items-center justify-center backdrop-blur-sm font-medium ${
            isRecording
              ? "bg-red-500/90 text-white animate-pulse border-red-400/50 shadow-lg shadow-red-500/20"
              : "bg-slate-800/60 text-slate-400 hover:text-slate-100 border-slate-700/50 hover:border-slate-600/50"
          }`}
        >
          {isRecording ? <MicOffIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
        </button>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview && !audioBlob}
          className="bg-gradient-to-r from-brand-primary to-indigo-500 text-white rounded-xl px-5 py-2.5 font-semibold hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-brand-primary/50"
        >
          <SendIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
