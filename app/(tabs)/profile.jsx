import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import ProfileUpdate from '../../components/ProfileUpdate';
import { apiCreatePost,  getMyProfile, getUserPosts,  } from '../../utils/apiCalling';
import handleLogout from '../../utils/handleLogout';

export default function Profile() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  
  const displayUser = profileData; // Only local state now

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      console.log('[Profile] Fetching profile via getMyProfile');
      const resp = await getMyProfile();
      const userData = resp?.user || resp?.data?.user || resp;
      if (!userData) {
        console.log('[Profile] Unexpected response shape:', resp);
        return;
      }
      const enriched = { ...userData };
      if (!enriched.interests || enriched.interests.length === 0) {
        enriched.interests = ['tech', 'music', 'travel', 'coding', 'art', 'sports', 'photography', 'gaming'];
      }
      setProfileData(enriched);
    } catch (error) {
      console.error('[Profile] Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      const resp = await getUserPosts();
      const arr = resp?.data?.posts || resp?.posts || resp;
      if (Array.isArray(arr)) setPosts(arr);
    } catch (e) {
      console.error('[Profile] Error fetching posts:', e);
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [fetchProfile, fetchUserPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchUserPosts()]);
    setRefreshing(false);
  };

  const handleProfileUpdateSuccess = (updatedUserData) => {
    if (updatedUserData?.user) {
      setProfileData(updatedUserData.user);
    }
    fetchProfile();
  };

  // Create Post handler using API then optimistic fallback
  const handleCreatePost = async (content) => {
    const optimisticPost = {
      id: `temp-${Date.now()}`,
      content,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setPosts(prev => [optimisticPost, ...prev]);

    try {
      const resp = await apiCreatePost({ content });
      // If API returns created post object, replace optimistic version
      const created = resp?.post || resp?.data?.post || resp?.data || resp; // flexible
      if (created && typeof created === 'object') {
        setPosts(prev => prev.map(p => p.id === optimisticPost.id ? { ...created, replacedTempId: optimisticPost.id } : p));
      }
      Alert.alert('Success', 'Post created successfully');
      // Refresh posts list to ensure correct order / server state
      fetchUserPosts();
    } catch (error) {
      console.error('[Profile] Create post error:', error);
      Alert.alert('Failed', error?.message || 'Unable to create post');
      setPosts(prev => prev.filter(p => p.id !== optimisticPost.id));
    }
  };



  const renderDropdownItem = (icon, text, onPress, isLast = false) => (
    <TouchableOpacity
      key={text}
      onPress={onPress}
      className={`flex-row items-center px-4 py-3 ${!isLast ? 'border-b border-gray-600' : ''}`}
    >
      <Text className="text-white text-base mr-3">{icon}</Text>
      <Text className="text-white text-sm font-medium">{text}</Text>
    </TouchableOpacity>
  );

  // Loading state while user data is being fetched
  if (!profileData && !loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Static Banner Section */}
        <View className="relative">
          {/* Header Section with Profile Info */}
          <View className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 pt-12 pb-6">
            
            {/* Static Dark Banner Overlay - covers top half */}
            <View className="absolute top-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-b-4   border-black/50" style={{ height: 120 }}>
              {/* Geometric pattern overlay */}
              <View className="absolute inset-0 overflow-hidden">
                {/* Diagonal lines pattern */}
                <View className="absolute -top-10 -left-10 w-40 h-40 border-2 border-purple-500/20 rounded-full" />
                <View className="absolute -top-5 -right-15 w-32 h-32 border border-pink-500/20 rounded-full" />
                <View className="absolute top-10 left-1/3 w-24 h-24 border border-blue-500/15 rounded-full" />
                
                {/* Floating dots pattern */}
                <View className="absolute top-8 left-8 w-2 h-2 bg-purple-400/30 rounded-full" />
                <View className="absolute top-12 right-12 w-1.5 h-1.5 bg-pink-400/30 rounded-full" />
                <View className="absolute top-16 left-1/2 w-1 h-1 bg-blue-400/30 rounded-full" />
                <View className="absolute top-6 left-1/4 w-1.5 h-1.5 bg-purple-300/20 rounded-full" />
                <View className="absolute top-20 right-1/3 w-2 h-2 bg-pink-300/20 rounded-full" />
                
                {/* Subtle gradient bars */}
                <View className="absolute top-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
                <View className="absolute bottom-4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent" />
              </View>
              
              {/* Central design element */}
              <View className="flex-1 items-center justify-center">
                <View className="relative">
                  {/* Main hexagon shape */}
                  <View className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-pink-600/30 transform rotate-45 rounded-lg border border-white/10" />
                  
                  {/* Inner hexagon */}
                  <View className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 transform rotate-45 rounded-lg" />
                  
                  {/* Center dot */}
                  <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/40 rounded-full" />
                </View>
              </View>
              
              {/* Settings Icon positioned in banner */}
              <View className="absolute top-3 right-4">
                <TouchableOpacity 
                  onPress={() => setSettingsVisible(!settingsVisible)}
                  className="w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/20"
                >
                  <Text className="text-white text-lg">⚙️</Text>
                </TouchableOpacity>
              </View>
            </View>

          {/* Profile Info Container */}
          <View className="items-center mt-5">
            {/* Avatar */}
            <View className="w-24 h-24 bg-gray-800/95 rounded-full items-center justify-center mb-4 border-4 ">
              <Text className="text-white text-4xl font-bold animate-bounce">
                {/* {displayUser?.U_Id?.charAt(2) || 'U'} */}
                👹
              </Text>
            </View>
            
            {/* User ID with verification */}
            <View className="flex-row items-center mb-4">
              <Text className="text-white text-xl font-bold mr-2">
                {displayUser?.U_Id || 'USR2024'}
              </Text>
              {displayUser?.isVerified && (
                <View className="w-6 h-6 rounded-full items-center justify-center">
                  <Image
                    source={require('../../assets/image.png')}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
              )}
              <TouchableOpacity 
                onPress={() => setEditProfileVisible(true)}
                className="ml-2 w-6 h-6 bg-purple-600 rounded-full items-center justify-center"
              >
                <Text className="text-white text-xs">✏️</Text>
              </TouchableOpacity>
            </View>
<Text className="text-gray-300 text-sm text-center px-6 mb-2">
              {displayUser?.description || 'This user prefers to keep an air of mystery about them.'}
            </Text>
        
          </View>

            {/* Settings Dropdown - positioned relative to banner */}
            {settingsVisible && (
              <View className="absolute top-14 right-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 z-20 min-w-[180px]">
                {renderDropdownItem('✏️', 'Edit Profile', () => {
                  setSettingsVisible(false);
                  setEditProfileVisible(true);
                })}
                {renderDropdownItem('🔒', 'Privacy Settings', () => {
                  setSettingsVisible(false);
                })}
                {renderDropdownItem('📱', 'Account Settings', () => {
                  setSettingsVisible(false);
                })}
                {renderDropdownItem('❓', 'Help & Support', () => {
                  setSettingsVisible(false);
                })}
                {renderDropdownItem('🚪', 'Logout', () => {
                  setSettingsVisible(false);
                  handleLogout();
                }, true)}
              </View>
            )}
        </View>

        {/* Content Section */}
 

        {loading && (
          <View className="items-center py-8">
            <Text className="text-white">Loading...</Text>
          </View>
        )}
        </View>
      </ScrollView>

      {/* Profile Update Modal */}
      <ProfileUpdate
        visible={editProfileVisible}
        initialData={displayUser}
        onClose={() => setEditProfileVisible(false)}
        onSuccess={handleProfileUpdateSuccess}
      />
    </View>
  );
}