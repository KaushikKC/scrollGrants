// context/PopupContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context
interface PopupContextType {
    isOpen: boolean;
    popupData: string | null;
    togglePopupVisibility: (isOpen: boolean) => void;
    setPopupData: (data: string) => void;
}

// Create the context with default values
const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
    children: ReactNode;
}

export const PopupProvider = ({ children }: PopupProviderProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [popupData, setPopupDataState] = useState<string | null>(null);

    // Function to toggle the visibility of the popup
    const togglePopupVisibility = (visibility: boolean) => {
        setIsOpen(visibility);
    };

    // Function to set the data to be shown inside the popup
    const setPopupData = (data: string) => {
        setPopupDataState(data);
    };

    return (
        <PopupContext.Provider
            value={{ isOpen, popupData, togglePopupVisibility, setPopupData }}
        >
            {children}
        </PopupContext.Provider>
    );
};

// Hook to use the Popup context
export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};
