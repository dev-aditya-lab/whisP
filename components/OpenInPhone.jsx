import React from 'react';
import { Smartphone, Monitor, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const OpenInPhone = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                    {/* Icon Header */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br overflow-hidden w-24 h-24 from-blue-500 to-purple-600 p-6 rounded-full">
                                <Image src="/logo.png" alt="App Logo" width={500} height={500} className="scale-200 w-full h-full" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        WhisP
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-center text-gray-600 mb-8">
                        Mobile-First Experience
                    </p>

                    {/* Alert Box */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-400 rounded-xl p-6 mb-8 shadow-sm">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">
                                    📱 Best Viewed on Mobile
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    WhisP is designed with a mobile-first approach for the best experience. 
                                    Please open this website on your mobile phone for optimal functionality and design.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Warning */}
                    <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                            <Monitor className="w-6 h-6 text-blue-600" />
                            <h3 className="font-semibold text-gray-800">Desktop Version</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            The desktop mode is currently in the development phase. We're working hard to bring you an amazing experience across all devices!
                        </p>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
                        <div className="w-48 h-48 mx-auto bg-white rounded-xl shadow-inner flex items-center justify-center mb-4">
                            <div className="text-6xl">
                                <Image src="/qr.png" className='w-full h-full' alt="QR Code" width={150} height={150} />
                            </div>
                        </div>
                        <p className="text-gray-600 font-medium">
                            Scan QR code or visit on mobile
                        </p>
                    </div>

                    {/* Features */}
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                            <div className="text-3xl mb-2">⚡</div>
                            <p className="text-xs font-medium text-gray-700">Fast</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                            <div className="text-3xl mb-2">🎨</div>
                            <p className="text-xs font-medium text-gray-700">Beautiful</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                            <div className="text-3xl mb-2">✨</div>
                            <p className="text-xs font-medium text-gray-700">Intuitive</p>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Made with ❤️ By Team Ender Devs..
                </p>
            </div>
        </div>
    );
};

export default OpenInPhone;