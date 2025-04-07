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
    if (state === "initial") {
      setState("loading");
      const loadingTimer = setTimeout(() => {
        setState("success");
        const successTimer = setTimeout(() => {
          setState("initial");
          setShowToast(false);
          window.location.reload();
        }, 2000);
        return () => clearTimeout(successTimer);
      }, 1500);
      return () => clearTimeout(loadingTimer);
    }
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