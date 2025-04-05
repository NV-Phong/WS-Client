import { toast } from "sonner";

export const toastConfig = {
  success: {
    className: "bg-green-50 border-green-200",
    style: {
      background: "var(--accent)",
      border: "1px solid var(--border)",
      color: "var(--accent-foreground)",
      borderRadius: "var(--radius)",
    },
  },
  error: {
    className: "bg-background border-border",
    style: {
      background: "var(--background)",
      border: "1px solid var(--border)",
      color: "var(--foreground)",
      borderRadius: "var(--radius)",
    },
  },
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      ...toastConfig.success,
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      ...toastConfig.error,
    });
  },
}; 