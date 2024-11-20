"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

interface OpenAIKeyContextProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const OpenAIKeyContext = createContext<OpenAIKeyContextProps | undefined>(undefined);

export const OpenAIKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <OpenAIKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </OpenAIKeyContext.Provider>
  );
};

export const useOpenAIKey = () => {
  const context = useContext(OpenAIKeyContext);
  if (!context) {
    throw new Error("useOpenAIKey must be used within an OpenAIKeyProvider");
  }
  return context;
};
