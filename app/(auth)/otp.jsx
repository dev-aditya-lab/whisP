import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authenticate, sendOtp } from '../../utils/apiCalling';
import { setAuthToken } from '../../utils/AuthToken';
import { setUserId } from '../../utils/saveUserID';

export default function OTPVerification() {
  const { phoneNumber } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']); // 4-digit, adjust if backend changes
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  // Removed useAuth; using direct API helpers
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPhoneNumber = (number) => {
    if (!number) return '';
    const cleaned = number.toString();
    return `+1 ${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) {
      Alert.alert('Incomplete Code', 'Please enter the complete verification code');
      return;
    }
    setIsLoading(true);
    try {
      // Call authenticate API
      const resp = await authenticate({  phoneNumber:phoneNumber, otp: otpValue });
      // Expect resp.accessToken & resp.user?._id based on earlier endpoint description
      console.log('Authentication response:', resp.data.id);

      if (resp.data.accessToken && resp.data.id) {
        await setAuthToken(resp.data.accessToken);
        await setUserId(resp.data.id);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Invalid Code', resp?.message || 'Please check and try again');
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setOtp(['', '', '', '']);
    try {
      const resp = await sendOtp({ phone: phoneNumber });
      if (resp?.error) {
        Alert.alert('Error', resp.error || 'Could not resend code');
      } else {
        Alert.alert('Code Sent', 'A new code has been sent');
        if (resp?.otp) console.log('New OTP (dev):', resp.otp);
      }
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not resend code');
      setCanResend(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 px-8 py-12">
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mb-8"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>

        {/* Header */}
        <View className="items-center mb-16">
          <Text className="text-2xl font-light text-white mb-2">
            Verification Code
          </Text>
          <Text className="text-gray-400 text-center text-sm mb-2">
            Enter the code sent to
          </Text>
          <Text className="text-white text-sm">
            {formatPhoneNumber(phoneNumber)}
          </Text>
        </View>

        {/* OTP Inputs */}
        <View className="flex-row justify-center space-x-3 mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg text-center text-white text-lg ${
                digit ? 'border-blue-500' : ''
              }`}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerifyOtp}
          disabled={isLoading}
          className={`rounded-lg py-4 mb-6 ${
            isLoading ? 'bg-gray-700' : 'bg-blue-600'
          }`}
        >
          <Text className="text-white text-center font-medium">
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <View className="items-center mb-8">
          {canResend ? (
            <TouchableOpacity onPress={handleResendCode}>
              <Text className="text-blue-400 text-sm">Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-500 text-sm">
              Resend in {resendTimer}s
            </Text>
          )}
        </View>

        {/* Footer */}
        <View className="mt-auto">
          <Text className="text-gray-500 text-xs text-center">
            Code expires in 10 minutes
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}