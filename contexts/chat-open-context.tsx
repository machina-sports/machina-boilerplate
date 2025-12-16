'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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

  // Bloquear scroll da página quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      // Salvar o scroll atual
      const scrollY = window.scrollY;
      
      // Bloquear scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restaurar scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restaurar posição do scroll
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup ao desmontar
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

