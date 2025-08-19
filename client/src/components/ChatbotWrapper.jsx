import React, { useState } from "react";
import GeminiChatBot from "../pages/GeminiChatBot";

const ChatbotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50"
      >
        💬
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 z-50 flex flex-col">
          {/* Panel Header with Close Button */}
          <div className="flex justify-between items-center bg-green-600 text-white p-3">
            <h2 className="font-bold text-lg">Football Chatbot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl font-bold hover:text-gray-200"
            >
              ❌
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto">
            <GeminiChatBot />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWrapper;
