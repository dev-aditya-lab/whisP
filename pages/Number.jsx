'use client';
import React, { useState } from 'react';
import { ArrowRight, Shield, Lock } from 'lucide-react';
import Image from 'next/image';
 import { useRouter } from 'next/navigation';
import { setItem } from 'webdev-power-kit';

export default function Number() {
     const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleContinue = () => {
    if (phoneNumber.length === 10) {
      console.log('Phone:', countryCode + phoneNumber);
      setItem('phoneNumber', phoneNumber);
      // Navigate to next page or verify OTP
        router.push('/otp');
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
          Welcome to WhisP
        </h1>
        <p className="text-center text-gray-600 text-sm px-4">
          Enter your phone number to get started
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Phone Number Input Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Phone Number
            </label>
            
            <div className="flex gap-3 mb-4">
              {/* Country Code */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 px-3 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+86">🇨🇳 +86</option>
                <option value="+81">🇯🇵 +81</option>
              </select>

              {/* Phone Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your number"
                className="flex-1 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                maxLength={10}
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={phoneNumber.length !== 10}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                phoneNumber.length === 10
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              We'll send you a verification code via SMS to confirm your number
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
