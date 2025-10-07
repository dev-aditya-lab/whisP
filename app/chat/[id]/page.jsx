'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getItem } from 'webdev-power-kit';

export default function Chat() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.id;
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const messagesEndRef = useRef(null);

  // Console log the chat ID
  useEffect(() => {
    console.log('Chat ID:', chatId);
  }, [chatId]);

  // Fetch chat info and messages from backend
  useEffect(() => {
    const fetchChatData = async () => {
      setIsLoading(true);
      try {
        // Get user token from storage
        const userToken = getItem('authToken');
        
        // TEST MODE - Using dummy data
        const USE_TEST_DATA = true; // Set to false for production

        if (USE_TEST_DATA) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Dummy chat info
          const dummyChatInfo = {
            id: chatId,
            name: 'John Doe',
            avatar: '😊',
            isOnline: true,
            lastSeen: new Date().toISOString(),
          };

          // Dummy messages
          const dummyMessages = [
            {
              id: 1,
              senderId: chatId,
              text: 'Hey! How are you?',
              timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
              isSent: false,
            },
            {
              id: 2,
              senderId: 'me',
              text: 'I\'m good! How about you?',
              timestamp: new Date(Date.now() - 59 * 60000).toISOString(),
              isSent: true,
            },
            {
              id: 3,
              senderId: chatId,
              text: 'Doing great! Want to catch up later?',
              timestamp: new Date(Date.now() - 58 * 60000).toISOString(),
              isSent: false,
            },
            {
              id: 4,
              senderId: 'me',
              text: 'Sure! What time works for you?',
              timestamp: new Date(Date.now() - 57 * 60000).toISOString(),
              isSent: true,
            },
          ];

          setChatInfo(dummyChatInfo);
          setMessages(dummyMessages);
        } else {
          // PRODUCTION - Call your backend API
          const [infoResponse, messagesResponse] = await Promise.all([
            fetch(`YOUR_BACKEND_API/chat/${chatId}/info`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
              },
            }),
            fetch(`YOUR_BACKEND_API/chat/${chatId}/messages`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
              },
            }),
          ]);

          if (!infoResponse.ok || !messagesResponse.ok) {
            throw new Error('Failed to fetch chat data');
          }

          const infoData = await infoResponse.json();
          const messagesData = await messagesResponse.json();

          setChatInfo(infoData.chat);
          setMessages(messagesData.messages || []);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId) {
      fetchChatData();
    }
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    // Optimistically add message to UI
    const tempMessage = {
      id: Date.now(),
      senderId: 'me',
      text: messageText,
      timestamp: new Date().toISOString(),
      isSent: true,
      isPending: true,
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      // Get user token
      const userToken = getItem('authToken');

      // TEST MODE
      const USE_TEST_DATA = true; // Set to false for production

      if (USE_TEST_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update message to remove pending state
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? { ...msg, isPending: false } : msg
          )
        );
        
        console.log('Message sent (test mode):', messageText);
      } else {
        // PRODUCTION - Call your backend API
        const response = await fetch(`YOUR_BACKEND_API/chat/${chatId}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            message: messageText,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        
        // Update message with server response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? { ...data.message, isSent: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove failed message or mark as failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key to send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            {chatInfo && (
              <>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xl">
                    {chatInfo.avatar}
                  </div>
                  {chatInfo.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-800 truncate">
                    {chatInfo.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {chatInfo.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.isSent
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white shadow-sm'
              }`}
            >
              <p className={`text-sm ${message.isSent ? 'text-white' : 'text-gray-800'}`}>
                {message.text}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <p className={`text-xs ${message.isSent ? 'text-blue-100' : 'text-gray-400'}`}>
                  {formatTime(message.timestamp)}
                </p>
                {message.isPending && (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`p-3 rounded-full transition-all ${
              newMessage.trim() && !isSending
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg'
                : 'bg-gray-300'
            }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
