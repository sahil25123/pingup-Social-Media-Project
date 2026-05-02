import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import {
  addMessage,
  fetchMessages,
  resetMessages,
} from "../features/messges/messageSlice";
import toast from "react-hot-toast";
import api from "../api/axios";
import { ImageIcon, SendHorizonal } from "lucide-react";

function ChatBox() {
  const messages = useSelector((state) => state.messages.messages);
  const connections = useSelector((state) => state.connections.connections);

  const { userId } = useParams();
  const { getToken, userId: currentUserId } = useAuth(); // Get current user ID from auth
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  const msgEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({ token, userId }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      if (!text && !image) return;

      const token = await getToken();
      const formData = new FormData();

      formData.append("to_user_id", userId);
      formData.append("text", text);
      image && formData.append("image", image);

      const { data } = await api.post("/api/message/send", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setText("");
        setImage(null);
        dispatch(addMessage(data.message));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch messages when userId changes
  useEffect(() => {
    fetchUserMessages();

    return () => {
      dispatch(resetMessages());
    };
  }, [userId]);

  // Find the user from connections
  useEffect(() => {
    if (connections.length > 0) {
      const foundUser = connections.find(
        (connection) => connection._id === userId
      );
      setUser(foundUser);
    }
  }, [connections, userId]);

  return (
    <div className="flex flex-col h-screen bg-transparent">
      {/* Header - only show if user is loaded */}
      {user && (
        <div className="flex items-center gap-3 p-3 md:px-10 xl:pl-42 bg-white/70 backdrop-blur border-b border-slate-200">
          {user.profile_picture ? (
            <img src={user.profile_picture} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.full_name?.charAt(0) || "U"}
              </span>
            </div>
          )}{" "}
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="p-5 md:px-10 h-full overflow-y-scroll">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages && messages.length > 0 ? (
            messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                const isOwnMessage = message.from_user_id === currentUserId;

                return (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      isOwnMessage ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-2.5 text-sm max-w-sm rounded-xl shadow-sm ${
                        isOwnMessage
                          ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-br-none"
                          : "bg-white text-slate-700 rounded-bl-none subtle-border"
                      }`}
                    >
                      {message.message_type === "image" && (
                        <img
                          src={message.media_url}
                          className="w-full max-w-sm rounded-lg mb-1"
                          alt=""
                        />
                      )}
                      <p>{message.text}</p>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-center text-gray-400">
              No messages yet. Start the conversation!
            </p>
          )}
          <div ref={msgEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="px-4">
        <div className="flex items-center gap-3 pl-5 p-1.5 bg-white/95 w-full max-w-xl mx-auto border border-slate-200 shadow-sm rounded-full mb-5">
          <input
            type="text"
            className="flex-1 outline-none text-slate-700 bg-transparent"
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />

          <label htmlFor="image">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                className="h-8 rounded"
                alt=""
              />
            ) : (
              <ImageIcon className="size-7 text-slate-400 hover:text-slate-600 transition cursor-pointer" />
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <button
            onClick={sendMessage}
            className="bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 active:scale-95 cursor-pointer text-white p-2 rounded-full transition-all duration-300"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
