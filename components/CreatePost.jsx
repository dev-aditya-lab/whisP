import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';


const CreatePost = ({
  onCreate,
  maxLength = 500,
  buttonLabel = 'Create Post',
  placeholder = 'Share something...',
  autoCloseOnSuccess = true,
  containerClassName = '',
  buttonClassName = '',
  modalTitle = 'New Post',
}) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const remaining = maxLength - text.length;
  const overLimit = remaining < 0;
  const disabled = submitting || !text.trim() || overLimit;

  const close = useCallback(() => {
    if (!submitting) {
      setVisible(false);
    }
  }, [submitting]);

  const reset = () => {
    setText('');
  };

  const handleCreate = async () => {
    if (disabled) return;
    try {
      setSubmitting(true);
      if (onCreate) {
        await Promise.resolve(onCreate(text.trim()));
      }
      if (autoCloseOnSuccess) {
        close();
        reset();
      } else {
        // Keep modal open but clear input
        reset();
      }
    } catch (err) {
      console.error('CreatePost error:', err);
      Alert.alert('Post Failed', err?.message || 'Unable to create the post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className={containerClassName}>
      {/* Trigger Button */}
      <TouchableOpacity
        className={`bg-purple-600 px-4 py-3 rounded-xl items-center ${buttonClassName}`}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <Text className="text-white font-semibold">{buttonLabel}</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={close}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 bg-gray-900"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
            <TouchableOpacity onPress={close} disabled={submitting}>
              <Text className="text-blue-400 text-lg">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">{modalTitle}</Text>
            <TouchableOpacity
              onPress={handleCreate}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg ${
                disabled ? 'bg-gray-600' : 'bg-purple-600'
              }`}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Post</Text>
              )}
            </TouchableOpacity>
          </View>

            {/* Body */}
          <View className="flex-1 p-4">
            <Text className="text-white font-bold text-lg mb-2">Content</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              className="bg-gray-800 border border-gray-700 rounded-xl text-white p-4 min-h-[180px]"
              multiline
              textAlignVertical="top"
              maxLength={maxLength + 50} // allow a little overflow buffer UI wise but we enforce style
              editable={!submitting}
            />
            <View className="flex-row justify-between mt-2 items-center">
              <Text className={`text-sm ${overLimit ? 'text-red-400' : remaining <= 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over limit`}
              </Text>
              <Text className="text-gray-500 text-xs">Max {maxLength} chars</Text>
            </View>

            <View className="mt-6 bg-gray-800 p-4 rounded-xl border border-gray-700">
              <Text className="text-white font-semibold mb-1">Posting Guidelines</Text>
              <Text className="text-gray-400 text-xs leading-4">
                Be respectful. Avoid sharing personal sensitive data. Keep it concise and engaging.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default CreatePost;
