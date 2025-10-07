import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { updateMyProfile } from '../utils/apiCalling';


const ProfileUpdate = ({ visible, initialData, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // Form state - only editable fields as per requirements
  const [formData, setFormData] = useState({
    description: '',
    tags: [],
    interests: [],
  });
  
  // Input states
  const [newTag, setNewTag] = useState('');
  const [newInterest, setNewInterest] = useState('');
  
  // Predefined interests for quick selection
  const predefinedInterests = [
    'tech', 'music', 'travel', 'coding', 'art', 'sports', 
    'photography', 'gaming', 'reading', 'movies', 'fitness', 
    'cooking', 'dancing', 'writing', 'nature', 'fashion',
    'food', 'books', 'science', 'history', 'business'
  ];

  useEffect(() => {
    if (visible && initialData) {
      setFormData({
        description: initialData.description || '',
        tags: initialData.tags || [],
        interests: initialData.interests || [],
      });
    }
  }, [visible, initialData]);

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    
    if (!trimmedTag) {
      Alert.alert('Error', 'Please enter a tag');
      return;
    }
    
    if (formData.tags.length >= 3) {
      Alert.alert('Limit Reached', 'You can only have up to 3 tags');
      return;
    }
    
    if (formData.tags.includes(trimmedTag)) {
      Alert.alert('Duplicate', 'This tag already exists');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, trimmedTag]
    }));
    setNewTag('');
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addInterest = (interest) => {
    if (formData.interests.length >= 10) {
      Alert.alert('Limit Reached', 'You can only have up to 10 interests');
      return;
    }
    
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const addCustomInterest = () => {
    const trimmedInterest = newInterest.trim().toLowerCase();
    
    if (!trimmedInterest) {
      Alert.alert('Error', 'Please enter an interest');
      return;
    }
    
    if (formData.interests.length >= 10) {
      Alert.alert('Limit Reached', 'You can only have up to 10 interests');
      return;
    }
    
    if (formData.interests.includes(trimmedInterest)) {
      Alert.alert('Duplicate', 'This interest already exists');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, trimmedInterest]
    }));
    setNewInterest('');
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSave = async () => {
    // Validate form
    if (formData.description.length > 200) {
      Alert.alert('Error', 'Description must be 200 characters or less');
      return;
    }

    if (formData.tags.length > 3) {
      Alert.alert('Error', 'You can only have up to 3 tags');
      return;
    }

    if (formData.interests.length > 10) {
      Alert.alert('Error', 'You can only have up to 10 interests');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        description: formData.description.trim(),
        tags: formData.tags,
        interests: formData.interests,
      };

      const resp = await updateMyProfile(updateData);
      // Accept possible shapes: success wrappers or direct updated user
      const updatedUser = resp?.user || resp?.data?.user || resp?.data || resp;
      if (updatedUser) {
        Alert.alert('Success', 'Profile updated successfully!');
        onSuccess && onSuccess({ user: updatedUser });
        onClose();
      } else {
        Alert.alert('Update Failed', 'Unexpected server response');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Provide specific error messages based on error type
      if (error.message.includes('500')) {
        Alert.alert(
          'Server Error', 
          'The server is experiencing issues. This could be because:\n\n' +
          '• The profile update endpoint is not implemented yet\n' +
          '• Database connection issues\n' +
          '• Server configuration problems\n\n' +
          'Please contact the backend developer to implement the PATCH /users/:id endpoint.'
        );
      } else if (error.message.includes('404')) {
        Alert.alert(
          'Endpoint Not Found', 
          'The profile update endpoint does not exist. Please ask the backend developer to implement PATCH /users/:id'
        );
      } else if (error.message.includes('401') || error.message.includes('UNAUTHORIZED')) {
        Alert.alert(
          'Authentication Error', 
          'Your session has expired. Please log out and log back in.'
        );
      } else if (error.message.includes('Network')) {
        Alert.alert(
          'Network Error', 
          'Please check your internet connection and try again.'
        );
      } else {
        Alert.alert(
          'Update Failed', 
          error.message || 'An unexpected error occurred. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDescriptionInput = () => (
    <View className="mb-6">
      <Text className="text-white font-bold text-lg mb-2">Bio Description</Text>
      <TextInput
        value={formData.description}
        onChangeText={(text) => {
          if (text.length <= 200) {
            setFormData(prev => ({ ...prev, description: text }));
          }
        }}
        placeholder="Tell others about yourself..."
        placeholderTextColor="#9CA3AF"
        className="bg-gray-700 text-white p-4 rounded-xl border border-gray-600 min-h-[100px]"
        multiline
        textAlignVertical="top"
        maxLength={200}
      />
      <Text className={`text-sm mt-2 ${
        formData.description.length > 180 ? 'text-red-400' : 'text-gray-400'
      }`}>
        {formData.description.length}/200 characters
      </Text>
    </View>
  );

  const renderTagsSection = () => (
    <View className="mb-6">
      <Text className="text-white font-bold text-lg mb-2">
        Tags ({formData.tags.length}/3)
      </Text>
      
      {/* Current tags */}
      <View className="flex-row flex-wrap mb-3">
        {formData.tags.map((tag, index) => (
          <View key={index} className="bg-purple-600 px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center">
            <Text className="text-white text-sm font-medium mr-2">{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(tag)}>
              <Text className="text-white text-lg">×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      {/* Add new tag */}
      {formData.tags.length < 3 && (
        <View className="flex-row">
          <TextInput
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Add a tag..."
            placeholderTextColor="#9CA3AF"
            className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 flex-1 mr-2"
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={addTag}
            className={`px-4 py-3 rounded-xl ${
              newTag.trim() ? 'bg-purple-600' : 'bg-gray-600'
            }`}
            disabled={!newTag.trim()}
          >
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text className="text-gray-400 text-sm mt-2">
        Tags help others discover your profile (max 3)
      </Text>
    </View>
  );

  const renderInterestsSection = () => (
    <View className="mb-6">
      <Text className="text-white font-bold text-lg mb-2">
        Interests ({formData.interests.length}/10)
      </Text>
      
      {/* Current interests */}
      <View className="flex-row flex-wrap mb-3">
        {formData.interests.map((interest, index) => (
          <View key={index} className="bg-blue-600 px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center">
            <Text className="text-white text-sm font-medium mr-2">{interest}</Text>
            <TouchableOpacity onPress={() => removeInterest(interest)}>
              <Text className="text-white text-lg">×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      {/* Predefined interests */}
      {formData.interests.length < 10 && (
        <>
          <Text className="text-gray-300 text-sm mb-2">Quick Add:</Text>
          <View className="flex-row flex-wrap mb-3">
            {predefinedInterests
              .filter(interest => !formData.interests.includes(interest))
              .slice(0, 8) // Show only 8 quick options
              .map((interest, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => addInterest(interest)}
                  className="bg-gray-600 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-gray-300 text-sm">+ {interest}</Text>
                </TouchableOpacity>
              ))}
          </View>
          
          {/* Add custom interest */}
          <View className="flex-row">
            <TextInput
              value={newInterest}
              onChangeText={setNewInterest}
              placeholder="Add custom interest..."
              placeholderTextColor="#9CA3AF"
              className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 flex-1 mr-2"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={addCustomInterest}
              className={`px-4 py-3 rounded-xl ${
                newInterest.trim() ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              disabled={!newInterest.trim()}
            >
              <Text className="text-white font-semibold">Add</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      <Text className="text-gray-400 text-sm mt-2">
        Share what you&apos;re passionate about (max 10)
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-gray-900"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-blue-400 text-lg">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Edit Profile</Text>
          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${
              loading ? 'bg-gray-600' : 'bg-purple-600'
            }`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {renderDescriptionInput()}
          {renderTagsSection()}
          {renderInterestsSection()}
          
          {/* Info Section */}

          
          {/* Bottom padding for keyboard */}
          <View className="h-20" />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileUpdate;
