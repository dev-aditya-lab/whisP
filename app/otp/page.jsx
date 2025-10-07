'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Shield, Lock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { getItem, removeItem } from 'webdev-power-kit';
import { useRouter } from 'next/navigation';

export default function Otp() {
           const router = useRouter();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) { // Changed from 5 to 3
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4); // Changed from 6 to 4
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 4) newOtp[index] = char; // Changed from 6 to 4
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 3); // Changed from 5 to 3
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    console.log('OTP entered:', otpCode, 'Length:', otpCode.length); // Debug log
    
    if (otpCode.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get phone number from storage
      const phoneNo = getItem('phoneNumber');
      
      if (!phoneNo) {
        setError('Phone number not found. Please go back and try again.');
        setIsLoading(false);
        return;
      }

      console.log('Verifying OTP:', otpCode, 'for phone:', phoneNo);

      // TEST MODE - Check BEFORE API call
      if (otpCode === '1234') {
        console.log('OTP verified successfully (test mode)');
        removeItem('phoneNumber');
        alert('✅ OTP Verified Successfully!');
        router.push('/avtar'); // Uncomment when ready
        setIsLoading(false);
        return; // Exit early, don't call API
      }

      // PRODUCTION MODE - Only runs if OTP is not 1234
      const response = await fetch('YOUR_BACKEND_API/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otpCode,
          phoneNumber: phoneNo,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) { // Adjust based on your API response structure
        console.log('OTP verified successfully:', data);
        removeItem('phoneNumber');
        // router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    setOtp(['', '', '', '']);

    try {
      // Replace with your backend API endpoint
      const response = await fetch('YOUR_BACKEND_API/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add phone number or session token
          // phoneNumber: phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('OTP resent successfully');
        // Show success message
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
      inputRefs.current[0]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

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
          Verify Your Number
        </h1>
        <p className="text-center text-gray-600 text-sm px-4">
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* OTP Input Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter OTP
            </label>
            
            {/* OTP Input Boxes */}
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isOtpComplete || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                isOtpComplete && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Resend OTP */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 text-center mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors disabled:opacity-50 block mx-auto"
            >
              Resend OTP
            </button>
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
