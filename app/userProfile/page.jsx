'use client';
import MobileNav from '@/components/MobileNav';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Lock,
  ChevronRight,
  Camera,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getItem, setItem, removeItem } from 'webdev-power-kit';

export default function UserProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Avatar options
  const avatarOptions = [
    { id: 1, emoji: '😊', label: 'Happy' },
    { id: 2, emoji: '🎨', label: 'Creative' },
    { id: 3, emoji: '🚀', label: 'Explorer' },
    { id: 4, emoji: '🌟', label: 'Star' },
    { id: 5, emoji: '🎭', label: 'Fun' },
    { id: 6, emoji: '🦄', label: 'Unique' },
  ];

  const [isChangingAvatar, setIsChangingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const userToken = getItem('authToken');
        const userId = getItem('userId');

        // TEST MODE - Using dummy data
        const USE_TEST_DATA = true; // Set to false for production

        if (USE_TEST_DATA) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          const dummyProfile = {
            userId: userId || '12345',
            avatar: getItem('userAvatar') || '😊',
            joinedDate: '2024-01-15',
          };

          setUserProfile(dummyProfile);
        } else {
          // PRODUCTION - Call your backend API
          const response = await fetch('YOUR_BACKEND_API/user/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }

          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle avatar change
  const handleAvatarChange = async (avatar) => {
    try {
      const userToken = getItem('authToken');

      // TEST MODE
      const USE_TEST_DATA = true; // Set to false for production

      if (USE_TEST_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        setUserProfile(prev => ({
          ...prev,
          avatar: avatar.emoji,
        }));
        setItem('userAvatar', avatar.emoji);
        setIsChangingAvatar(false);
        alert(`✅ Avatar changed to ${avatar.emoji}`);
      } else {
        // PRODUCTION - Call your backend API
        const response = await fetch('YOUR_BACKEND_API/user/avatar', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            avatar: avatar.emoji,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update avatar');
        }

        const data = await response.json();
        setUserProfile(prev => ({
          ...prev,
          avatar: avatar.emoji,
        }));
        setItem('userAvatar', avatar.emoji);
        setIsChangingAvatar(false);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    try {
      const userToken = getItem('authToken');

      // TEST MODE
      const USE_TEST_DATA = true; // Set to false for production

      if (USE_TEST_DATA) {
        // Clear local storage
        removeItem('authToken');
        removeItem('userId');
        removeItem('userAvatar');
        removeItem('phoneNumber');

        console.log('Logged out successfully');
        alert('✅ Logged out successfully!');
        // Redirect to login/home page
        router.push('/');
      } else {
        // PRODUCTION - Call your backend API
        const response = await fetch('YOUR_BACKEND_API/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to logout');
        }

        // Clear local storage
        removeItem('authToken');
        removeItem('userId');
        removeItem('userAvatar');
        removeItem('phoneNumber');

        router.push('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 pt-6 pb-24 px-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-5xl">
                {userProfile?.avatar}
              </div>
              <button
                onClick={() => setIsChangingAvatar(true)}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              User ID: {userProfile?.userId}
            </h2>
            <p className="text-sm text-gray-600 text-center px-4 mb-4">
              🔒 Your privacy is our priority
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border border-blue-100">
              <p className="text-xs text-center text-gray-600 leading-relaxed">
                End-to-end encrypted chats • No data selling • Secure by design
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase px-2 mb-3">
            Settings
          </h3>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-800 font-medium">Account Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-800 font-medium">Privacy & Security</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-800 font-medium">Notifications</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Moon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-gray-800 font-medium">Dark Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Coming Soon</span>
            </div>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <Lock className="w-4 h-4" />
            <Shield className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-400">
            Member since {new Date(userProfile?.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            WhisP v1.0.0 • End-to-end encrypted
          </p>
        </div>
      </div>

      {/* Change Avatar Modal */}
      {isChangingAvatar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Choose Avatar</h3>
              <button
                onClick={() => setIsChangingAvatar(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarChange(avatar)}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center hover:scale-105 transition-all"
                >
                  <div className="text-5xl mb-2">{avatar.emoji}</div>
                  <span className="text-xs font-medium text-gray-700">{avatar.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
