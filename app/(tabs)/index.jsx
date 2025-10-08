import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { 
  AUTO_DELETE_OPTIONS, 
  getAutoDeleteSetting, 
  setAutoDeleteSetting 
} from '../../utils/autoDelete';


export default function AllScreen() {
const router = useRouter();
const [selectedOption, setSelectedOption] = useState(AUTO_DELETE_OPTIONS.NEVER);

  useEffect(() => {
    loadSetting();
  }, []);

  const loadSetting = async () => {
    const setting = await getAutoDeleteSetting();
    console.log('[Auto-Delete] Loaded setting:', setting);
    setSelectedOption(setting);
  };

  const handleOptionSelect = async (option) => {
    console.log('[Auto-Delete] Selected option:', option);
    setSelectedOption(option);
    const saved = await setAutoDeleteSetting(option);
    if (saved) {
      console.log('[Auto-Delete] Setting saved successfully');
    }
  };


  return (
    <ScrollView className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="bg-gray-800 pt-12 pb-4 px-5 border-b border-gray-700">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-white">WhisP</Text>
          <TouchableOpacity className="w-10 h-10 bg-gray-700 rounded-full items-center justify-center">
            <Text className="text-xl">🔔</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400">Anonymous Chat - Connect with anyone</Text>
      </View>

      <View className="p-5">
      {/* Message Disappearing Settings */}
      <View className="bg-gray-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-lg font-semibold mb-3">Auto-Delete Messages</Text>
        <Text className="text-gray-400 text-sm mb-4">Choose when your messages should automatically disappear</Text>
        
        <View className="space-y-2">
          <TouchableOpacity 
            onPress={() => handleOptionSelect(AUTO_DELETE_OPTIONS.NEVER)}
            className={`p-4 rounded-lg mb-2 flex-row justify-between items-center ${
              selectedOption === AUTO_DELETE_OPTIONS.NEVER ? 'bg-emerald-600' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white">Never</Text>
            <Text className={selectedOption === AUTO_DELETE_OPTIONS.NEVER ? 'text-white' : 'text-gray-400'}>
              {selectedOption === AUTO_DELETE_OPTIONS.NEVER ? '✓' : '∞'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleOptionSelect(AUTO_DELETE_OPTIONS.HOURS_24)}
            className={`p-4 rounded-lg mb-2 flex-row justify-between items-center ${
              selectedOption === AUTO_DELETE_OPTIONS.HOURS_24 ? 'bg-emerald-600' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white">After 24 hours</Text>
            <Text className={selectedOption === AUTO_DELETE_OPTIONS.HOURS_24 ? 'text-white' : 'text-gray-400'}>
              {selectedOption === AUTO_DELETE_OPTIONS.HOURS_24 ? '✓' : '24h'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleOptionSelect(AUTO_DELETE_OPTIONS.DAYS_7)}
            className={`p-4 rounded-lg mb-2 flex-row justify-between items-center ${
              selectedOption === AUTO_DELETE_OPTIONS.DAYS_7 ? 'bg-emerald-600' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white">After 7 days</Text>
            <Text className={selectedOption === AUTO_DELETE_OPTIONS.DAYS_7 ? 'text-white' : 'text-gray-400'}>
              {selectedOption === AUTO_DELETE_OPTIONS.DAYS_7 ? '✓' : '7d'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleOptionSelect(AUTO_DELETE_OPTIONS.DAYS_30)}
            className={`p-4 rounded-lg mb-2 flex-row justify-between items-center ${
              selectedOption === AUTO_DELETE_OPTIONS.DAYS_30 ? 'bg-emerald-600' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white">After 30 days</Text>
            <Text className={selectedOption === AUTO_DELETE_OPTIONS.DAYS_30 ? 'text-white' : 'text-gray-400'}>
              {selectedOption === AUTO_DELETE_OPTIONS.DAYS_30 ? '✓' : '30d'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleOptionSelect(AUTO_DELETE_OPTIONS.AFTER_READING)}
            className={`p-4 rounded-lg mb-2 flex-row justify-between items-center ${
              selectedOption === AUTO_DELETE_OPTIONS.AFTER_READING ? 'bg-emerald-600' : 'bg-gray-700'
            }`}
          >
            <Text className="text-white font-semibold">After reading</Text>
            <Text className="text-white">✓</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Temp chat */}
      <View className="bg-gray-800 rounded-lg p-4 mb-4">
        <Text className="text-white text-lg font-semibold mb-3">Temporary Chat</Text>
        <Text className="text-gray-400 text-sm mb-4">Create a one-time chat that disappears when you close it</Text>
        
        <TouchableOpacity onPress={() => router.push('/tempChat')} className="bg-purple-600 p-4 rounded-lg flex-row justify-between items-center">
          <View>
            <Text className="text-white font-semibold">Start Temp Chat</Text>
            <Text className="text-purple-200 text-xs mt-1">Chat deleted when closed</Text>
          </View>
          <Text className="text-2xl">💬</Text>
        </TouchableOpacity>
            </View>

      </View>
    </ScrollView>
  );
}