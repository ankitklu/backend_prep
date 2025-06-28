import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Message {
  role: "bot" | "user";
  text: string;
  id: string;
  isTyping?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "bot", 
      text: "Hi! I'm your AI assistant. How can I help you today?", 
      id: "welcome",
      isTyping: false
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const typeMessage = (text: string, messageId: string) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, text: text.slice(0, index), isTyping: index < text.length }
                : msg
            )
          );
          index++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 30);
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { 
      role: "user", 
      text: input, 
      id: Date.now().toString() 
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      role: "bot",
      text: "",
      id: `typing-${Date.now()}`,
      isTyping: true
    };
    
    setMessages([...newMessages, typingMessage]);

    try {
      const res = await axios.post("http://localhost:5001/chat", { message: input });
      const { reply, redirect } = res.data;

      // Remove typing indicator and add real message
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('typing-')));
      
      const botMessage: Message = {
        role: "bot",
        text: "",
        id: `bot-${Date.now()}`,
        isTyping: true
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      await typeMessage(reply, botMessage.id);
      setIsTyping(false);

      if (redirect) {
        setTimeout(() => navigate(redirect), 1500);
      }
    } catch (err) {
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('typing-')));
      
      const errorMessage: Message = {
        role: "bot",
        text: "",
        id: `error-${Date.now()}`,
        isTyping: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      await typeMessage("I apologize, but I'm having trouble connecting right now. Please try again.", errorMessage.id);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <button
          className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-out"
          onClick={handleToggle}
        >
          <MessageCircle className="text-white" size={28} />
          
          {/* Floating notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`absolute bottom-0 right-0 transition-all duration-500 ease-out transform ${
          isOpen 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Assistant</h3>
                  <p className="text-blue-100 text-sm">
                    {isTyping ? "Typing..." : "Online"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90 transform"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-white rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-white rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 h-80 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "bot"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gradient-to-r from-green-500 to-teal-500 text-white"
                  }`}
                >
                  {msg.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl relative transform transition-all duration-300 hover:scale-105 ${
                    msg.role === "bot"
                      ? "bg-white shadow-md border border-gray-100 text-gray-800"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {msg.text}
                    {msg.isTyping && (
                      <span className="inline-block w-1 h-4 bg-current ml-1 animate-pulse">|</span>
                    )}
                  </p>
                  
                  {/* Message tail */}
                  <div
                    className={`absolute top-3 w-0 h-0 ${
                      msg.role === "bot"
                        ? "-left-2 border-t-8 border-r-8 border-t-transparent border-r-white"
                        : "-right-2 border-t-8 border-l-8 border-t-transparent border-l-blue-600"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white shadow-md border border-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none placeholder-gray-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                  input.trim() && !isTyping
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}