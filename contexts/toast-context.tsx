'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastState = "initial" | "loading" | "success";

interface ToastContextType {
  state: ToastState;
  showToast: boolean;
  setState: (state: ToastState) => void;
  setShowToast: (show: boolean) => void;
  handleSave: () => void;
  handleReset: () => void;
  handleWorkspaceDeleted: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState>("initial");
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setState("loading");
    setTimeout(() => {
      setState("success");
      setTimeout(() => {
        setState("initial");
        setShowToast(false);
        window.location.reload();
      }, 2000);
    }, 1500);
  };

  const handleReset = () => {
    setState("initial");
    setShowToast(false);
  };

  const handleWorkspaceDeleted = () => {
    setShowToast(true);
    setState("initial");
  };

  return (
    <ToastContext.Provider
      value={{
        state,
        showToast,
        setState,
        setShowToast,
        handleSave,
        handleReset,
        handleWorkspaceDeleted,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 