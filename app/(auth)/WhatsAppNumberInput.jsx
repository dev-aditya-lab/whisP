import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthFooter from '../../components/AuthFooter';
import { sendOtp } from '../../utils/apiCalling';

export default function WhatsAppNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const { /* isAuthenticated etc. */ } = useAuth(); // optional

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})(\d*)$/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}${match[4] ? '-' + match[4] : ''}`;
      }
    }
    return cleaned;
  };

  const handlePhoneNumberChange = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  // Convert raw digits to E.164 format for India (+91) or fallback
  const toE164 = (rawDigits) => {
    if (!rawDigits) return '';
    let digits = rawDigits.replace(/\D/g, '');
    // If already starts with country code 91 and total length 12 (91 + 10) -> prefix '+'
    if (digits.startsWith('91') && digits.length === 12) return '+' + digits;
    // If plain 10-digit Indian number -> add +91
    if (digits.length === 10) return '+91' + digits;
    // If user already typed with leading country code including plus
    if (rawDigits.startsWith('+')) return rawDigits;
    // Fallback: just return with plus
    return '+' + digits;
  };

  const handleContinue = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid Whatsapp number');
      return;
    }

    setIsLoading(true);
    try {
      const cleanedDigits = phoneNumber.replace(/\D/g, '');
      const e164 = toE164(cleanedDigits);

      // Send multiple possible keys to satisfy unknown backend expectation
      // Backend should ignore extra keys it doesn't use.
      const resp = await sendOtp({
        phoneNumber: e164, // common naming
        phone: e164,       // previous attempt
        whatsapp: e164,    // just in case backend expects this
      });
      // Adjust below depending on actual response shape
      // Example possibilities: resp.success, resp.otp, resp.message, etc.
      if (resp?.success === false) {
        Alert.alert('Error', resp?.error || resp?.message || 'Failed to send OTP');
        return;
      }

      // (Optional) Log OTP if backend returns it for dev
      if (resp?.otp) {
        console.log('OTP (dev only):', resp.otp);
      }

      router.push({
        pathname: '/otp',
        params: { phoneNumber: cleanedDigits }
      });
    } catch (e) {
      console.log('sendOtp error:', e);
      Alert.alert('Error', e.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-8 py-12">
          {/* Header */}
          <View className="items-center mb-16">
            <Text className="text-2xl font-light text-white mb-2">
              Welcome to Charto
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Enter your whatsApp number to get started
            </Text>
          </View>

          {/* Phone Input */}
          <View className="mb-8">
            <Text className="text-gray-300 text-sm mb-4">Whatsapp Number</Text>
            <View className="flex-row items-center bg-gray-800 rounded-lg border border-gray-700 px-4 py-4">
              <Text className="text-gray-300 mr-3">+91</Text>
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="Enter Whatsapp number"
                placeholderTextColor="#6B7280"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                maxLength={15}
                autoFocus
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleContinue}
            disabled={isLoading || !phoneNumber.trim()}
            className={`rounded-lg py-4 mb-8 ${
              isLoading || !phoneNumber.trim()
                ? 'bg-gray-700'
                : 'bg-blue-600'
            }`}
          >
            <Text className="text-white text-center font-medium">
              {isLoading ? 'Sending...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          {/* Privacy */}
          <AuthFooter/>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}