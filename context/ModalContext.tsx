"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextProps {
  isOpenModal: boolean;
  setIsOpenModal: (value: boolean) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <ModalContext.Provider value={{ isOpenModal, setIsOpenModal }}>
      {children}
    </ModalContext.Provider>
  );
};
