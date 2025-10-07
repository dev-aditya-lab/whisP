'use client';
import MobileNav from '@/components/MobileNav';
import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AllChat() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy chat data - Replace with your backend API call
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        // TEST DATA - Replace with actual API call
        const dummyChats = [
          {
            id: 1,
            name: 'John Doe',
            avatar: '😊',
            lastMessage: 'Hey! How are you doing?',
            timestamp: '2m ago',
            unreadCount: 3,
     
            isOnline: true,
          },
          {
            id: 2,
            name: 'Team Project',
            avatar: '🚀',
            lastMessage: 'Meeting at 3 PM tomorrow',
            timestamp: '15m ago',
            unreadCount: 0,
        
            isOnline: false,
          },
          {
            id: 3,
            name: 'Sarah Smith',
            avatar: '🌟',
            lastMessage: 'Thanks for your help!',
            timestamp: '1h ago',
            unreadCount: 1,
  
            isOnline: true,
          },
          {
            id: 4,
            name: 'Dev Squad',
            avatar: '🎨',
            lastMessage: 'New design uploaded',
            timestamp: '2h ago',
            unreadCount: 5,
     
            isOnline: false,
          },
          {
            id: 5,
            name: 'Alex Johnson',
            avatar: '🦄',
            lastMessage: 'See you later!',
            timestamp: '3h ago',
            unreadCount: 0,
       
            isOnline: false,
          },
          {
            id: 6,
            name: 'Study Group',
            avatar: '🎭',
            lastMessage: 'Assignment due Friday',
            timestamp: '5h ago',
            unreadCount: 2,
            isOnline: false,
          },
        ];

        // Simulate API delay
        setTimeout(() => {
          setChats(dummyChats);
          setFilteredChats(dummyChats);
          setIsLoading(false);
        }, 500);

        // PRODUCTION - Replace with your backend API
        // const response = await fetch('YOUR_BACKEND_API/chats');
        // const data = await response.json();
        // setChats(data.chats);
        // setFilteredChats(data.chats);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Filter chats based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);

  const handleChatClick = (chatId) => {
    console.log('Opening chat with ID:', chatId);
    // Navigate to chat page with dynamic ID
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Chats</h1>
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Chats List */}
      <div className="px-4 pt-2">
        {isLoading ? (
          // Loading Skeleton
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          // No Results
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No chats found' : 'No chats yet'}
            </h3>
            <p className="text-sm text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Start a conversation to see it here'}
            </p>
          </div>
        ) : (
          // Chat Items
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat.id)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-2xl">
                      {chat.avatar}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    {chat.isGroup && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-2">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
