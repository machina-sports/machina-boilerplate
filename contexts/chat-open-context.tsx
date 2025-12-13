'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface ChatOpenContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

const ChatOpenContext = createContext<ChatOpenContextType | undefined>(undefined);

export function ChatOpenProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ChatOpenContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      {children}
    </ChatOpenContext.Provider>
  );
}

export function useChatOpen() {
  const context = useContext(ChatOpenContext);
  if (context === undefined) {
    throw new Error('useChatOpen must be used within a ChatOpenProvider');
  }
  return context;
}

