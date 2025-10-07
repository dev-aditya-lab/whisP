'use client';
import React, { useState } from 'react';
import { ArrowRight, Shield, Lock, Check } from 'lucide-react';
import Image from 'next/image';
import { setItem } from 'webdev-power-kit';
import { useRouter } from 'next/navigation';

export default function Avatar() {
         const router = useRouter();
    
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 6 emoji options for avatar
  const avatarOptions = [
    { id: 1, emoji: '😊', label: 'Happy' },
    { id: 2, emoji: '🎨', label: 'Creative' },
    { id: 3, emoji: '🚀', label: 'Explorer' },
    { id: 4, emoji: '🌟', label: 'Star' },
    { id: 5, emoji: '🎭', label: 'Fun' },
    { id: 6, emoji: '🦄', label: 'Unique' },
  ];

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
    setError('');
  };

  const handleContinue = async () => {
    if (!selectedAvatar) {
      setError('Please select an avatar');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const selectedEmoji = avatarOptions.find(a => a.id === selectedAvatar);
      
      // TEST MODE - Skip API call for testing
      if (true) { // Change to false when ready for production
        console.log('Avatar selected:', selectedEmoji);
        setItem('userAvatar', selectedEmoji.emoji);
        alert(`✅ Avatar Set: ${selectedEmoji.emoji} ${selectedEmoji.label}`);
        router.push("/allChat")
        setIsLoading(false);
        return;
      }

      // PRODUCTION MODE - Call your backend API
      const response = await fetch('YOUR_BACKEND_API/set-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: selectedEmoji.emoji,
          avatarId: selectedAvatar,
          // Add user session/token if needed
          // userId: userId,
          // token: authToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('Avatar saved successfully:', data);
        setItem('userAvatar', selectedEmoji.emoji);
        // Navigate to chat/dashboard
        router.replace("/allChat")
        // window.location.href = '/chat';
      } else {
        setError(data.message || 'Failed to save avatar. Please try again.');
      }
    } catch (err) {
      console.error('Avatar save error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full">
              <Image 
                src="/logo.png" 
                alt="WhisP Logo" 
                width={48} 
                height={48} 
                className="w-12 h-12"
              />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Choose Your Avatar
        </h1>
        <p className="text-center text-gray-600 text-sm px-4">
          Pick an emoji that represents you
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Avatar Selection Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            {/* Avatar Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.id)}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                    selectedAvatar === avatar.id
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-105'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  {/* Check Mark for Selected */}
                  {selectedAvatar === avatar.id && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                  
                  {/* Emoji */}
                  <div className="text-5xl mb-2">{avatar.emoji}</div>
                  
                  {/* Label */}
                  <span className={`text-xs font-medium ${
                    selectedAvatar === avatar.id ? 'text-white' : 'text-gray-600'
                  }`}>
                    {avatar.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedAvatar || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                selectedAvatar && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 text-center">
              💡 You can change your avatar anytime from settings
            </p>
          </div>
        </div>
      </div>

      {/* Footer - Encryption Notice */}
      <div className="pb-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
            <Shield className="w-4 h-4" />
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            End-to-end encrypted
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            Your personal messages are secured with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
}