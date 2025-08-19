import { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../config/constants';

export const useChat = () => {
    
  // ... move all state and functions from GeminiChatBot component here
  // Return all necessary values and functions
  return {
    messages,
    inputMessage,
    isLoading,
    error,
    isInputFocused,
    showQuickQuestions,
    messagesEndRef,
    setInputMessage,
    setIsInputFocused,
    handleKeyPress,
    sendMessage,
    handleQuickQuestion,
    formatTime
  };
};