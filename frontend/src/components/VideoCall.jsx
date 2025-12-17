import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { PhoneIcon, PhoneOffIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "lucide-react";

function VideoCall({ onClose }) {
  const { selectedUser } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const [isInCall, setIsInCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    if (socket) {
      socket.on("incoming-call", handleIncomingCall);
      socket.on("call-answered", handleCallAnswered);
      socket.on("ice-candidate", handleIceCandidate);
      socket.on("call-ended", handleCallEnded);
    }

    return () => {
      if (socket) {
        socket.off("incoming-call", handleIncomingCall);
        socket.off("call-answered", handleCallAnswered);
        socket.off("ice-candidate", handleIceCandidate);
        socket.off("call-ended", handleCallEnded);
      }
    };
  }, [socket]);

  const handleIncomingCall = async (data) => {
    setIncomingCall(data);
  };

  const handleCallAnswered = async (data) => {
    setIsCalling(false);
    setIsInCall(true);
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const handleIceCandidate = async (data) => {
    if (data.candidate) {
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  const handleCallEnded = () => {
    endCall();
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnectionRef.current = new RTCPeerConnection(configuration);

      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            to: selectedUser._id,
            candidate: event.candidate,
          });
        }
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      socket.emit("call-user", {
        to: selectedUser._id,
        offer,
      });

      setIsCalling(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnectionRef.current = new RTCPeerConnection(configuration);

      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      peerConnectionRef.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            to: incomingCall.from,
            candidate: event.candidate,
          });
        }
      };

      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket.emit("answer-call", {
        to: incomingCall.from,
        answer,
      });

      setIncomingCall(null);
      setIsInCall(true);
    } catch (error) {
      console.error("Error answering call:", error);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsInCall(false);
    setIsCalling(false);
    setIncomingCall(null);
    socket.emit("end-call", { to: selectedUser._id });
    onClose();
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  if (incomingCall) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Incoming call from {incomingCall.callerName}
          </h3>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={answerCall}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <PhoneIcon className="w-5 h-5" />
              <span>Answer</span>
            </button>
            <button
              onClick={() => {
                setIncomingCall(null);
                onClose();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
            >
              <PhoneOffIcon className="w-5 h-5" />
              <span>Decline</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isInCall || isCalling) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="relative w-full h-full">
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Local video */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg border-2 border-white"
          />

          {/* Call controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-slate-700'} hover:bg-opacity-80 transition-colors`}
            >
              {isMuted ? <MicOffIcon className="w-6 h-6 text-white" /> : <MicIcon className="w-6 h-6 text-white" />}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-slate-700'} hover:bg-opacity-80 transition-colors`}
            >
              {isVideoOff ? <VideoOffIcon className="w-6 h-6 text-white" /> : <VideoIcon className="w-6 h-6 text-white" />}
            </button>
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <PhoneOffIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {isCalling && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-xl">
              Calling {selectedUser.fullName}...
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default VideoCall;