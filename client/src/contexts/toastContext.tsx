'use client';

import React from "react";
import { toast, Toaster} from "react-hot-toast";



export const ToastContext = React.createContext({
    success: (message: string) => {},
    error: (message: string) => {},
    loading: (message: string) => {},
    dismiss: () => {},
});

export const useToast = () => React.useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const success = (message: string) => toast.success(message);
    const error = (message: string) => toast.error(message);
    const loading = (message: string) => toast.loading(message);
    const dismiss = () => toast.dismiss();

    return (
        <ToastContext.Provider value={{ success, error, loading, dismiss }}>
            {children}
            <Toaster 
                position="top-right"
                toastOptions={{
                duration: 3000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },
                success: {
                    duration: 3000,
                    iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                    },
                },
                error: {
                    duration: 4000,
                    iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                    },
                },
                }}
            />
        </ToastContext.Provider>
    )
}