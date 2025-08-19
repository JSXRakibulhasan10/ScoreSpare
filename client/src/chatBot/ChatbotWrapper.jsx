import React, { useState } from "react";
import GeminiChatBot from "../pages/GeminiChatBot"

const ChatbotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50 flex items-center justify-center"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-[450px] h-[80vh] max-h-[800px] min-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 z-50 flex flex-col lg:w-[500px]">
          {/* Panel Header with Close Button */}
          <div className="flex justify-between items-center bg-green-600 text-white p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⚽</span>
              <div>
                <h2 className="font-bold text-lg">Football Chatbot</h2>
                <p className="text-sm text-green-100">Your football expert</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors p-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <GeminiChatBot />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWrapper;
