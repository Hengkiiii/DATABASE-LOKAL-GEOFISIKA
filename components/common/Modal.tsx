import React from "react";
import { ModalProps } from "@/interface/common/ModalProps";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.section
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full relative">
              <button
                onClick={onClose}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
              <h1 className="text-lg font-semibold mb-4">{title}</h1>
              {children}
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
