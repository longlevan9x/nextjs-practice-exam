'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ModalContent = ReactNode | null;

interface ModalContextProps {
    showModal: (content: ModalContent) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [content, setContent] = useState<ModalContent>(null);

    const showModal = (modalContent: ModalContent) => {
        setContent(modalContent);
    };

    const closeModal = () => {
        setContent(null);
    };

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}
            {content && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-neutral-900 rounded-xs shadow-lg p-4 relative text-gray-900 dark:text-gray-100">
                        <button
                            onClick={closeModal}
                            className="absolute cursor-pointer top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>
                        {content}
                    </div>
                </div>

            )}
        </ModalContext.Provider>
    );
};
