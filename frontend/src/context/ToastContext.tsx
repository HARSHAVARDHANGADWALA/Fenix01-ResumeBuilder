import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback(
        (message: string, type: ToastType = "info") => {
            const id = ++nextId;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 4000);
        },
        []
    );

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {toasts.length > 0 && (
                <div className="toast-container" role="status" aria-live="polite">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className={`toast toast-${toast.type}`}
                            onClick={() => removeToast(toast.id)}
                        >
                            <span className="toast-icon">
                                {toast.type === "success" && "✓"}
                                {toast.type === "error" && "✕"}
                                {toast.type === "warning" && "⚠"}
                                {toast.type === "info" && "ℹ"}
                            </span>
                            <span>{toast.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
